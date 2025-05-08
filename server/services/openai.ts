import OpenAI from "openai";
import { ragService } from "./rag";

// Initialize the OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

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
  
  try {
    // Retrieve relevant curriculum documents based on the student's query and context
    const relevantDocuments = await ragService.retrieveRelevantDocuments(
      message,
      context?.grade,
      context?.subject
    );
    
    // Format documents for inclusion in the prompt
    const { text: documentsText, sources } = ragService.formatDocumentsForContext(relevantDocuments);
    
    // Create a system message with context about the student
    const systemMessage = createSystemPrompt(context, documentsText);
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 600
    });
    
    return {
      content: response.choices[0].message.content || "I'm sorry, I couldn't generate a response.",
      sources: sources.length > 0 ? sources : undefined
    };
  } catch (error) {
    console.error("Error generating tutor response:", error);
    throw new Error("Failed to generate AI tutor response");
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