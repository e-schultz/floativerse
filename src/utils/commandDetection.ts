
/**
 * Utility functions for detecting and processing slash commands
 */

/**
 * Check for slash commands in the current line of text
 */
export interface SlashCommandInfo {
  command: string;
  fullText: string;
}

/**
 * Check if the current line contains a slash command
 */
export const checkForSlashCommand = (currentLine: string): SlashCommandInfo | null => {
  // Check if the line starts with a slash
  if (!currentLine.includes('/')) {
    return null;
  }
  
  // Find the last occurrence of slash in the line
  const lastSlashIndex = currentLine.lastIndexOf('/');
  const textAfterSlash = currentLine.substring(lastSlashIndex);
  
  // If it's just a slash with no characters after it, return the command
  if (textAfterSlash === '/') {
    return {
      command: '/',
      fullText: textAfterSlash
    };
  }
  
  // If there's a complete command after the slash
  if (textAfterSlash.length > 1) {
    // Extract the command part (everything from the slash to the end of the line)
    return {
      command: textAfterSlash.trim(),
      fullText: textAfterSlash.trim()
    };
  }
  
  return null;
};

/**
 * Process an AI prompt command from the textarea
 */
export const processAIPrompt = (
  textarea: HTMLTextAreaElement,
  promptType: string,
  commandWithText?: string | null
): { prompt: string; insertPosition: number } | null => {
  const { selectionStart, selectionEnd, value } = textarea;
  
  // Find the start and end of the current line
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
  const lineEnd = value.indexOf('\n', selectionEnd);
  const currentLine = value.substring(
    lineStart,
    lineEnd === -1 ? value.length : lineEnd
  );
  
  // Process different prompt types
  if (promptType === 'send') {
    // Send just the current line (removing the /send command if present)
    let promptText;
    
    if (commandWithText && commandWithText.startsWith('/send')) {
      // Extract the prompt content after the /send command
      promptText = commandWithText.replace(/^\/send\s*/, '').trim();
      
      if (!promptText) {
        promptText = "Please provide more information about the current topic.";
      }
    } else {
      // Use the current line as the prompt (excluding any slash command)
      promptText = currentLine.replace(/\/[a-z]+\s*/, '').trim();
      
      if (!promptText) {
        promptText = "Please provide more information about the current topic.";
      }
    }
    
    // Return the prompt and the position to insert the response
    return {
      prompt: promptText,
      insertPosition: lineEnd === -1 ? value.length : lineEnd
    };
  } else if (promptType === 'chat') {
    // Use the entire note content as context for the chat
    let promptText;
    
    if (commandWithText && commandWithText.startsWith('/chat')) {
      // Extract the prompt content after the /chat command
      promptText = commandWithText.replace(/^\/chat\s*/, '').trim();
      
      if (!promptText) {
        promptText = "Please summarize the key points in this document.";
      }
    } else {
      // Use a default chat prompt
      promptText = "Please summarize the key points in this document.";
    }
    
    // Return the prompt and the position to insert the response
    return {
      prompt: promptText,
      insertPosition: lineEnd === -1 ? value.length : lineEnd
    };
  }
  
  return null;
};
