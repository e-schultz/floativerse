
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
