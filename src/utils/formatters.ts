
/**
 * Format price in KWD
 */
export const formatPrice = (price: string | number) => {
  // Convert to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `${numericPrice.toFixed(3)} KWD`;
};

/**
 * Get CSS class for flavor tag
 */
export const getTagClass = (tag: string) => {
  const tagLower = tag.toLowerCase();
  if (tagLower === 'vegan') return 'flavor-tag-vegan';
  if (tagLower === 'dairy-free') return 'flavor-tag-dairy-free';
  if (tagLower === 'sugar-free') return 'flavor-tag-sugar-free';
  if (tagLower === 'classic') return 'flavor-tag-classic';
  if (tagLower === 'seasonal') return 'flavor-tag-seasonal';
  return 'bg-gray-100 text-gray-800';
};
