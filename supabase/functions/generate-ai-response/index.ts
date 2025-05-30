
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Helper function to create system messages based on prompt content
 */
const createSystemMessage = (prompt: string) => {
  // Check if the prompt contains document context sections
  const hasDocumentContext = prompt.includes('DOCUMENT CONTEXT:');
  
  if (hasDocumentContext) {
    return 'You are a helpful AI assistant integrated into a note-taking app. You have been provided with document context from the user\'s notes. Use this context to provide accurate, relevant responses. Format your responses in markdown when appropriate.';
  }
  
  return 'You are a helpful AI assistant integrated into a note-taking app. Provide concise, helpful responses. Format your responses in markdown when appropriate.';
};

/**
 * Helper function to handle OpenAI API requests
 */
const generateOpenAIResponse = async (systemMessage: string, prompt: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error('Invalid response from OpenAI:', data);
    throw new Error('Invalid response from OpenAI');
  }

  return data.choices[0].message.content;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY environment variable not set');
    }

    const { prompt } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Create appropriate system message
    const systemMessage = createSystemMessage(prompt);
    console.log("Using system message:", systemMessage);
    
    // Generate response
    const generatedText = await generateOpenAIResponse(systemMessage, prompt);

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-response function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
