import fs from "fs/promises";
import path from "path";
import type { ContentChunk } from "./embeddings";

// Path to the embeddings file
const EMBEDDINGS_PATH = path.join(process.cwd(), "generated", "embeddings.json");

// Stored chunk with embedding
export interface StoredChunk extends ContentChunk {
  embedding: number[];
}

// In-memory cache for the vector store
let cachedStore: StoredChunk[] | null = null;

// Load the vector store from file
export async function loadVectorStore(): Promise<StoredChunk[]> {
  // Return cached store if available
  if (cachedStore) {
    return cachedStore;
  }

  try {
    const data = await fs.readFile(EMBEDDINGS_PATH, "utf-8");
    cachedStore = JSON.parse(data) as StoredChunk[];
    return cachedStore;
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.warn("Embeddings file not found. Run `npm run content:sync` to generate.");
      return [];
    }
    throw error;
  }
}

// Clear the cache (useful for hot reloading)
export function clearVectorStoreCache(): void {
  cachedStore = null;
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Search for similar chunks
export function searchSimilar(
  queryEmbedding: number[],
  chunks: StoredChunk[],
  options: {
    topK?: number;
    threshold?: number;
    filterType?: ContentChunk["type"][];
    filterRoute?: string;
  } = {}
): { chunk: StoredChunk; score: number }[] {
  const { topK = 5, threshold = 0.5, filterType, filterRoute } = options;

  // Filter chunks if needed
  let filteredChunks = chunks;

  if (filterType && filterType.length > 0) {
    filteredChunks = filteredChunks.filter((c) => filterType.includes(c.type));
  }

  if (filterRoute) {
    // Boost chunks from the current route but don't exclude others
    filteredChunks = filteredChunks.map((c) => ({
      ...c,
      // Add a small boost if on the same route
      routeBoost: c.route.startsWith(filterRoute) ? 0.05 : 0,
    }));
  }

  // Calculate similarity scores
  const scored = filteredChunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding) + ((chunk as { routeBoost?: number }).routeBoost || 0),
  }));

  // Filter by threshold, sort by score, and take top K
  return scored
    .filter((s) => s.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// Search with keywords boost (hybrid search)
export function searchHybrid(
  queryEmbedding: number[],
  queryKeywords: string[],
  chunks: StoredChunk[],
  options: {
    topK?: number;
    threshold?: number;
    filterType?: ContentChunk["type"][];
    semanticWeight?: number;
    keywordWeight?: number;
  } = {}
): { chunk: StoredChunk; score: number }[] {
  const {
    topK = 5,
    threshold = 0.5,
    filterType,
    semanticWeight = 0.7,
    keywordWeight = 0.3,
  } = options;

  // Filter chunks if needed
  let filteredChunks = chunks;
  if (filterType && filterType.length > 0) {
    filteredChunks = filteredChunks.filter((c) => filterType.includes(c.type));
  }

  // Normalize query keywords
  const normalizedKeywords = queryKeywords.map((k) => k.toLowerCase());

  // Calculate hybrid scores
  const scored = filteredChunks.map((chunk) => {
    // Semantic similarity
    const semanticScore = cosineSimilarity(queryEmbedding, chunk.embedding);

    // Keyword match score
    let keywordScore = 0;
    const chunkText = `${chunk.title} ${chunk.content}`.toLowerCase();
    const chunkKeywords = chunk.keywords?.map((k) => k.toLowerCase()) || [];

    for (const keyword of normalizedKeywords) {
      // Check if keyword is in content
      if (chunkText.includes(keyword)) {
        keywordScore += 0.3;
      }
      // Check if keyword matches chunk keywords
      if (chunkKeywords.some((k) => k.includes(keyword) || keyword.includes(k))) {
        keywordScore += 0.5;
      }
    }

    // Normalize keyword score (cap at 1.0)
    keywordScore = Math.min(keywordScore, 1.0);

    // Combined score
    const combinedScore = semanticScore * semanticWeight + keywordScore * keywordWeight;

    return { chunk, score: combinedScore };
  });

  // Filter by threshold, sort by score, and take top K
  return scored
    .filter((s) => s.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
