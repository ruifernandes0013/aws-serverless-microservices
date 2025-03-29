export const isEmpty = (obj) => 
  obj == null || // Covers both null and undefined
  (typeof obj === 'object' && Object.keys(obj).length === 0) || // Empty object
  (typeof obj === 'string' && obj.trim().length === 0) || // Empty string 
  (Array.isArray(obj) && obj.length === 0) || // Empty array
  (obj instanceof Map && obj.size === 0) || // Empty Map
  (obj instanceof Set && obj.size === 0); // Empty Set
