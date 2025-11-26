#!/usr/bin/env tsx
/**
 * Content Sync Script
 *
 * Generates embeddings for all portfolio content and saves them to a local vector store.
 * Run with: npm run content:sync
 */

import fs from "fs/promises";
import path from "path";

const GENERATED_DIR = path.join(process.cwd(), "generated");
const EMBEDDINGS_PATH = path.join(GENERATED_DIR, "embeddings.json");

// Load environment variables from .env files (like Next.js does)
async function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    try {
      const content = await fs.readFile(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const [key, ...valueParts] = trimmed.split("=");
          const value = valueParts.join("=").replace(/^["']|["']$/g, "");
          if (key && !process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    } catch {
      // File doesn't exist, continue
    }
  }
}

async function ensureGeneratedDir() {
  try {
    await fs.access(GENERATED_DIR);
  } catch {
    await fs.mkdir(GENERATED_DIR, { recursive: true });
    console.log("Created generated/ directory");
  }
}

async function main() {
  // Load env vars before importing OpenAI-dependent modules
  await loadEnv();

  // Dynamic imports after env is loaded
  const { getAllContent } = await import("../content/loader");
  const { chunkContent, generateEmbeddings } = await import("../ai/embeddings");

  console.log("Starting content sync...\n");

  // Ensure the generated directory exists
  await ensureGeneratedDir();

  // Step 1: Load all content
  console.log("Loading content...");
  const content = await getAllContent();

  console.log(`  - ${content.caseStudies.length} case studies`);
  console.log(`  - ${content.projects.length} projects`);
  console.log(`  - ${content.ventures.length} ventures`);
  console.log(`  - ${content.press.length} press items`);
  console.log(`  - ${content.journey.length} journey steps`);
  console.log(`  - ${content.skills.categories.length} skill categories`);
  console.log("");

  // Step 2: Chunk content for embedding
  console.log("Chunking content...");
  const chunks = chunkContent(content);
  console.log(`  Created ${chunks.length} chunks\n`);

  // Step 3: Generate embeddings
  console.log("Generating embeddings (this may take a moment)...");
  const startTime = Date.now();

  try {
    const embeddedChunks = await generateEmbeddings(chunks);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`  Generated ${embeddedChunks.length} embeddings in ${duration}s\n`);

    // Step 4: Save to file
    console.log("Saving embeddings...");
    await fs.writeFile(EMBEDDINGS_PATH, JSON.stringify(embeddedChunks, null, 2));
    console.log(`  Saved to ${EMBEDDINGS_PATH}\n`);

    // Stats
    const fileStats = await fs.stat(EMBEDDINGS_PATH);
    const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
    console.log("Summary:");
    console.log(`  - Total chunks: ${embeddedChunks.length}`);
    console.log(`  - File size: ${fileSizeMB} MB`);
    console.log(`  - Embedding dimensions: ${embeddedChunks[0]?.embedding?.length || 0}`);
    console.log("\nContent sync complete!");
  } catch (error) {
    if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
      console.error("\nError: OPENAI_API_KEY environment variable is not set.");
      console.error("Please set it in your .env.local file or environment.\n");
      process.exit(1);
    }
    throw error;
  }
}

main().catch((error) => {
  console.error("Error during content sync:", error);
  process.exit(1);
});
