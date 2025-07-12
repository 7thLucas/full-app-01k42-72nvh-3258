import { fetchNews } from '@/services/api';

// Simple test function to verify API integration
export const testNewsApi = async () => {
  try {
    console.log('Testing News API...');
    const news = await fetchNews();
    console.log('✅ API Test Success:', {
      totalNews: news.length,
      firstNewsTitle: news[0]?.title || 'No news available',
      categories: [...new Set(news.map(item => item.category))],
      featuredCount: news.filter(item => item.featured).length,
      sampleNews: news.slice(0, 2).map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        hasImage: !!item.imageUrl,
        summaryLength: item.summary.length,
      })),
    });
    return news;
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    throw error;
  }
};

// You can call this function in the browser console to test:
// import { testNewsApi } from '@/utils/testApi'; testNewsApi();
// Note: Make sure URL has required query parameters: ?keyspace=satudesa&role=dev&userId=3181 