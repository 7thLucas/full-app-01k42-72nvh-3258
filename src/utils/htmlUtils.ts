// Utility functions for handling HTML content

// Strip HTML tags from content
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

// Clean and truncate HTML content for summaries
export const createSummary = (html: string, maxLength: number = 200): string => {
  const cleanText = stripHtml(html);
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  return cleanText.substring(0, maxLength).trim() + '...';
};

// Format HTML content for display (basic cleanup)
export const formatHtmlContent = (html: string): string => {
  return html
    .replace(/<p>/g, '\n\n')
    .replace(/<\/p>/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Extract first image from HTML content
export const extractFirstImage = (html: string): string | null => {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = html.match(imgRegex);
  return match ? match[1] : null;
};

// Convert relative URLs to absolute URLs
export const makeAbsoluteUrl = (url: string, baseUrl: string): string => {
  if (url.startsWith('http')) {
    return url;
  }
  return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
}; 