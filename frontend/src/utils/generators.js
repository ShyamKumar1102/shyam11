// Generate unique invoice ID
export const generateInvoiceId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${timestamp}-${random}`;
};

// Generate unique barcode
export const generateBarcode = () => {
  const random = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
  return random;
};

// Generate unique PO ID
export const generatePOId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PO-${timestamp}-${random}`;
};
