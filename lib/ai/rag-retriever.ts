import OpenAI from "openai";
import { loadVectorStore, searchHybrid, type StoredChunk } from "./vector-store";
import type { ContentChunk } from "./embeddings";

const openai = new OpenAI();

// Extract keywords from query
function extractKeywords(query: string): string[] {
  const stopWords = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "can", "and", "but", "or", "for",
    "to", "in", "on", "with", "about", "what", "which", "who", "when",
    "where", "why", "how", "that", "this", "it", "he", "she", "they",
    "my", "your", "me", "you", "i", "we", "tell", "show", "know", "get",
    "see", "want", "please", "help", "more", "some", "many", "much",
  ]);

  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

// Retrieve context for a user query
export async function retrieveContext(
  query: string,
  options: {
    topK?: number;
    threshold?: number;
    filterType?: ContentChunk["type"][];
    currentRoute?: string;
  } = {}
): Promise<StoredChunk[]> {
  const { topK = 5, threshold = 0.3, filterType } = options;

  // Embed the query
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryEmbedding = response.data[0].embedding;

  // Extract keywords for hybrid search
  const keywords = extractKeywords(query);

  // Load the vector store
  const chunks = await loadVectorStore();

  if (chunks.length === 0) {
    console.warn("Vector store is empty. Run `npm run content:sync` to populate.");
    return [];
  }

  // Use hybrid search (semantic + keyword matching)
  const results = searchHybrid(queryEmbedding, keywords, chunks, {
    topK,
    threshold,
    filterType,
    semanticWeight: 0.6,
    keywordWeight: 0.4, // Boost keyword matching
  });

  // Debug logging
  console.log(`[RAG] Query: "${query}"`);
  console.log(`[RAG] Keywords: ${keywords.join(", ")}`);
  console.log(`[RAG] Found ${results.length} chunks:`);
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.chunk.title} (score: ${r.score.toFixed(3)})`);
  });

  return results.map((r) => r.chunk);
}

// Format retrieved context for the system prompt
export function formatContextForPrompt(chunks: StoredChunk[]): string {
  if (chunks.length === 0) {
    return "No specific context retrieved. Answer based on general portfolio knowledge.";
  }

  return chunks
    .map((chunk) => {
      let text = `[${chunk.type.toUpperCase()}: ${chunk.title}]`;
      text += `\nRoute: ${chunk.route}`;
      if (chunk.highlightId) {
        text += `\nHighlight ID: ${chunk.highlightId}`;
      }
      text += `\n${chunk.content}`;
      return text;
    })
    .join("\n\n---\n\n");
}

// Get navigation hints from retrieved context
export function getNavigationHints(chunks: StoredChunk[]): {
  routes: string[];
  highlightIds: string[];
} {
  const routes = new Set<string>();
  const highlightIds = new Set<string>();

  for (const chunk of chunks) {
    routes.add(chunk.route);
    if (chunk.highlightId) {
      highlightIds.add(chunk.highlightId);
    }
  }

  return {
    routes: Array.from(routes),
    highlightIds: Array.from(highlightIds),
  };
}

// Determine if query should navigate to a specific page
export function detectNavigationIntent(
  query: string,
  retrievedChunks: StoredChunk[]
): { shouldNavigate: boolean; suggestedRoute?: string; reason?: string } {
  const lowerQuery = query.toLowerCase();

  // Check for explicit navigation phrases
  const navigationPhrases = [
    "show me",
    "take me to",
    "go to",
    "navigate to",
    "see the",
    "view the",
    "look at",
  ];

  const hasNavigationIntent = navigationPhrases.some((phrase) =>
    lowerQuery.includes(phrase)
  );

  if (hasNavigationIntent && retrievedChunks.length > 0) {
    // Get the most relevant chunk's route
    const topChunk = retrievedChunks[0];
    return {
      shouldNavigate: true,
      suggestedRoute: topChunk.route,
      reason: `User wants to see content related to ${topChunk.title}`,
    };
  }

  // Check for specific page mentions
  const pageKeywords: Record<string, string> = {
    skills: "/skills",
    contact: "/contact",
    about: "/about",
    ventures: "/ventures",
    projects: "/",
    "case studies": "/",
    findu: "/projects/findu",
    mkrs: "/projects/mkrs",
    flock: "/projects/flock",
    bloom: "/projects/bloom",
  };

  for (const [keyword, route] of Object.entries(pageKeywords)) {
    if (lowerQuery.includes(keyword)) {
      return {
        shouldNavigate: true,
        suggestedRoute: route,
        reason: `User mentioned "${keyword}"`,
      };
    }
  }

  return { shouldNavigate: false };
}

// Extract key terms from a query for keyword matching
export function extractQueryKeywords(query: string): string[] {
  // Remove common stop words and extract meaningful terms
  const stopWords = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "shall", "can", "need", "dare",
    "and", "but", "or", "nor", "for", "yet", "so", "as", "of", "at",
    "by", "to", "in", "on", "with", "about", "what", "which", "who",
    "when", "where", "why", "how", "that", "this", "these", "those",
    "it", "its", "he", "she", "they", "them", "his", "her", "their",
    "my", "your", "our", "me", "you", "us", "i", "we", "tell", "show",
    "know", "get", "see", "want", "please", "help", "more", "some",
  ]);

  const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  return [...new Set(words)];
}
