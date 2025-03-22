
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
 * Get coordinates of the cursor in the textarea
 */
export const getCursorCoordinates = (
  textareaElement: HTMLTextAreaElement,
  cursorPosition: number
): { top: number; left: number } | undefined => {
  // Create a hidden div to measure text dimensions
  const div = document.createElement('div');
  const span = document.createElement('span');
  
  // Copy styles from textarea to the div
  const styles = window.getComputedStyle(textareaElement);
  const textBeforeCursor = textareaElement.value.substring(0, cursorPosition);
  
  // Apply the same styles to the div as the textarea
  div.style.position = 'absolute';
  div.style.top = '0';
  div.style.left = '-9999px';
  div.style.width = styles.width;
  div.style.height = 'auto';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordBreak = 'break-word';
  div.style.fontSize = styles.fontSize;
  div.style.fontFamily = styles.fontFamily;
  div.style.lineHeight = styles.lineHeight;
  div.style.padding = styles.padding;
  div.style.border = styles.border;
  div.style.boxSizing = styles.boxSizing;
  
  // Add content up to cursor position
  div.textContent = textBeforeCursor;
  // Add a span at cursor position
  span.textContent = '';
  div.appendChild(span);
  
  document.body.appendChild(div);
  
  // Get coordinates
  const { top, left } = span.getBoundingClientRect();
  const textareaRect = textareaElement.getBoundingClientRect();
  
  // Clean up
  document.body.removeChild(div);
  
  return {
    top: top - textareaRect.top + 20, // Add a little offset to position below cursor
    left: left - textareaRect.left
  };
};

/**
 * Check if text contains a slash command
 */
export const checkForSlashCommand = (text: string): string | null => {
  // Check if the text has a slash followed by any characters (no spaces)
  const match = text.match(/\/(\w*)$/);
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
