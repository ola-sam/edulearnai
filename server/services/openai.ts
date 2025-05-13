import OpenAI from "openai";
import { ragService } from "./rag";
import { CircuitBreaker } from "../utils/circuit-breaker";
import { AppError } from "../middleware/error-handler";

// Check if OpenAI API key is available
const hasOpenAIKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';

// Initialize the OpenAI client only if API key is available
let openai: OpenAI | null = null;
if (hasOpenAIKey) {
  openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000, // 30 seconds timeout
    maxRetries: 3 // Retry failed requests up to 3 times
  });
} else {
  console.warn('OpenAI API key not provided in openai.ts. AI tutor features will be disabled in local development.');
}

// Create circuit breaker for OpenAI API calls
const openaiCircuitBreaker = new CircuitBreaker('openai', {
  failureThreshold: 3,     // Open after 3 consecutive failures
  resetTimeout: 60000,     // Try again after 1 minute
  maxHalfOpenCalls: 2      // Allow 2 test calls in half-open state
});

// Wrapper for OpenAI API calls with circuit breaker
async function callOpenAIWithCircuitBreaker<T>(apiCall: () => Promise<T>): Promise<T> {
  if (!hasOpenAIKey || !openai) {
    throw new AppError('OpenAI API key not configured', 503);
  }
  
  try {
    return await openaiCircuitBreaker.execute(apiCall);
  } catch (error: any) {
    // If circuit is open, provide a fallback response
    if (error.message && error.message.includes('Circuit breaker')) {
      console.warn('OpenAI service unavailable, using fallback');
      throw new AppError('AI service temporarily unavailable', 503);
    }
    
    // Handle specific OpenAI API errors
    if (error.status === 429) {
      throw new AppError('AI service rate limit exceeded, please try again later', 429);
    }
    
    if (error.status >= 500) {
      throw new AppError('AI service error, please try again later', 503);
    }
    
    // Rethrow other errors
    throw error;
  }
}

// Define the interface for AI requests
export interface AITutorRequest {
  userId: number;
  message: string;
  context?: {
    grade?: number;
    subject?: string;
    recentLessons?: any[];
    quizResults?: any[];
  };
}

// Define the interface for AI responses
export interface AITutorResponse {
  content: string;
  sources?: any[];
}

/**
 * Generate a response from the AI tutor using RAG
 * @param request The AI tutor request
 * @returns The AI tutor response
 */
export async function generateTutorResponse(request: AITutorRequest): Promise<AITutorResponse> {
  const { userId, message, context } = request;
  
  // If OpenAI client is not available, return a mock response for local development
  if (!openai) {
    console.warn('Using mock tutor response for local development');
    return {
      content: "I'm a mock AI tutor response for local development. To enable the full AI features, please add your OpenAI API key to the .env file.",
      sources: []
    };
  }

  try {
    // Retrieve relevant curriculum documents based on the student's query and context
    const relevantDocuments = await ragService.findRelevantDocuments(
      message,
      {
        grade: context?.grade,
        subject: context?.subject,
        limit: 5,
        similarityThreshold: 0.7
      }
    );
    
    // Extract document sources for citation
    const sources = relevantDocuments.map(doc => ({
      id: doc.id,
      title: doc.title,
      grade: doc.grade,
      subject: doc.subject,
      documentType: doc.documentType
    }));
    
    // Format documents for inclusion in the prompt
    const documentsText = ragService.getDocumentsText(relevantDocuments);
    
    // Create a system message with context about the student
    const systemMessage = createSystemPrompt(context, documentsText);
    
    // Use circuit breaker pattern for OpenAI API call
    const response = await callOpenAIWithCircuitBreaker(async () => {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      return await openai!.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 600
      });
    });
    
    return {
      content: response.choices[0].message.content || "I'm sorry, I couldn't generate a response.",
      sources: sources.length > 0 ? sources : undefined
    };
  } catch (error: any) {
    console.error("Error generating tutor response:", error);
    
    // If there's an error and we're in local development without an API key, return a mock response
    if (!hasOpenAIKey) {
      console.warn('Falling back to mock tutor response after error');
      return {
        content: "I'm a mock AI tutor response for local development. An error occurred, but we're providing this fallback response. To enable the full AI features, please add your OpenAI API key to the .env file.",
        sources: []
      };
    }
    
    // Provide a user-friendly error message based on the error type
    if (error instanceof AppError) {
      // If it's already an AppError, just rethrow it
      throw error;
    } else if (error.status === 429) {
      throw new AppError('AI service is currently busy. Please try again in a few minutes.', 429);
    } else if (error.status >= 500) {
      throw new AppError('AI service is currently experiencing issues. Please try again later.', 503);
    } else {
      // Generic error message for other types of errors
      throw new AppError('Failed to generate AI tutor response. Please try again.', 500);
    }
  }
}

/**
 * Create a system prompt with context about the student and retrieved documents
 * @param context The context about the student
 * @param documentsText Retrieved curriculum documents text
 * @returns The system prompt
 */
function createSystemPrompt(context?: AITutorRequest["context"], documentsText?: string): string {
  let prompt = `You are JubunuAI, an intelligent and helpful AI tutor for K-12 students. 
Your responses should be educational, engaging, and appropriate for students.
Be supportive, encouraging, and use age-appropriate language and examples.
Focus on explaining concepts clearly and help students understand difficult topics.
If you don't know something, admit it rather than making up information.`;

  // Add grade-specific instructions
  if (context?.grade) {
    prompt += `\n\nYou are speaking with a student in grade ${context.grade}. Tailor your language and content to be appropriate for this grade level.`;
  }

  // Add subject-specific instructions
  if (context?.subject) {
    prompt += `\n\nThe student is currently studying ${context.subject}. Focus your assistance on this subject area.`;
  }

  // Add recent lessons context
  if (context?.recentLessons && context.recentLessons.length > 0) {
    prompt += `\n\nThe student has recently covered these lessons: ${context.recentLessons.map((l: any) => l.title).join(", ")}.`;
  }

  // Add quiz results context
  if (context?.quizResults && context.quizResults.length > 0) {
    const averageScore = context.quizResults.reduce((acc: number, result: any) => acc + (result.score / result.maxScore), 0) / context.quizResults.length;
    prompt += `\n\nThe student's average performance on recent quizzes is ${Math.round(averageScore * 100)}%.`;
  }
  
  // Add retrieved documents if available
  if (documentsText && documentsText.length > 0) {
    prompt += `\n\n### RETRIEVED CURRICULUM DOCUMENTS ###\nThe following curriculum documents are relevant to the student's question. Use them to provide accurate, curriculum-aligned responses.\n\n${documentsText}\n\n### END OF RETRIEVED DOCUMENTS ###`;
    
    prompt += `\n\nWhen answering the student's question, incorporate information from the retrieved curriculum documents when relevant. Cite your sources by mentioning the document titles used.`;
  }

  return prompt;
}