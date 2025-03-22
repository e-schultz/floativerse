
/**
 * Utility functions for formatting text in the note editor
 */

/**
 * Format selected text with Markdown syntax
 */
export const formatTextInTextarea = (
  textarea: HTMLTextAreaElement | null,
  format: string
): string => {
  if (!textarea) return '';
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  
  let selectedText = text.substring(start, end);
  let replacement = '';
  let cursorPosition = 0;
  
  // Apply the requested formatting
  switch (format) {
    case 'bold':
      replacement = `**${selectedText}**`;
      cursorPosition = 2; 
      break;
    case 'italic':
      replacement = `*${selectedText}*`;
      cursorPosition = 1;
      break;
    case 'underline':
      replacement = `<u>${selectedText}</u>`;
      cursorPosition = 3;
      break;
    case 'h1':
      // Check if already formatted
      if (selectedText.startsWith('# ')) {
        replacement = selectedText.substring(2);
        cursorPosition = 0;
      } else {
        replacement = `# ${selectedText}`;
        cursorPosition = 2;
      }
      break;
    case 'h2':
      if (selectedText.startsWith('## ')) {
        replacement = selectedText.substring(3);
        cursorPosition = 0;
      } else {
        replacement = `## ${selectedText}`;
        cursorPosition = 3;
      }
      break;
    case 'h3':
      if (selectedText.startsWith('### ')) {
        replacement = selectedText.substring(4);
        cursorPosition = 0;
      } else {
        replacement = `### ${selectedText}`;
        cursorPosition = 4;
      }
      break;
    case 'bullet':
      // Split for multiple lines
      if (selectedText.includes('\n')) {
        const lines = selectedText.split('\n');
        replacement = lines.map(line => {
          if (line.startsWith('- ')) {
            return line.substring(2);
          } else if (line.trim() === '') {
            return line;
          } else {
            return `- ${line}`;
          }
        }).join('\n');
      } else {
        if (selectedText.startsWith('- ')) {
          replacement = selectedText.substring(2);
          cursorPosition = 0;
        } else {
          replacement = `- ${selectedText}`;
          cursorPosition = 2;
        }
      }
      break;
    case 'number':
      // Split for multiple lines
      if (selectedText.includes('\n')) {
        const lines = selectedText.split('\n');
        replacement = lines.map((line, index) => {
          if (line.match(/^\d+\. /)) {
            return line.replace(/^\d+\. /, '');
          } else if (line.trim() === '') {
            return line;
          } else {
            return `${index + 1}. ${line}`;
          }
        }).join('\n');
      } else {
        if (selectedText.match(/^\d+\. /)) {
          replacement = selectedText.replace(/^\d+\. /, '');
          cursorPosition = 0;
        } else {
          replacement = `1. ${selectedText}`;
          cursorPosition = 3;
        }
      }
      break;
    case 'code':
      if (selectedText.startsWith('`') && selectedText.endsWith('`')) {
        replacement = selectedText.substring(1, selectedText.length - 1);
        cursorPosition = 0;
      } else {
        replacement = `\`${selectedText}\``;
        cursorPosition = 1;
      }
      break;
    case 'link':
      if (selectedText.match(/^\[.*\]\(.*\)$/)) {
        replacement = selectedText.replace(/^\[(.*)\]\((.*)\)$/, '$1');
        cursorPosition = 0;
      } else {
        replacement = `[${selectedText}](url)`;
        cursorPosition = selectedText.length + 3;
      }
      break;
    default:
      replacement = selectedText;
      break;
  }
  
  // Replace the selected text with the formatted text
  const newText = text.substring(0, start) + replacement + text.substring(end);
  
  // Update the textarea value and selection
  textarea.value = newText;
  
  // Set selection after formatting
  if (start === end) {
    // If no text was selected, place cursor after the inserted formatting
    const newCursorPos = start + replacement.length;
    textarea.selectionStart = newCursorPos;
    textarea.selectionEnd = newCursorPos;
  } else {
    // If text was selected, place cursor relative to the end of the selection
    if (format === 'link' && !selectedText.match(/^\[.*\]\(.*\)$/)) {
      // For links, place cursor in the url position
      textarea.selectionStart = start + selectedText.length + 3;
      textarea.selectionEnd = start + replacement.length - 1;
    } else {
      textarea.selectionStart = start;
      textarea.selectionEnd = start + replacement.length;
    }
  }
  
  return newText;
};

