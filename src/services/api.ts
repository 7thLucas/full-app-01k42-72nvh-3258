import axios from 'axios';

import type { NewsItem } from '@/types';
import { createSummary, makeAbsoluteUrl } from '@/utils/htmlUtils';

const API_BASE_URL = 'https://client-api.quantumbyte.ai/api/v1';
const BEARER_TOKEN = 'VstD5Nrcyl777MbuzzxEoYIwK3Zlcj5jkVyS6hdk6EsXkRIiLIJq4EntMrZsGsXmv4HW9RsbuFPVO7Cq8w6XOd6h9owjPfGNZ2HS';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// API Response interface
interface ApiNewsResponse {
  status: boolean;
  code: number;
  message: string;
  total: number;
  result: any[];
}

// Transform API data to our NewsItem format
const transformApiDataToNewsItem = (apiData: any): NewsItem => {
  // Extract base URL for images if needed
  let imageUrl: string | undefined;
  if (apiData.image && apiData.image.trim() !== '') {
    try {
      const { keyspace, role, userId } = getQueryParams();
      imageUrl = `https://client-api.quantumbyte.ai/api/v1/uploader/${keyspace}/${role}/document/${userId}/app-berita/${apiData.image}`;
    } catch (error) {
      // If query params are not available, use a fallback or undefined
      console.warn('Failed to construct image URL:', error);
      imageUrl = undefined;
    }
  }

  // Clean up HTML content for summary
  const cleanSummary = apiData.subtitle || 
    (apiData.description ? createSummary(apiData.description, 200) : '') ||
    apiData.title || '';

  return {
    id: apiData.id?.toString() || apiData._id?.toString() || '',
    title: apiData.title || 'Untitled',
    summary: cleanSummary,
    content: apiData.description || '',
    publishDate: apiData.createdAt || new Date().toISOString(),
    author: 'Admin', // API doesn't seem to have author field
    category: apiData.kategori || 'General',
    imageUrl: imageUrl,
    featured: false, // We'll determine this based on recency or other criteria
  };
};

// Get query parameters from URL
const getQueryParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const keyspace = urlParams.get('keyspace');
  const role = urlParams.get('role');
  const userId = urlParams.get('userId');

  // Validate required parameters
  if (!keyspace) {
    throw new Error('Missing required query parameter: keyspace');
  }
  if (!role) {
    throw new Error('Missing required query parameter: role');
  }
  if (!userId) {
    throw new Error('Missing required query parameter: userId');
  }

  return { keyspace, role, userId };
};

// Fetch news list
export const fetchNews = async (
  startRow: number = 0,
  endRow: number = 100
): Promise<NewsItem[]> => {
  try {
    const { keyspace, role, userId } = getQueryParams();

    const params = {
      data: JSON.stringify({
        startRow,
        endRow,
        sortModel: [{ colId: 'createdAt', sort: 'desc' }],
      }),
    };

    const response = await apiClient.get<ApiNewsResponse>(
      `/informasi-umum/${keyspace}/${role}/list/${userId}`,
      { params }
    );

    if (response.data.status && Array.isArray(response.data.result)) {
      // Mark the first few items as featured (most recent)
      const newsItems = response.data.result.map(transformApiDataToNewsItem);
      // Mark first 3 items as featured
      newsItems.slice(0, 3).forEach(item => item.featured = true);
      return newsItems;
    }

    return [];
  } catch (error) {
    console.error('Error fetching news:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
    throw new Error('Failed to fetch news data');
  }
};

// API Response interface for single news item
interface ApiNewsDetailResponse {
  status: boolean;
  code: number;
  message: string;
  result: any;
}

// Fetch single news item by ID
export const fetchNewsById = async (
  id: string
): Promise<NewsItem | null> => {
  try {
    const { keyspace, role, userId } = getQueryParams();

    const response = await apiClient.get<ApiNewsDetailResponse>(
      `/informasi-umum/${keyspace}/${role}/detail/${userId}/${id}`
    );

    if (response.data.status && response.data.result) {
      return transformApiDataToNewsItem(response.data.result);
    }

    return null;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch news item: ${error.message}`);
    }
    throw new Error('Failed to fetch news item');
  }
};

// Export the query parameter getter for external use if needed
export { getQueryParams };

export default apiClient; 