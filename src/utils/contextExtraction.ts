/**
 * Utility functions for extracting document context from notes
 */

/**
 * Heading information, including level, text and content
 */
export interface HeadingInfo {
  level: number;
  text: string;
  content: string;
  startPosition: number;
  endPosition: number;
}

/**
 * Extract all headings and their content from the document
 */
export const extractHeadingsFromDocument = (text: string): HeadingInfo[] => {
  const headings: HeadingInfo[] = [];
  const lines = text.split('\n');
  
  let currentHeading: HeadingInfo | null = null;
  let position = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headerMatch) {
      // If we were tracking a heading, close it off
      if (currentHeading) {
        currentHeading.endPosition = position;
        headings.push(currentHeading);
      }
      
      // Start tracking a new heading
      const level = headerMatch[1].length;
      const headerText = headerMatch[2].trim();
      
      currentHeading = {
        level,
        text: headerText,
        content: line + '\n',
        startPosition: position,
        endPosition: -1
      };
    } else if (currentHeading) {
      // Add this line to the current heading's content
      currentHeading.content += line + '\n';
    }
    
    position += line.length + 1; // +1 for the newline character
  }
  
  // Handle the last heading
  if (currentHeading) {
    currentHeading.endPosition = position;
    headings.push(currentHeading);
  }
  
  return headings;
};

/**
 * Find a heading by its title (case insensitive)
 */
export const findHeadingByTitle = (
  headings: HeadingInfo[],
  title: string
): HeadingInfo | null => {
  const normalizedTitle = title.toLowerCase().trim();
  
  for (const heading of headings) {
    if (heading.text.toLowerCase().trim() === normalizedTitle) {
      return heading;
    }
  }
  
  return null;
};

/**
 * Find headings by their level (h1, h2, etc.)
 */
export const findHeadingsByLevel = (
  headings: HeadingInfo[],
  level: number
): HeadingInfo[] => {
  return headings.filter(heading => heading.level === level);
};

/**
 * Extract context from document based on prompt references
 */
export const extractContextFromHeaders = (
  text: string,
  prompt: string
): { contextualPrompt: string; sections: string[] } => {
  const headings = extractHeadingsFromDocument(text);
  
  if (headings.length === 0) {
    // No headers found, return the original prompt
    return {
      contextualPrompt: prompt,
      sections: []
    };
  }
  
  // Check for header level references (h1, h2, etc.)
  const headerLevelMatches = prompt.match(/\b(h[1-6]|header[1-6]|heading[1-6])\b/gi);
  const titleMatches = prompt.match(/["']([^"']+)["']/g);
  const sections: string[] = [];
  
  // Process header level references
  if (headerLevelMatches) {
    for (const match of headerLevelMatches) {
      // Extract the level number
      const levelMatch = match.match(/\d/);
      if (levelMatch) {
        const level = parseInt(levelMatch[0]);
        const matchingHeadings = findHeadingsByLevel(headings, level);
        
        if (matchingHeadings.length > 0) {
          // Add each matching heading's content
          for (const heading of matchingHeadings) {
            sections.push(heading.content);
          }
        }
      }
    }
  }
  
  // Process quoted title references
  if (titleMatches) {
    for (const match of titleMatches) {
      // Extract the title from quotes
      const title = match.replace(/^["']|["']$/g, '');
      const heading = findHeadingByTitle(headings, title);
      
      if (heading) {
        sections.push(heading.content);
      }
    }
  }
  
  // If no specific sections were referenced but headers exist,
  // use the nearest relevant section based on the document structure
  if (sections.length === 0 && headings.length > 0) {
    // Default to using the first h1 as context if available
    const h1Headings = findHeadingsByLevel(headings, 1);
    if (h1Headings.length > 0) {
      sections.push(h1Headings[0].content);
    } else {
      // Otherwise use the first heading of any level
      sections.push(headings[0].content);
    }
  }
  
  // Build the contextual prompt
  let contextualPrompt = prompt;
  
  if (sections.length > 0) {
    // Add document context to the prompt
    contextualPrompt = `DOCUMENT CONTEXT:\n${sections.join('\n---\n')}\n\nUSER QUERY:\n${prompt}`;
  }
  
  return {
    contextualPrompt,
    sections: sections
  };
};
