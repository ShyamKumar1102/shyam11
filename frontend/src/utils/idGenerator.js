// ID Generator Utility for Inventory Management System

/**
 * Generate a random ID with specified length
 * @param {number} length - Length of ID (6 or 8 digits)
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Generated ID
 */
export const generateId = (length = 8, prefix = '') => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
  return prefix ? `${prefix}${randomId}` : randomId.toString();
};

/**
 * Generate specific IDs for different entities
 */
export const generateDispatchId = () => generateId(8, 'DSP');
export const generateShippingId = () => generateId(8, 'SHP');
export const generateInvoiceId = () => generateId(6, 'INV');
export const generatePurchaseId = () => generateId(6, 'PUR');
export const generateOrderId = () => generateId(8, 'ORD');
export const generateBatchId = () => generateId(6);
export const generateProductId = () => generateId(8, 'PRD');
export const generateStockId = () => generateId(8, 'STK');
export const generateCustomerId = () => generateId(6, 'CUS');
export const generateSupplierId = () => generateId(6, 'SUP');
export const generateCourierId = () => generateId(6, 'COU');

/**
 * Generate timestamp-based ID for uniqueness
 * @param {string} prefix - Prefix for the ID
 * @param {number} length - Total length including prefix
 * @returns {string} Timestamp-based ID
 */
export const generateTimestampId = (prefix = '', length = 8) => {
  const timestamp = Date.now().toString();
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const combined = timestamp + randomSuffix;
  const truncated = combined.slice(-length);
  return prefix ? `${prefix}${truncated}` : truncated;
};

/**
 * Validate ID format
 * @param {string} id - ID to validate
 * @param {number} expectedLength - Expected length
 * @param {string} expectedPrefix - Expected prefix
 * @returns {boolean} Is valid
 */
export const validateId = (id, expectedLength, expectedPrefix = '') => {
  if (!id) return false;
  if (expectedPrefix && !id.startsWith(expectedPrefix)) return false;
  const numericPart = expectedPrefix ? id.slice(expectedPrefix.length) : id;
  return numericPart.length === expectedLength && /^\d+$/.test(numericPart);
};