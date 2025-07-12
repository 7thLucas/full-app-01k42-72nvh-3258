// Raw API response interfaces
export interface NewsListApiResponse {
  _id: string;
  artikel: string;
  createdAt: string;
  gambar: string;
  id: string;
  id_user: string;
  judul: string;
  kategori: string;
  keyspace: string;
  lokasi: string;
  subDomain: string;
  tanggal: string;
  tanggal_artikel: string;
  updatedAt: string;
  url_artikel: string;
}

export interface NewsDetailApiResponse {
  judul: string;
  artikel: string;
  kategori: string;
  gambar: string;
  tanggal_artikel: string;
  lokasi: string;
  url_artikel: string;
  tanggal: string;
  createdAt: string;
  updatedAt: string;
  keyspace: string;
  id_user: number;
  subDomain: string;
}

// Unified NewsItem interface for components
export interface NewsItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string;
  image?: string;
  kategori: string;
  createdAt: string;
  updatedAt: string;
  tanggal: string;
  tanggal_artikel: string;
  lokasi: string;
  url_artikel: string;
  keyspace: string;
  id_user: number | string;
  subDomain: string;
  featured?: boolean;
}

// Utility functions to transform API responses
export const transformNewsListItem = (item: NewsListApiResponse): NewsItem => ({
  id: item.id || item._id,
  title: item.judul,
  description: item.artikel,
  content: item.artikel,
  image: item.gambar,
  kategori: item.kategori,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  tanggal: item.tanggal,
  tanggal_artikel: item.tanggal_artikel,
  lokasi: item.lokasi,
  url_artikel: item.url_artikel,
  keyspace: item.keyspace,
  id_user: item.id_user,
  subDomain: item.subDomain,
});

export const transformNewsDetailItem = (
  item: NewsDetailApiResponse,
  id?: string,
): NewsItem => ({
  id: id || item.id_user.toString(), // Use provided id or fallback to id_user
  title: item.judul,
  description: item.artikel,
  content: item.artikel,
  image: item.gambar,
  kategori: item.kategori,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  tanggal: item.tanggal,
  tanggal_artikel: item.tanggal_artikel,
  lokasi: item.lokasi,
  url_artikel: item.url_artikel,
  keyspace: item.keyspace,
  id_user: item.id_user,
  subDomain: item.subDomain,
});

// Type guards to check which API format we're dealing with
export const isNewsListApiResponse = (
  item: any,
): item is NewsListApiResponse => {
  return (
    item &&
    typeof item === "object" &&
    (item.hasOwnProperty("_id") || item.hasOwnProperty("id")) &&
    item.hasOwnProperty("artikel") &&
    item.hasOwnProperty("judul") &&
    item.hasOwnProperty("gambar")
  );
};

export const isNewsDetailApiResponse = (
  item: any,
): item is NewsDetailApiResponse => {
  return (
    item &&
    typeof item === "object" &&
    item.hasOwnProperty("artikel") &&
    item.hasOwnProperty("judul") &&
    item.hasOwnProperty("gambar") &&
    item.hasOwnProperty("id_user") &&
    typeof item.id_user === "number"
  );
};

// Generic transformer that can handle both formats
export const transformNewsItem = (item: any, id?: string): NewsItem => {
  if (isNewsListApiResponse(item)) {
    return transformNewsListItem(item);
  } else if (isNewsDetailApiResponse(item)) {
    return transformNewsDetailItem(item, id);
  } else {
    throw new Error("Invalid news item format");
  }
};

// Category utility functions
export const splitCategories = (kategoriesString: string): string[] => {
  if (!kategoriesString || typeof kategoriesString !== 'string') {
    return [];
  }
  return kategoriesString
    .split(',')
    .map(cat => cat.trim())
    .filter(cat => cat.length > 0);
};

export const getDisplayCategories = (
  kategoriesString: string, 
  maxCategories: number = 2
): string[] => {
  const categories = splitCategories(kategoriesString);
  return categories.slice(0, maxCategories);
};

export const getFirstCategory = (kategoriesString: string): string => {
  const categories = splitCategories(kategoriesString);
  return categories.length > 0 ? categories[0] : kategoriesString;
};

