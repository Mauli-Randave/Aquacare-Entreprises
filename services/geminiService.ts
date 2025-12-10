import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS } from "../constants";
import { Product } from "../types";

// Initialize Gemini
// NOTE: In a real app, strict error handling for missing API keys is essential.
// For this demo, we assume the environment is set up correctly or fail gracefully.
const apiKey = process.env.API_KEY || ''; 
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const modelId = "gemini-2.5-flash";

/**
 * Uses Gemini to interpret a natural language query and recommend products.
 */
export const searchProductsWithAI = async (query: string): Promise<{ recommendedIds: string[], reasoning: string }> => {
  if (!ai) {
    console.warn("Gemini API Key missing. Returning fallback.");
    return { recommendedIds: [], reasoning: "AI Search unavailable (Missing API Key)." };
  }

  // Create a context string from the product catalog
  const productContext = PRODUCTS.map(p => 
    `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Desc: ${p.description}, Features: ${p.features.join(', ')}`
  ).join('\n');

  const prompt = `
    You are an intelligent sales assistant for Aquacare Enterprises.
    We sell Water Filters, Solar Coolers, and Solar Panels.
    Note: All prices are in Indian Rupees (₹).
    
    Here is our product catalog:
    ${productContext}

    User Query: "${query}"

    Task:
    1. Analyze the user's need.
    2. Select the most relevant products (max 3).
    3. Provide a brief, friendly reasoning for the selection.

    Return the result strictly as a JSON object with this schema:
    {
      "recommendedIds": ["id1", "id2"],
      "reasoning": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of matching product IDs"
            },
            reasoning: {
              type: Type.STRING,
              description: "Explanation for the recommendation"
            }
          },
          required: ["recommendedIds", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Search Error:", error);
    return { recommendedIds: [], reasoning: "Sorry, I couldn't process that request right now." };
  }
};

/**
 * Generates a creative product description based on name and basic specs.
 * Useful for the Admin Dashboard.
 */
export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  if (!ai) return "AI unavailable.";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Write a compelling, SEO-friendly e-commerce product description (approx 50 words) for a "${productName}" in the category "${category}". Highlight eco-friendliness and efficiency.`,
    });
    return response.text || "Could not generate description.";
  } catch (e) {
    console.error(e);
    return "Error generating description.";
  }
};