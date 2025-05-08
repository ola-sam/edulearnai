import OpenAI from "openai";
import { storage } from "../storage";
import { CurriculumDocument, InsertCurriculumDocument } from "@shared/schema";

// Initialize the OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

/**
 * Service for Retrieval Augmented Generation (RAG)
 * Handles document storage, embedding generation, and similarity search
 */
export class RAGService {
  /**
   * Generate embeddings for a text document using OpenAI's embedding API
   * @param text The text to generate embeddings for
   * @returns Array of embedding vectors
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.embeddings.create({
        model: "text-embedding-3-large",
        input: text,
        encoding_format: "float"
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embeddings:", error);
      throw new Error("Failed to generate document embeddings");
    }
  }
  
  /**
   * Create a new curriculum document with embeddings
   * @param document The document to create
   * @returns The created document
   */
  async createDocument(document: InsertCurriculumDocument): Promise<CurriculumDocument> {
    try {
      // Generate embeddings for the document content
      const embedding = await this.generateEmbedding(document.content);
      
      // Store embeddings as JSON string
      const documentWithEmbedding: InsertCurriculumDocument = {
        ...document,
        vectorEmbedding: JSON.stringify(embedding)
      };
      
      // Create the document in storage
      return await storage.createCurriculumDocument(documentWithEmbedding);
    } catch (error) {
      console.error("Error creating document with embeddings:", error);
      throw new Error("Failed to create curriculum document");
    }
  }
  
  /**
   * Update embeddings for an existing document
   * @param id The document ID
   * @returns The updated document
   */
  async updateDocumentEmbedding(id: number): Promise<CurriculumDocument | undefined> {
    try {
      // Get the document
      const document = await storage.getCurriculumDocumentById(id);
      if (!document) {
        throw new Error(`Document with ID ${id} not found`);
      }
      
      // Generate new embeddings
      const embedding = await this.generateEmbedding(document.content);
      
      // Update the document with new embeddings
      return await storage.updateCurriculumDocumentEmbedding(id, JSON.stringify(embedding));
    } catch (error) {
      console.error(`Error updating embeddings for document ${id}:`, error);
      throw new Error("Failed to update document embeddings");
    }
  }
  
  /**
   * Retrieve relevant documents based on query
   * @param query The user's query
   * @param grade Optional grade filter
   * @param subject Optional subject filter
   * @param limit Maximum number of documents to return
   * @returns Array of relevant documents
   */
  async retrieveRelevantDocuments(
    query: string, 
    grade?: number, 
    subject?: string,
    limit: number = 3
  ): Promise<CurriculumDocument[]> {
    try {
      // Generate embeddings for the query
      const queryEmbedding = await this.generateEmbedding(query);
      
      // Retrieve documents based on filters
      let documents: CurriculumDocument[];
      
      if (grade && subject) {
        documents = await storage.getCurriculumDocumentsByGradeAndSubject(grade, subject);
      } else if (grade) {
        documents = await storage.getCurriculumDocumentsByGrade(grade);
      } else if (subject) {
        documents = await storage.getCurriculumDocumentsBySubject(subject);
      } else {
        documents = await storage.getCurriculumDocuments();
      }
      
      // If no documents match filters, return empty array
      if (documents.length === 0) {
        return [];
      }
      
      // Search for similar documents based on query embedding
      return await storage.searchSimilarDocuments(queryEmbedding, limit);
    } catch (error) {
      console.error("Error retrieving relevant documents:", error);
      throw new Error("Failed to retrieve curriculum documents");
    }
  }
  
  /**
   * Format documents for inclusion in AI context
   * @param documents The documents to format
   * @returns Formatted document content as a string
   */
  formatDocumentsForContext(documents: CurriculumDocument[]): { text: string, sources: any[] } {
    // If no documents, return empty string
    if (documents.length === 0) {
      return { text: "", sources: [] };
    }
    
    // Format each document and join with separators
    const documentTexts = documents.map(doc => 
      `DOCUMENT TITLE: ${doc.title}\nGRADE: ${doc.grade}\nSUBJECT: ${doc.subject}\nCONTENT:\n${doc.content}\n`
    );
    
    // Create sources metadata for citation
    const sources = documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      grade: doc.grade,
      subject: doc.subject,
      documentType: doc.documentType
    }));
    
    return { 
      text: documentTexts.join("\n---\n\n"),
      sources
    };
  }
}

// Export singleton instance
export const ragService = new RAGService();