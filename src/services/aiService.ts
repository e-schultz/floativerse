
import { supabase } from "@/integrations/supabase/client";

// Type definitions for AI responses
export interface AIResponse {
  text: string;
  success: boolean;
  error?: string;
}

/**
 * Generate an AI response based on the provided prompt
 */
export const generateAIResponse = async (prompt: string): Promise<AIResponse> => {
  try {
    console.log("Sending prompt to AI:", prompt);
    
    const { data, error } = await supabase.functions.invoke("generate-ai-response", {
      body: { prompt }
    });
    
    if (error) {
      console.error("Error generating AI response:", error);
      return {
        text: "Sorry, I couldn't generate a response. Please try again later.",
        success: false,
        error: error.message
      };
    }
    
    if (!data || !data.generatedText) {
      return {
        text: "Sorry, I received an empty response. Please try again.",
        success: false
      };
    }
    
    return {
      text: data.generatedText,
      success: true
    };
  } catch (error) {
    console.error("Exception in AI response generation:", error);
    return {
      text: "Sorry, an unexpected error occurred. Please try again later.",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};
