import { useState, useRef, useCallback, useEffect } from "react";

export interface RealtimeEvent {
  type: string;
  transcript?: string;
  delta?: string;
  call_id?: string;
  name?: string;
  arguments?: string;
}

export interface ToolCall {
  type: string;
  call_id: string;
  name: string;
  arguments: string;
}

interface UseRealtimeConnectionProps {
  onToolCall?: (toolCall: ToolCall) => void;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
}

export function useRealtimeConnection({
  onToolCall,
  onTranscript,
  onError,
}: UseRealtimeConnectionProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Connect to the Realtime API
  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;

    try {
      setIsConnecting(true);

      // Create peer connection with ICE servers
      // STUN helps discover public IP, TURN provides relay for restrictive networks
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
        iceCandidatePoolSize: 10,
      });
      pcRef.current = pc;

      console.log("WebRTC: Peer connection created with ICE servers");

      // Set up audio element for playback
      if (!audioRef.current) {
        audioRef.current = document.createElement("audio");
        audioRef.current.autoplay = true;
      }

      // Handle incoming audio tracks
      pc.ontrack = (e) => {
        console.log("WebRTC: Received audio track", e.streams[0]);
        if (audioRef.current) {
          audioRef.current.srcObject = e.streams[0];
          setIsModelSpeaking(true);
        }
      };

      // Monitor connection state
      pc.onconnectionstatechange = () => {
        console.log("WebRTC: Connection state:", pc.connectionState);
      };

      pc.oniceconnectionstatechange = () => {
        console.log("WebRTC: ICE connection state:", pc.iceConnectionState);
        if (pc.iceConnectionState === "failed") {
          console.error("WebRTC: ICE connection failed!");
        }
      };

      pc.onicegatheringstatechange = () => {
        console.log("WebRTC: ICE gathering state:", pc.iceGatheringState);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("WebRTC: ICE candidate:", event.candidate.candidate);
        } else {
          console.log("WebRTC: ICE gathering complete");
        }
      };

      // Get user microphone
      console.log("WebRTC: Requesting microphone access...");
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = ms;
      console.log("WebRTC: Microphone access granted");

      // Add local audio track
      ms.getTracks().forEach((track) => {
        console.log("WebRTC: Adding audio track:", track.label);
        pc.addTrack(track, ms);
      });

      // Set up data channel for events
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      console.log("WebRTC: Data channel created, initial state:", dc.readyState);

      dc.onopen = () => {
        console.log("WebRTC: ✅ Data channel OPENED - connection ready!");
        setIsConnected(true);
        setIsConnecting(false);
      };

      dc.onclose = () => {
        console.log("WebRTC: Data channel closed");
        setIsConnected(false);
      };

      dc.onerror = (error) => {
        console.error("WebRTC: Data channel error:", error);
      };

      // Monitor data channel state changes
      const checkDataChannelState = setInterval(() => {
        if (dc.readyState === "open") {
          console.log("WebRTC: Data channel state check - OPEN");
          clearInterval(checkDataChannelState);
        } else {
          console.log("WebRTC: Data channel state check:", dc.readyState);
        }
      }, 1000);

      // Clear interval after 30 seconds
      setTimeout(() => clearInterval(checkDataChannelState), 30000);

      dc.onmessage = (e) => {
        try {
          const event: RealtimeEvent = JSON.parse(e.data);
          console.log("Received event:", event);

          // Handle different event types
          switch (event.type) {
            case "response.audio.delta":
              // Audio is being received
              setIsModelSpeaking(true);
              break;

            case "response.audio.done":
              // Audio response finished
              setIsModelSpeaking(false);
              break;

            case "conversation.item.input_audio_transcription.completed":
              if (onTranscript && event.transcript) {
                onTranscript(event.transcript, true);
              }
              break;

            case "conversation.item.input_audio_transcription.delta":
              if (onTranscript && event.delta) {
                onTranscript(event.delta, false);
              }
              break;

            case "response.function_call_arguments.done":
              if (onToolCall) {
                onToolCall({
                  type: "function_call",
                  call_id: event.call_id as string,
                  name: event.name as string,
                  arguments: event.arguments as string,
                });
              }
              break;

            case "input_audio_buffer.speech_started":
              setIsSpeaking(true);
              break;

            case "input_audio_buffer.speech_stopped":
              setIsSpeaking(false);
              break;
          }
        } catch (error) {
          console.error("Error parsing data channel message:", error);
        }
      };

      // Create offer
      console.log("WebRTC: Creating SDP offer...");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log("WebRTC: Local description set");
      console.log("WebRTC: Offer SDP (first 200 chars):", offer.sdp?.substring(0, 200));

      // Send offer to our backend immediately (OpenAI handles ICE trickling)
      console.log("WebRTC: Sending offer to backend...");
      const response = await fetch("/api/realtime/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Session creation failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Failed to create session: ${errorText}`);
      }

      console.log("WebRTC: Received response from backend");
      const sdpAnswer = await response.text();
      const callId = response.headers.get("X-Call-ID");
      console.log("WebRTC: Session created with call ID:", callId);
      console.log("WebRTC: Answer SDP (first 200 chars):", sdpAnswer.substring(0, 200));

      // Set remote description
      console.log("WebRTC: Setting remote description...");
      await pc.setRemoteDescription({
        type: "answer",
        sdp: sdpAnswer,
      });
      console.log("WebRTC: ✅ Remote description set - WebRTC negotiation complete!");
      console.log("WebRTC: Waiting for ICE to connect and data channel to open...");
      console.log("WebRTC: Current connection state:", pc.connectionState);
      console.log("WebRTC: Current ICE connection state:", pc.iceConnectionState);
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnecting(false);
      setIsConnected(false);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [isConnected, isConnecting, onToolCall, onTranscript, onError]);

  // Disconnect from the Realtime API
  const disconnect = useCallback(() => {
    // Close data channel
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }

    // Close peer connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Clean up audio element
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }

    setIsConnected(false);
    setIsSpeaking(false);
    setIsModelSpeaking(false);
  }, []);

  // Send a text message
  const sendMessage = useCallback(
    (text: string) => {
      if (!dcRef.current || !isConnected) {
        console.warn("Cannot send message: not connected");
        return;
      }

      const event = {
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
      };

      dcRef.current.send(JSON.stringify(event));

      // Trigger response
      dcRef.current.send(
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
      if (!dcRef.current || !isConnected) return;

      const event = {
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: callId,
          output: JSON.stringify(output),
        },
      };

      dcRef.current.send(JSON.stringify(event));

      // Trigger response
      dcRef.current.send(
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
    connect,
    disconnect,
    sendMessage,
    sendToolResult,
  };
}
