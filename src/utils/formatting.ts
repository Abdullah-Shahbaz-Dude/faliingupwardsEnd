/**
 * Utility functions for formatting values
 */

/**
 * Formats a boolean value to a user-friendly "Yes" or "No" string
 * @param value The boolean value to format
 * @returns "Yes" for true, "No" for false
 */
export const formatBoolean = (value: boolean | undefined | null): string => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "Not specified";
};

/**
 * Formats any value to a string representation
 * @param value The value to format
 * @returns Formatted string representation of the value
 */
export const formatValue = (value: any): string => {
  if (value === undefined || value === null) return "Not provided";
  
  // Handle boolean values
  if (typeof value === 'boolean') {
    return formatBoolean(value);
  }
  
  // Handle arrays
  if (Array.isArray(value)) return value.join(", ");
  
  // Handle objects
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return "Complex data";
    }
  }
  
  // Handle other types
  return String(value);
}; 