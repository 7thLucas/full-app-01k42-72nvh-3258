import { fetchNews } from "@/services/api";
import { fetchInformation } from "@/services/api";

// Simple test function to verify API integration
export const testNewsApi = async () => {
  try {
    console.log("Testing News API...");
    const news = await fetchNews();

    console.log("✅ News API Test Success:", {
      totalNews: news.length,
      firstNewsTitle: news[0]?.title || "No news available",
      categories: [...new Set(news.map((item) => item.kategori))],
      featuredCount: news.filter((item) => item.featured).length,
      sampleNews: news.slice(0, 2).map((item) => ({
        id: item.id,
        title: item.title,
        kategori: item.kategori,
        hasImage: !!item.image,
        subtitleLength: item.subtitle?.length || 0,
        descriptionLength: item.description?.length || 0,
      })),
    });

    return news;
  } catch (error) {
    console.error("❌ News API Test Failed:", error);
    throw error;
  }
};

// Simple test function to verify Information API integration
export const testInformationApi = async () => {
  try {
    console.log("Testing Information API...");
    const information = await fetchInformation();

    console.log("✅ Information API Test Success:", {
      totalInformation: information.length,
      firstInformationTitle: information[0]?.title || "No information available",
      categories: [...new Set(information.map((item) => item.kategori))],
      featuredCount: information.filter((item) => item.featured).length,
      sampleInformation: information.slice(0, 2).map((item) => ({
        id: item.id,
        title: item.title,
        kategori: item.kategori,
        hasImage: !!item.image,
        subtitleLength: item.subtitle?.length || 0,
        descriptionLength: item.description?.length || 0,
        summaryLength: item.summary?.length || 0,
      })),
    });

    return information;
  } catch (error) {
    console.error("❌ Information API Test Failed:", error);
    throw error;
  }
};

// You can call this function in the browser console to test:
// import { testNewsApi } from '@/utils/testApi'; testNewsApi();
// Note: Make sure URL has required query parameters: ?keyspace=satudesa&role=dev&userId=3181
