import { useState, useRef, useCallback, useEffect } from "react";

export interface RealtimeEvent {
  type: string;
  transcript?: string;
  delta?: string;
  call_id?: string;
  name?: string;
  arguments?: string;
  item_id?: string;
  content_index?: number;
}

export interface ToolCall {
  type: string;
  call_id: string;
  name: string;
  arguments: string;
}

interface UseRealtimeWebSocketProps {
  onToolCall?: (toolCall: ToolCall) => void;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
}

export function useRealtimeWebSocket({
  onToolCall,
  onTranscript,
  onError,
}: UseRealtimeWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [aiTranscript, setAiTranscript] = useState("");
  const [completedAiTranscript, setCompletedAiTranscript] = useState("");

  // Track current transcript buffers
  const userTranscriptBufferRef = useRef("");
  const aiTranscriptBufferRef = useRef("");

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Connect to the Realtime API via WebSocket
  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;

    try {
      setIsConnecting(true);
      console.log("Fetching ephemeral token...");

      // Get ephemeral token from our backend
      const tokenResponse = await fetch("/api/realtime/token");
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(`Failed to get ephemeral token: ${errorData.error || tokenResponse.statusText}`);
      }

      const { token } = await tokenResponse.json();
      console.log("Got ephemeral token, connecting to WebSocket...");

      // Connect to OpenAI Realtime API via WebSocket
      const ws = new WebSocket(
        `wss://api.openai.com/v1/realtime?model=gpt-realtime-mini`,
        ["realtime", `openai-insecure-api-key.${token}`]
      );
      wsRef.current = ws;

      ws.onopen = async () => {
        console.log("WebSocket connected!");
        setIsConnected(true);
        setIsConnecting(false);

        // Initialize audio context for playing model output
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        }

        // Get user microphone and start sending audio
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          audioStreamRef.current = stream;
          console.log("Microphone access granted");

          // Start processing audio in chunks
          await startAudioCapture(stream, ws);
        } catch (err) {
          console.error("Failed to get microphone:", err);
          if (onError) onError(err as Error);
        }
      };

      ws.onmessage = (event) => {
        try {
          const serverEvent: RealtimeEvent = JSON.parse(event.data);
          handleServerEvent(serverEvent);
        } catch (err) {
          console.error("Failed to parse server event:", err);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        setIsConnecting(false);
        if (onError) onError(new Error("WebSocket connection error"));
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        setIsConnected(false);
        setIsConnecting(false);
      };
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnecting(false);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [isConnected, isConnecting, onError]);

  // Handle audio capture and encoding
  const startAudioCapture = async (stream: MediaStream, ws: WebSocket) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const source = audioContext.createMediaStreamSource(stream);

    // Use ScriptProcessorNode for audio processing
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;

      const inputData = e.inputBuffer.getChannelData(0);
      const pcm16 = floatTo16BitPCM(inputData);
      const base64Audio = arrayBufferToBase64(pcm16);

      // Send audio to server
      ws.send(JSON.stringify({
        type: "input_audio_buffer.append",
        audio: base64Audio,
      }));
    };

    source.connect(processor);
    processor.connect(audioContext.destination);
  };

  // Convert Float32Array to PCM16
  const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  };

  // Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Handle server events
  const handleServerEvent = (event: RealtimeEvent) => {
    console.log("Server event:", event.type);

    switch (event.type) {
      case "response.output_audio.delta":
        setIsModelSpeaking(true);
        // Play audio chunk
        if (event.delta) {
          playAudioChunk(event.delta);
        }
        break;

      case "response.output_audio.done":
        setIsModelSpeaking(false);
        break;

      case "response.output_audio_transcript.delta":
        // Accumulate AI transcript and update state for real-time display
        if (event.delta) {
          setIsModelSpeaking(true); // Ensure UI shows transcript
          aiTranscriptBufferRef.current += event.delta;
          setAiTranscript(aiTranscriptBufferRef.current);
          console.log("AI delta:", aiTranscriptBufferRef.current);
        }
        break;

      case "response.output_audio_transcript.done":
        // Finalize AI transcript - only update state when complete
        if (event.transcript) {
          setAiTranscript(event.transcript);
          setCompletedAiTranscript(event.transcript);
          console.log("AI (final):", event.transcript);
        }
        break;

      case "conversation.item.input_audio_transcription.completed":
        // User transcript complete
        if (event.transcript) {
          setUserTranscript(event.transcript);
          console.log("You said:", event.transcript);
          if (onTranscript) {
            onTranscript(event.transcript, true);
          }
        }
        break;

      case "conversation.item.input_audio_transcription.delta":
        // User transcript in progress
        if (event.delta) {
          userTranscriptBufferRef.current += event.delta;
          setUserTranscript(userTranscriptBufferRef.current);
          if (onTranscript) {
            onTranscript(event.delta, false);
          }
        }
        break;

      case "response.created":
        // Reset AI transcript buffer for new response
        aiTranscriptBufferRef.current = "";
        setAiTranscript("");
        setCompletedAiTranscript("");
        break;

      case "input_audio_buffer.speech_started":
        // Interrupt AI if it's currently speaking
        if (isModelSpeaking) {
          console.log("User interrupted - stopping AI response");

          // Clear audio queue immediately
          audioQueueRef.current = [];
          isPlayingRef.current = false;
          setIsAudioPlaying(false);

          // Cancel the current response
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: "response.cancel",
              })
            );
          }

          setIsModelSpeaking(false);
        }

        // Reset user transcript buffer for new input
        userTranscriptBufferRef.current = "";
        setUserTranscript("");
        setIsSpeaking(true);
        break;

      case "response.function_call_arguments.done":
        if (onToolCall) {
          onToolCall({
            type: "function_call",
            call_id: event.call_id || "",
            name: event.name || "",
            arguments: event.arguments || "",
          });
        }
        break;

      case "input_audio_buffer.speech_stopped":
        setIsSpeaking(false);
        break;
    }
  };

  // Audio queue for continuous playback
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const nextStartTimeRef = useRef(0);

  // Play audio chunk from base64
  const playAudioChunk = async (base64Audio: string) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    try {
      // Resume audio context if suspended (required for autoplay)
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      const audioBuffer = audioContext.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      // Add to queue
      audioQueueRef.current.push(audioBuffer);

      // Start playback if not already playing
      if (!isPlayingRef.current) {
        playQueue();
      }
    } catch (err) {
      console.error("Failed to play audio chunk:", err);
    }
  };

  // Play audio queue continuously
  const playQueue = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext || audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsAudioPlaying(false);
      return;
    }

    isPlayingRef.current = true;
    setIsAudioPlaying(true);
    const audioBuffer = audioQueueRef.current.shift()!;

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    // Schedule playback
    const startTime = Math.max(
      audioContext.currentTime,
      nextStartTimeRef.current
    );
    source.start(startTime);
    nextStartTimeRef.current = startTime + audioBuffer.duration;

    // Play next chunk when this one ends
    source.onended = () => {
      playQueue();
    };
  };

  // Disconnect
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Clear audio queue
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    nextStartTimeRef.current = 0;

    setIsConnected(false);
    setIsSpeaking(false);
    setIsModelSpeaking(false);
    setIsAudioPlaying(false);
  }, []);

  // Send a text message
  const sendMessage = useCallback(
    (text: string) => {
      if (!wsRef.current || !isConnected) {
        console.warn("Cannot send message: not connected");
        return;
      }

      wsRef.current.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [
              {
                type: "input_text",
                text,
              },
            ],
          },
        })
      );

      // Trigger response
      wsRef.current.send(
        JSON.stringify({
          type: "response.create",
        })
      );
    },
    [isConnected]
  );

  // Send function call result
  const sendToolResult = useCallback(
    (callId: string, output: Record<string, unknown>) => {
      if (!wsRef.current || !isConnected) return;

      wsRef.current.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify(output),
          },
        })
      );

      // Trigger response
      wsRef.current.send(
        JSON.stringify({
          type: "response.create",
        })
      );
    },
    [isConnected]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    isModelSpeaking,
    isAudioPlaying,
    userTranscript,
    aiTranscript,
    completedAiTranscript,
    connect,
    disconnect,
    sendMessage,
    sendToolResult,
  };
}
