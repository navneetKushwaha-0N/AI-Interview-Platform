import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load .env file
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in .env file.");
  process.exit(1);
}

console.log("✅ API key loaded. Assured that my API key is working.");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuestion = async (domain, difficulty) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate a ${difficulty.toLowerCase()} level interview question for ${domain}. 
The question should be:
- Practical and relevant to real-world scenarios
- Appropriate for the ${difficulty} difficulty level
- Clear and well-structured
- Focused on testing both theoretical knowledge and practical application

Please provide only the question without any additional text or formatting.`;

    const result = await model.generateContent(prompt);
    const question = result.response.text().trim();

    return question;
  } catch (error) {
    console.error("Error generating question:", error);
    throw new Error("Failed to generate question");
  }
};

export const evaluateAnswer = async (question, userAnswer, domain, difficulty) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are an expert interviewer evaluating a candidate's answer for a ${domain} position.

Question: ${question}
Candidate's Answer: ${userAnswer}
Difficulty Level: ${difficulty}

Please evaluate this answer and provide:
1. A score from 0-10 (where 10 is excellent)
2. Detailed feedback including:
   - What was good about the answer
   - What could be improved
   - Specific suggestions for better responses
   - Key concepts that were missed (if any)

Format your response as JSON:
{
  "score": [number between 0-10],
  "feedback": "[detailed feedback text]"
}

Be constructive and helpful in your feedback while being accurate in your scoring.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    try {
      const evaluation = JSON.parse(text);
      return {
        score: Math.min(10, Math.max(0, evaluation.score)),
        feedback: evaluation.feedback,
      };
    } catch {
      return { score: 5, feedback: text };
    }
  } catch (error) {
    console.error("Error evaluating answer:", error);
    throw new Error("Failed to evaluate answer");
  }
};
