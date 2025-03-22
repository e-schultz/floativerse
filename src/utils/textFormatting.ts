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
  
  if (!selectedText && !['bullet', 'number', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(format)) {
    return text; // If no text is selected and not a list/heading format, don't change anything
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
    
    // Heading formatting
    case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
      const headingLevel = parseInt(format.charAt(1));
      const headingPrefix = '#'.repeat(headingLevel) + ' ';
      
      const headingLineStart = text.lastIndexOf('\n', start - 1) + 1;
      const headingLineEnd = text.indexOf('\n', start);
      const headingLine = text.substring(headingLineStart, headingLineEnd > -1 ? headingLineEnd : text.length);
      
      // Check if line already has a heading prefix
      const headingMatch = headingLine.match(/^(#{1,6})\s/);
      
      if (headingMatch && headingMatch[1].length === headingLevel) {
        // Remove heading if same level already exists
        const withoutHeading = headingLine.replace(/^#{1,6}\s/, '');
        formattedText = text.substring(0, headingLineStart) + withoutHeading + text.substring(headingLineEnd > -1 ? headingLineEnd : text.length);
      } else {
        // Remove any existing heading and add the new one
        const cleanLine = headingLine.replace(/^#{1,6}\s/, '');
        formattedText = text.substring(0, headingLineStart) + headingPrefix + cleanLine + text.substring(headingLineEnd > -1 ? headingLineEnd : text.length);
      }
      newCursorPosition = headingLineStart + headingPrefix.length + (headingMatch ? headingLine.replace(/^#{1,6}\s/, '').length : headingLine.length);
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
 * Simple and reliable function to get cursor coordinates in a textarea
 */
export const getCursorCoordinates = (
  textarea: HTMLTextAreaElement
): { top: number; left: number } => {
  // Create a mirror div to measure
  const mirror = document.createElement('div');
  
  // Copy styles from textarea
  const style = window.getComputedStyle(textarea);
  
  // Apply styles to mirror element
  mirror.style.width = style.width;
  mirror.style.padding = style.padding;
  mirror.style.fontFamily = style.fontFamily;
  mirror.style.fontSize = style.fontSize;
  mirror.style.lineHeight = style.lineHeight;
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordBreak = 'break-word';
  mirror.style.position = 'absolute';
  mirror.style.top = '0';
  mirror.style.left = '0';
  mirror.style.visibility = 'hidden';
  
  // Get text before cursor and replace spaces at the end with a visible character
  const text = textarea.value.substring(0, textarea.selectionStart);
  
  // Create content with a span at cursor position
  mirror.textContent = text;
  const marker = document.createElement('span');
  marker.textContent = '|';
  mirror.appendChild(marker);
  
  // Add mirror to document
  document.body.appendChild(mirror);
  
  // Get position
  const markerRect = marker.getBoundingClientRect();
  const textareaRect = textarea.getBoundingClientRect();
  
  // Clean up
  document.body.removeChild(mirror);
  
  // Return relative coordinates
  return {
    left: markerRect.left - textareaRect.left + textarea.scrollLeft,
    top: markerRect.top - textareaRect.top + textarea.scrollTop + markerRect.height
  };
};

/**
 * Check for slash command at cursor position
 */
export const checkForSlashCommand = (text: string): string | null => {
  // Simple check for a slash at the end of text or preceded by space/newline
  if (text.endsWith('/')) {
    return '/';
  }
  
  // Match /command
  const match = text.match(/(?:^|\s)\/(\w*)$/);
  if (match) {
    return `/${match[1]}`;
  }
  
  return null;
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
  
  // Clean the prompt based on the prompt type
  let cleanedPrompt = text;
  
  if (promptType === 'send') {
    // Remove the /send command if present
    cleanedPrompt = text.replace(/\/send\s*$/, '').trim();
  } else if (promptType === 'chat') {
    // For chat prompt, take the entire note content for context
    cleanedPrompt = textareaElement.value.trim();
  }
  
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
  
  // Format the response with markdown blockquote
  const formattedResponse = `\n\n> ${response.replace(/\n/g, '\n> ')}\n\n`;
  
  const newText = text.substring(0, position) + formattedResponse + text.substring(position);
  textareaElement.value = newText;
  
  const newCursorPosition = position + formattedResponse.length;
  textareaElement.setSelectionRange(newCursorPosition, newCursorPosition);
  
  return newText;
};
