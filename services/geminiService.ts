import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a summary for a given text using the Gemini API.
 * @param textToSummarize The text to be summarized (e.g., a paper's abstract).
 * @returns A promise that resolves to the generated summary string.
 */
export const summarizeText = async (textToSummarize: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following academic abstract for a general audience in 1-2 concise sentences. Focus on the key findings and their importance:\n\n---\n\n${textToSummarize}`
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini API:", error);
    throw new Error("Failed to connect to the summarization service.");
  }
};
