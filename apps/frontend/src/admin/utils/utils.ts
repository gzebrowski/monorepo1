/**
 * Type definition for class value inputs
 */
type ClassValue = 
  | string 
  | number 
  | boolean 
  | undefined 
  | null 
  | { [key: string]: boolean | undefined | null }
  | ClassValue[];

/**
 * Combines class names with conditional support
 * @param inputs - Class values to combine (strings, objects, arrays)
 * @returns Combined and deduplicated class string
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  // Process all inputs
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === 'string') {
      classes.push(...input.split(/\s+/).filter(Boolean));
    } else if (typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(...nested.split(/\s+/));
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(...key.split(/\s+/).filter(Boolean));
        }
      }
    }
  }
  
  // Remove duplicates while preserving order
  const uniqueClasses = Array.from(new Set(classes));
  return uniqueClasses.join(' ');
}