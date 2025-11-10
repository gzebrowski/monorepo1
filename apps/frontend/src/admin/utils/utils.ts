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
 * Combines class names with conditional support and Tailwind CSS conflict resolution
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
  
  // Remove duplicates and resolve Tailwind conflicts
  return resolveTailwindConflicts(classes).join(' ');
}

/**
 * Resolves Tailwind CSS class conflicts by keeping the last occurrence of conflicting classes
 * @param classes - Array of class names
 * @returns Array with resolved conflicts
 */
function resolveTailwindConflicts(classes: string[]): string[] {
  const classMap = new Map<string, string>();
  const result: string[] = [];
  
  // Common Tailwind prefixes that can conflict
  const conflictPrefixes = [
    // Spacing
    'p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-',
    'm-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-',
    'space-x-', 'space-y-', 'gap-',
    
    // Sizing
    'w-', 'h-', 'min-w-', 'min-h-', 'max-w-', 'max-h-',
    
    // Colors
    'text-', 'bg-', 'border-', 'ring-', 'shadow-',
    
    // Layout
    'flex-', 'grid-', 'col-', 'row-', 'place-',
    'justify-', 'items-', 'content-', 'self-',
    
    // Typography
    'font-', 'text-', 'leading-', 'tracking-', 'decoration-',
    
    // Borders
    'border-', 'rounded-', 'ring-',
    
    // Effects
    'shadow-', 'opacity-', 'blur-', 'brightness-',
    
    // Positioning
    'relative', 'absolute', 'fixed', 'sticky', 'static',
    'top-', 'right-', 'bottom-', 'left-', 'inset-',
    
    // Display
    'block', 'inline-block', 'inline', 'flex', 'inline-flex', 
    'table', 'grid', 'hidden',
    
    // Z-index
    'z-'
  ];
  
  for (const className of classes) {
    let conflictKey = className;
    
    // Find conflict group for this class
    for (const prefix of conflictPrefixes) {
      if (className.startsWith(prefix)) {
        // For directional classes like px-, py-, extract the base
        if (prefix.includes('-') && !prefix.endsWith('-')) {
          conflictKey = prefix;
        } else {
          conflictKey = prefix;
        }
        break;
      }
    }
    
    // Handle special cases for position classes
    if (['relative', 'absolute', 'fixed', 'sticky', 'static'].includes(className)) {
      conflictKey = 'position';
    }
    
    // Handle display classes
    if (['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'table', 'grid', 'hidden'].includes(className)) {
      conflictKey = 'display';
    }
    
    classMap.set(conflictKey, className);
  }
  
  // Rebuild array maintaining original order but with resolved conflicts
  for (const className of classes) {
    let conflictKey = className;
    
    // Find the same conflict key as above
    for (const prefix of conflictPrefixes) {
      if (className.startsWith(prefix)) {
        if (prefix.includes('-') && !prefix.endsWith('-')) {
          conflictKey = prefix;
        } else {
          conflictKey = prefix;
        }
        break;
      }
    }
    
    if (['relative', 'absolute', 'fixed', 'sticky', 'static'].includes(className)) {
      conflictKey = 'position';
    }
    
    if (['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'table', 'grid', 'hidden'].includes(className)) {
      conflictKey = 'display';
    }
    
    // Only add if this is the final class for this conflict group
    if (classMap.get(conflictKey) === className && !result.includes(className)) {
      result.push(className);
    }
  }
  
  return result;
}