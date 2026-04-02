import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// Generate Interview Question
export const generateQuestion = async (domain, difficulty) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `Generate one ${difficulty} level interview question for ${domain}. Return only the question.`;

    const result = await model.generateContent(prompt);

    const question = result.response.text().trim();

    return question;

  } catch (error) {

    console.error("Error generating question:", error);
    throw new Error("Failed to generate question");

  }
};



// Evaluate Answer
export const evaluateAnswer = async (question, userAnswer, domain, difficulty) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are an expert interviewer.

Question: ${question}

Candidate Answer: ${userAnswer}

Return JSON:

{
 "score": number between 0-10,
 "feedback": "short improvement feedback"
}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text().trim();

    try {

      const evaluation = JSON.parse(text);

      return {
        score: evaluation.score,
        feedback: evaluation.feedback
      };

    } catch {

      return {
        score: 5,
        feedback: text
      };

    }

  } catch (error) {

    console.error("Error evaluating answer:", error);
    throw new Error("Failed to evaluate answer");

  }
};