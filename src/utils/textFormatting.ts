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
 * Returns the command text (including the slash) and any text after it if found
 */
export const checkForSlashCommand = (text: string): { command: string, fullText: string } | null => {
  // Check for slash command pattern in the text
  const match = text.match(/(?:^|\s)(\/\w+)(\s+.+)?$/);
  
  if (match) {
    return {
      command: match[1], // The command itself (e.g., "/send")
      fullText: match[0].trim() // The full text including command and any text after it
    };
  }
  
  // Simple check for just a slash at the beginning of a line or after space
  if (text.endsWith('/') && (text.length === 1 || text[text.length - 2] === ' ' || text[text.length - 2] === '\n')) {
    return {
      command: '/',
      fullText: '/'
    };
  }
  
  return null;
};

/**
 * Extract context based on header sections from the document
 * @param content The entire note content
 * @param prompt The user prompt that may reference specific headers
 * @returns Enhanced prompt with appropriate context
 */
export const extractContextFromHeaders = (content: string, prompt: string): string => {
  // Split the content into lines for processing
  const lines = content.split('\n');
  
  // Parse the document structure with headers
  const docStructure: {
    level: number;
    title: string;
    content: string;
    lineStart: number;
    lineEnd: number;
  }[] = [];
  
  let currentHeader = { level: 0, title: '', content: '', lineStart: 0, lineEnd: 0 };
  let inSection = false;
  
  // Process each line to identify headers and their content
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if the line is a Markdown header
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headerMatch) {
      // If we were already in a section, save the previous section
      if (inSection) {
        currentHeader.lineEnd = i - 1;
        currentHeader.content = lines
          .slice(currentHeader.lineStart + 1, currentHeader.lineEnd + 1)
          .join('\n');
        docStructure.push({ ...currentHeader });
      }
      
      // Start a new section
      const level = headerMatch[1].length; // Number of # symbols
      const title = headerMatch[2].trim();
      currentHeader = {
        level,
        title,
        content: '',
        lineStart: i,
        lineEnd: 0
      };
      inSection = true;
    }
  }
  
  // Add the last section if there was one
  if (inSection) {
    currentHeader.lineEnd = lines.length - 1;
    currentHeader.content = lines
      .slice(currentHeader.lineStart + 1, currentHeader.lineEnd + 1)
      .join('\n');
    docStructure.push({ ...currentHeader });
  }
  
  // Look for context references in the prompt
  const h1Reference = prompt.match(/h1|header|title|document/i);
  const h2Reference = prompt.match(/h2|section|subsection/i);
  
  let enhancedPrompt = prompt;
  
  // Find the most recent h1 and h2 relative to the prompt position
  let relevantH1 = '';
  let relevantH2 = '';
  
  for (const section of docStructure) {
    if (section.level === 1) {
      relevantH1 = `# ${section.title}\n${section.content}`;
    } else if (section.level === 2) {
      relevantH2 = `## ${section.title}\n${section.content}`;
    }
  }
  
  // Construct an enhanced prompt with context
  if (h1Reference && h2Reference) {
    // User wants context from both h1 and h2
    enhancedPrompt = 
      `CONTEXT FROM H1:\n${relevantH1}\n\nCONTEXT FROM H2:\n${relevantH2}\n\nPROMPT: ${prompt}`;
  } else if (h1Reference) {
    // User wants context from h1
    enhancedPrompt = `CONTEXT FROM H1:\n${relevantH1}\n\nPROMPT: ${prompt}`;
  } else if (h2Reference) {
    // User wants context from h2
    enhancedPrompt = `CONTEXT FROM H2:\n${relevantH2}\n\nPROMPT: ${prompt}`;
  }
  
  return enhancedPrompt;
};

/**
 * Process a ChatGPT prompt from the current line or command
 */