export const getCategoryCount = (kategoriesString: string): number => {
  return splitCategories(kategoriesString).length;
};

export const formatCategoriesForDisplay = (
  kategoriesString: string,
  maxCategories: number = 2
): { displayCategories: string[]; hasMore: boolean; totalCount: number } => {
  const allCategories = splitCategories(kategoriesString);
  const displayCategories = allCategories.slice(0, maxCategories);
  const hasMore = allCategories.length > maxCategories;
  const totalCount = allCategories.length;
  
  return {
    displayCategories,
    hasMore,
    totalCount
  };
};

// Raw API response interfaces for Information
export interface InformationListApiResponse {
  _id: number;
  id: number;
  title: string;
  subtitle: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  kategori: string;
  createdAt: string;
  updatedAt: string;
  deletedBy: null;
  deletedAt: null;
  keyspace: string;
  subDomain: string;
  id_user: number;
}

export interface InformationDetailApiResponse {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  kategori: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  deletedBy: null;
  keyspace: string;
  subDomain: string;
  id_user: number;
}

// Unified InformationItem interface for components
export interface InformationItem {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  content: string;
  description: string;
  image?: string;
  category: string;
  kategori: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  lastUpdated: string;
  priority: "low" | "medium" | "high";
  tags: string[];
  keyspace: string;
  subDomain: string;
  id_user: number;
  featured?: boolean;
}

// Utility functions to transform Information API responses
export const transformInformationListItem = (item: InformationListApiResponse): InformationItem => ({
  id: item.id.toString() || item._id.toString(),
  title: item.title,
  subtitle: item.subtitle,
  summary: item.description ? item.description.substring(0, 200) + (item.description.length > 200 ? '...' : '') : '',
  content: item.description,
  description: item.description,
  image: item.image,
  category: item.kategori,
  kategori: item.kategori,
  startDate: item.startDate,
  endDate: item.endDate,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  lastUpdated: item.updatedAt,
  priority: "medium", // Default priority, can be enhanced later
  tags: item.kategori ? item.kategori.split(',').map(tag => tag.trim()) : [],
  keyspace: item.keyspace,
  subDomain: item.subDomain,
  id_user: item.id_user,
});

export const transformInformationDetailItem = (
  item: InformationDetailApiResponse,
  id?: string,
): InformationItem => ({
  id: id || item.id.toString(),
  title: item.title,
  subtitle: item.subtitle,
  summary: item.description ? item.description.substring(0, 200) + (item.description.length > 200 ? '...' : '') : '',
  content: item.description,
  description: item.description,
  image: item.image,
  category: item.kategori,
  kategori: item.kategori,
  startDate: item.startDate,
  endDate: item.endDate,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  lastUpdated: item.updatedAt,
  priority: "medium", // Default priority, can be enhanced later
  tags: item.kategori ? item.kategori.split(',').map(tag => tag.trim()) : [],
  keyspace: item.keyspace,
  subDomain: item.subDomain,
  id_user: item.id_user,
});

// Type guards for Information API responses
export const isInformationListApiResponse = (
  item: any,
): item is InformationListApiResponse => {
  return (
    item &&
    typeof item === "object" &&
    (item.hasOwnProperty("_id") || item.hasOwnProperty("id")) &&
    item.hasOwnProperty("title") &&
    item.hasOwnProperty("description") &&
    item.hasOwnProperty("kategori")
  );
};

export const isInformationDetailApiResponse = (
  item: any,
): item is InformationDetailApiResponse => {
  return (
    item &&
    typeof item === "object" &&
    item.hasOwnProperty("id") &&
    item.hasOwnProperty("title") &&
    item.hasOwnProperty("description") &&
    item.hasOwnProperty("kategori") &&
    item.hasOwnProperty("id_user") &&
    typeof item.id_user === "number"
  );
};

// Generic transformer for Information that can handle both formats
export const transformInformationItem = (item: any, id?: string): InformationItem => {
  if (isInformationListApiResponse(item)) {
    return transformInformationListItem(item);
  } else if (isInformationDetailApiResponse(item)) {
    return transformInformationDetailItem(item, id);
  } else {
    throw new Error("Invalid information item format");
  }
};

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
