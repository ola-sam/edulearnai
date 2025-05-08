import { storage } from "../storage";
import { InsertCurriculumDocument, type CurriculumDocument } from "@shared/schema";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface RagSimilarityResult {
  document: CurriculumDocument;
  similarity: number;
}

/**
 * RAG (Retrieval Augmented Generation) Service
 * Handles document embedding generation, document retrieval, and context augmentation
 */
class RagService {
  /**
   * Creates a curriculum document with an embedding vector
   * @param document Document data to create
   */
  async createDocument(document: Omit<InsertCurriculumDocument, "vectorEmbedding">): Promise<CurriculumDocument> {
    try {
      // First create the document without the embedding
      const newDocument = await storage.createCurriculumDocument({
        ...document,
        vectorEmbedding: undefined
      });
      
      // Then generate and add the embedding
      const embedding = await this.generateEmbedding(document.content);
      
      // Update the document with the embedding
      const updatedDocument = await storage.updateCurriculumDocumentEmbedding(
        newDocument.id,
        JSON.stringify(embedding) // Store as JSON string
      );
      
      return updatedDocument || newDocument;
    } catch (error) {
      console.error("Error creating document with embedding:", error);
      throw error;
    }
  }
  
  /**
   * Generate an embedding vector for text using OpenAI's embeddings API
   * @param text Text to generate embedding for
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw error;
    }
  }
  
  /**
   * Calculate cosine similarity between two vectors
   */
  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vectors must have the same dimensions");
    }
    
    let dotProduct = 0;
    let aMagnitude = 0;
    let bMagnitude = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      aMagnitude += a[i] * a[i];
      bMagnitude += b[i] * b[i];
    }
    
    aMagnitude = Math.sqrt(aMagnitude);
    bMagnitude = Math.sqrt(bMagnitude);
    
    return dotProduct / (aMagnitude * bMagnitude);
  }
  
  /**
   * Find the most relevant documents for a query
   * @param query User query to find documents for
   * @param options Optional parameters to filter documents
   */
  async findRelevantDocuments(
    query: string,
    options?: {
      grade?: number;
      subject?: string;
      limit?: number;
      similarityThreshold?: number;
    }
  ): Promise<CurriculumDocument[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query);
      
      // Get documents based on filters
      let documents: CurriculumDocument[] = [];
      
      if (options?.grade && options?.subject) {
        documents = await storage.getCurriculumDocumentsByGradeAndSubject(
          options.grade,
          options.subject
        );
      } else if (options?.grade) {
        documents = await storage.getCurriculumDocumentsByGrade(options.grade);
      } else if (options?.subject) {
        documents = await storage.getCurriculumDocumentsBySubject(options.subject);
      } else {
        documents = await storage.getCurriculumDocuments();
      }
      
      // Calculate similarity for each document
      const results: RagSimilarityResult[] = [];
      
      for (const document of documents) {
        // Skip documents without embeddings
        if (!document.vectorEmbedding) continue;
        
        try {
          // Parse the embedding from JSON string
          const documentEmbedding = JSON.parse(document.vectorEmbedding) as number[];
          
          // Safety check: Handle mock data with incorrect dimensions
          // In production with real embeddings, this should be removed
          if (documentEmbedding.length < 1536) {
            // If this is test data with short embeddings, just use text matching instead
            const matchScore = document.content.toLowerCase().includes(query.toLowerCase()) ? 0.9 : 0.1;
            results.push({ document, similarity: matchScore });
            continue;
          }
          
          // Calculate similarity
          const similarity = this.calculateCosineSimilarity(queryEmbedding, documentEmbedding);
          
          // Add to results if above threshold
          if (!options?.similarityThreshold || similarity >= options.similarityThreshold) {
            results.push({ document, similarity });
          }
        } catch (parseError) {
          console.warn(`Failed to parse embedding for document ${document.id}:`, parseError);
          // Skip this document and continue with others
          continue;
        }
      }
      
      // Sort by similarity (highest first)
      results.sort((a, b) => b.similarity - a.similarity);
      
      // Limit results if specified
      const limit = options?.limit || 5;
      const limitedResults = results.slice(0, limit);
      
      // Return just the documents
      return limitedResults.map(result => result.document);
    } catch (error) {
      console.error("Error finding relevant documents:", error);
      throw error;
    }
  }
  
  /**
   * Get the text content from documents to use as context
   * @param documents List of documents to extract content from
   */
  getDocumentsText(documents: CurriculumDocument[]): string {
    // Format documents as a combined text
    const documentsText = documents.map(doc => {
      return `DOCUMENT: ${doc.title} (Grade ${doc.grade}, ${doc.subject}, ${doc.documentType})
CONTENT: ${doc.content}
---`;
    }).join("\n\n");
    
    return documentsText;
  }
}

export const ragService = new RagService();