export const processAIPrompt = (
  textareaElement: HTMLTextAreaElement | null,
  promptType: string,
  commandText?: string
): {prompt: string, insertPosition: number} | null => {
  if (!textareaElement) return null;
  
  // If we have command text (like "/send prompt text"), use that directly
  if (commandText && commandText.startsWith('/')) {
    const commandMatch = commandText.match(/^\/(\w+)(\s+(.+))?$/);
    
    if (commandMatch) {
      const command = commandMatch[1]; // e.g., "send"
      const promptText = commandMatch[3] || ''; // The text after the command
      
      if (promptText.trim()) {
        // If we have text after the command, use it as the prompt
        const cursorPosition = textareaElement.selectionStart;
        const lineEnd = textareaElement.value.indexOf('\n', cursorPosition);
        const actualLineEnd = lineEnd > -1 ? lineEnd : textareaElement.value.length;
        
        // Check for header context references
        const fullContent = textareaElement.value;
        const contextEnhancedPrompt = extractContextFromHeaders(fullContent, promptText);
        
        return {
          prompt: contextEnhancedPrompt,
          insertPosition: actualLineEnd
        };
      }
    }
  }
  
  // Fall back to the original behavior if no command text with content
  const lineInfo = getCurrentLine(textareaElement);
  if (!lineInfo) return null;
  
  const { text, lineStart, lineEnd } = lineInfo;
  
  // Clean the prompt based on the prompt type
  let cleanedPrompt = text;
  
  if (promptType === 'send') {
    // Remove the /send command if present
    cleanedPrompt = text.replace(/\/send\s*/, '').trim();
    
    // If the prompt contains references to headers, enhance it with context
    if (cleanedPrompt.match(/h[1-6]|header|section|title|document/i)) {
      cleanedPrompt = extractContextFromHeaders(textareaElement.value, cleanedPrompt);
    }
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

/**
 * Handle Tab key for indentation in a textarea
 * @param textareaElement The textarea element
 * @param isShiftTab Whether Shift key is pressed (for unindent)
 * @returns New content after indentation/unindentation
 */
export const handleTabIndent = (
  textareaElement: HTMLTextAreaElement,
  isShiftTab: boolean
): string => {
  const text = textareaElement.value;
  const selStart = textareaElement.selectionStart;
  const selEnd = textareaElement.selectionEnd;
  
  // Check if there's a selection spanning multiple lines
  const hasMultiLineSelection = text.substring(selStart, selEnd).includes('\n');
  
  if (hasMultiLineSelection) {
    // Handle multi-line selection
    const selectedText = text.substring(selStart, selEnd);
    const startLine = text.substring(0, selStart).lastIndexOf('\n') + 1;
    const endLine = text.indexOf('\n', selEnd);
    const textBeforeSelection = text.substring(0, startLine);
    const textAfterSelection = endLine !== -1 ? text.substring(endLine) : '';
    
    // Get all the lines in the selection
    const linesToModify = text.substring(startLine, endLine !== -1 ? endLine : text.length).split('\n');
    
    // Apply indentation or unindentation to each line
    const modifiedLines = linesToModify.map(line => {
      if (isShiftTab) {
        // Remove indentation (2 spaces or 1 tab)
        if (line.startsWith('  ')) {
          return line.substring(2);
        } else if (line.startsWith('\t')) {
          return line.substring(1);
        }
        return line;
      } else {
        // Add indentation (2 spaces)
        return '  ' + line;
      }
    });
    
    // Create new content
    const newContent = textBeforeSelection + modifiedLines.join('\n') + textAfterSelection;
    textareaElement.value = newContent;
    
    // Adjust selection to cover the same lines
    const newStartPos = startLine;
    const newEndPos = newContent.length - textAfterSelection.length;
    textareaElement.setSelectionRange(newStartPos, newEndPos);
    
    return newContent;
  } else {
    // Handle single line or cursor position
    const lineInfo = getCurrentLine(textareaElement);
    if (!lineInfo) return text;
    
    const { lineStart, lineEnd, text: lineText } = lineInfo;
    
    let newLineText: string;
    if (isShiftTab) {
      // Remove indentation (2 spaces or 1 tab)
      if (lineText.startsWith('  ')) {
        newLineText = lineText.substring(2);
      } else if (lineText.startsWith('\t')) {
        newLineText = lineText.substring(1);
      } else {
        return text; // No indentation to remove
      }
    } else {
      // Add indentation (2 spaces)
      newLineText = '  ' + lineText;
    }
    
    const newContent = 
      text.substring(0, lineStart) + 
      newLineText + 
      text.substring(lineEnd);
    
    textareaElement.value = newContent;
    
    // Adjust cursor position
    const cursorAdjustment = isShiftTab 
      ? (newLineText.length - lineText.length) 
      : 2;
      
    const newCursorPos = Math.max(
      lineStart, 
      selStart + cursorAdjustment
    );
    textareaElement.setSelectionRange(newCursorPos, newCursorPos);
    
    return newContent;
  }
};