/**
 * Handle tab indentation in a textarea
 */
export const handleTabIndent = (
  textarea: HTMLTextAreaElement,
  shiftKey: boolean
): string | null => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  
  // Find the start and end of the current line
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = text.indexOf('\n', end);
  const currentLine = text.substring(
    lineStart,
    lineEnd === -1 ? text.length : lineEnd
  );
  
  // Calculate new text and cursor position
  let newText;
  
  if (shiftKey) {
    // Unindent: remove leading tab or spaces
    if (currentLine.startsWith('\t')) {
      newText = text.substring(0, lineStart) + currentLine.substring(1) + text.substring(lineEnd === -1 ? text.length : lineEnd);
      textarea.selectionStart = Math.max(start - 1, lineStart);
      textarea.selectionEnd = Math.max(end - 1, lineStart);
    } else if (currentLine.startsWith('  ')) {
      // Remove spaces (assumes 2-space indentation)
      newText = text.substring(0, lineStart) + currentLine.substring(2) + text.substring(lineEnd === -1 ? text.length : lineEnd);
      textarea.selectionStart = Math.max(start - 2, lineStart);
      textarea.selectionEnd = Math.max(end - 2, lineStart);
    } else {
      return null; // No change needed
    }
  } else {
    // Indent: add a tab character at the start of the line
    newText = text.substring(0, lineStart) + '  ' + text.substring(lineStart);
    textarea.selectionStart = start + 2;
    textarea.selectionEnd = end + 2;
  }
  
  textarea.value = newText;
  return newText;
};

/**
 * Get cursor coordinates in a textarea
 */
export const getCursorCoordinates = (textarea: HTMLTextAreaElement) => {
  const { selectionStart, value } = textarea;
  
  // Create a hidden div with same styling as textarea
  const mirror = document.createElement('div');
  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.width = `${textarea.offsetWidth}px`;
  mirror.style.lineHeight = getComputedStyle(textarea).lineHeight;
  mirror.style.fontFamily = getComputedStyle(textarea).fontFamily;
  mirror.style.fontSize = getComputedStyle(textarea).fontSize;
  mirror.style.fontWeight = getComputedStyle(textarea).fontWeight;
  mirror.style.padding = getComputedStyle(textarea).padding;
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordWrap = 'break-word';
  
  // Copy content up to the cursor
  const textBeforeCursor = value.substring(0, selectionStart);
  
  // Replace spaces with non-breaking spaces to preserve them
  mirror.textContent = textBeforeCursor.replace(/ /g, '\u00A0');
  
  // Add a span at the cursor position
  const cursorSpan = document.createElement('span');
  cursorSpan.id = 'cursor';
  cursorSpan.textContent = '|';
  mirror.appendChild(cursorSpan);
  
  // Append to document to get coordinates
  document.body.appendChild(mirror);
  
  // Get cursor position
  const cursorElement = document.getElementById('cursor');
  const rect = cursorElement?.getBoundingClientRect() || { top: 0, left: 0 };
  const scrollTop = textarea.scrollTop;
  
  // Clean up
  document.body.removeChild(mirror);
  
  // Calculate position relative to the textarea and adjust for scroll
  const textareaRect = textarea.getBoundingClientRect();
  return {
    top: rect.top - textareaRect.top + scrollTop + 20, // Add offset for menu position
    left: rect.left - textareaRect.left,
  };
};

/**
 * Insert AI response at the specified position in a textarea
 */
export const insertAIResponse = (
  textarea: HTMLTextAreaElement | null,
  response: string,
  position: number
): string => {
  if (!textarea) return '';
  
  const text = textarea.value;
  const formattedResponse = `\n\n${response}\n`;
  
  const newText = text.substring(0, position) + formattedResponse + text.substring(position);
  textarea.value = newText;
  
  // Place cursor at the end of the inserted response
  const newPosition = position + formattedResponse.length;
  textarea.selectionStart = newPosition;
  textarea.selectionEnd = newPosition;
  
  return newText;
};
