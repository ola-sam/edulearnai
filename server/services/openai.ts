import OpenAI from "openai";

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
  sources?: string[];
}

/**
 * Generate a response from the AI tutor
 * @param request The AI tutor request
 * @returns The AI tutor response
 */
export async function generateTutorResponse(request: AITutorRequest): Promise<AITutorResponse> {
  const { userId, message, context } = request;
  
  // Create a system message with context about the student
  const systemMessage = createSystemPrompt(context);
  
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 600
    });

    return {
      content: response.choices[0].message.content || "I'm sorry, I couldn't generate a response."
    };
  } catch (error) {
    console.error("Error generating tutor response:", error);
    throw new Error("Failed to generate AI tutor response");
  }
}

/**
 * Create a system prompt with context about the student
 * @param context The context about the student
 * @returns The system prompt
 */
function createSystemPrompt(context?: AITutorRequest["context"]): string {
  let prompt = `You are an intelligent and helpful AI tutor for K-12 students. 
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

  return prompt;
}