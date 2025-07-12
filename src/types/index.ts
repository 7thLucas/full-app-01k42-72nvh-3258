export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishDate: string;
  author: string;
  category: string;
  imageUrl?: string;
  featured: boolean;
}

export interface InformationItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  lastUpdated: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface MiniApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  category: string;
  featured: boolean;
  isActive: boolean;
} 