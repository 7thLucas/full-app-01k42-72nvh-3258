import { useState, useEffect } from 'react';

import type { NewsItem } from '@/types';
import { fetchNews, fetchNewsById } from '@/services/api';

// Hook for fetching news list
export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const newsData = await fetchNews();
      setNews(newsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const refetch = () => {
    loadNews();
  };

  return {
    news,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching a single news item
export const useNewsItem = (id: string) => {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNewsItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const item = await fetchNewsById(id);
      setNewsItem(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news item');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadNewsItem();
    }
  }, [id]);

  const refetch = () => {
    loadNewsItem();
  };

  return {
    newsItem,
    loading,
    error,
    refetch,
  };
}; 