
/**
 * Apply formatting to the selected text in a textarea
 */
export const formatTextInTextarea = (
  textareaElement: HTMLTextAreaElement | null,
  format: string
): string => {
  if (!textareaElement) return '';
  
  const start = textareaElement.selectionStart;
  const end = textareaElement.selectionEnd;
  const text = textareaElement.value;
  const selectedText = text.substring(start, end);
  
  if (!selectedText && !['bullet', 'number'].includes(format)) {
    return text; // If no text is selected and not a list format, don't change anything
  }
  
  let formattedText = '';
  let newCursorPosition = end;
  
  switch (format) {
    case 'bold':
      formattedText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
      newCursorPosition = end + 4;
      break;
    case 'italic':
      formattedText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
      newCursorPosition = end + 2;
      break;
    case 'underline':
      formattedText = text.substring(0, start) + `__${selectedText}__` + text.substring(end);
      newCursorPosition = end + 4;
      break;
    case 'link':
      formattedText = text.substring(0, start) + `[${selectedText}](url)` + text.substring(end);
      newCursorPosition = end + 7;
      break;
    case 'image':
      formattedText = text.substring(0, start) + `![${selectedText}](image-url)` + text.substring(end);
      newCursorPosition = end + 12;
      break;
    case 'code':
      formattedText = text.substring(0, start) + '`' + selectedText + '`' + text.substring(end);
      newCursorPosition = end + 2;
      break;
    case 'bullet':
      // Get the line where the cursor is
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = text.indexOf('\n', start);
      const currentLine = text.substring(lineStart, lineEnd > -1 ? lineEnd : text.length);
      
      if (currentLine.trim().startsWith('- ')) {
        // Remove bullet if it exists
        const withoutBullet = currentLine.replace(/^(\s*)- /, '$1');
        formattedText = text.substring(0, lineStart) + withoutBullet + text.substring(lineEnd > -1 ? lineEnd : text.length);
      } else {
        // Add bullet
        formattedText = text.substring(0, lineStart) + `- ${currentLine}` + text.substring(lineEnd > -1 ? lineEnd : text.length);
      }
      newCursorPosition = start + 2;
      break;
    case 'number':
      // For simplicity, just add a "1. " prefix to the current line
      const numLineStart = text.lastIndexOf('\n', start - 1) + 1;
      const numLineEnd = text.indexOf('\n', start);
      const numCurrentLine = text.substring(numLineStart, numLineEnd > -1 ? numLineEnd : text.length);
      
      if (numCurrentLine.trim().match(/^\d+\.\s/)) {
        // Remove numbering if it exists
        const withoutNumber = numCurrentLine.replace(/^(\s*)\d+\.\s/, '$1');
        formattedText = text.substring(0, numLineStart) + withoutNumber + text.substring(numLineEnd > -1 ? numLineEnd : text.length);
      } else {
        // Add numbering
        formattedText = text.substring(0, numLineStart) + `1. ${numCurrentLine}` + text.substring(numLineEnd > -1 ? numLineEnd : text.length);
      }
      newCursorPosition = start + 3;
      break;
    default:
      return text;
  }
  
  // Set the new value and selection
  textareaElement.value = formattedText;
  textareaElement.setSelectionRange(newCursorPosition, newCursorPosition);
  
  return formattedText;
};

/**
 * Get the current line of text where the cursor is positioned
 */
export const getCurrentLine = (
  textareaElement: HTMLTextAreaElement | null
): { text: string, lineStart: number, lineEnd: number } | null => {
  if (!textareaElement) return null;
  
  const cursorPosition = textareaElement.selectionStart;
  const text = textareaElement.value;
  
  const lineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1;
  const lineEnd = text.indexOf('\n', cursorPosition);
  const actualLineEnd = lineEnd > -1 ? lineEnd : text.length;
  const currentLine = text.substring(lineStart, actualLineEnd);
  
  return {
    text: currentLine,
    lineStart,
    lineEnd: actualLineEnd
  };
};

/**
 * Check if text contains a slash command
 */
export const checkForSlashCommand = (text: string): string | null => {
  const match = text.match(/\/(\w+)$/);
  return match ? match[0] : null;
};

/**
 * Process a ChatGPT prompt from the current line
 */
export const processAIPrompt = (
  textareaElement: HTMLTextAreaElement | null,
  promptType: string
): {prompt: string, insertPosition: number} | null => {
  if (!textareaElement) return null;
  
  const lineInfo = getCurrentLine(textareaElement);
  if (!lineInfo) return null;
  
  const { text, lineStart, lineEnd } = lineInfo;
  
  // Remove the /send command from the prompt
  const cleanedPrompt = text.replace(/\/send\s*$/, '').trim();
  
  return {
    prompt: cleanedPrompt,
    insertPosition: lineEnd
  };
};

/**
 * Insert AI response into the text
 */
export const insertAIResponse = (
  textareaElement: HTMLTextAreaElement | null,
  response: string,
  position: number
): string => {
  if (!textareaElement) return '';
  
  const text = textareaElement.value;
  const formattedResponse = `\n\n> ${response}\n\n`;
  
  const newText = text.substring(0, position) + formattedResponse + text.substring(position);
  textareaElement.value = newText;
  
  const newCursorPosition = position + formattedResponse.length;
  textareaElement.setSelectionRange(newCursorPosition, newCursorPosition);
  
  return newText;
};
