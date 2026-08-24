export type UserRole = 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  storeId?: string; // If STORE_OWNER
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  category: string;
  ownerId: string;
  ownerName: string;
  averageRating: number;
  totalRatings: number;
  accentColor: 'lavender' | 'peach' | 'mint' | 'blue' | 'yellow' | 'rose';
  image?: string;
  description?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  storeId: string;
  score: number; // 1 to 5
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RatingDistribution {
  star: number;
  count: number;
  percentage: number;
}

export interface AdminKPIs {
  totalUsers: number;
  usersTrend: string;
  totalStores: number;
  storesTrend: string;
  totalRatings: number;
  ratingsTrend: string;
  averageRating: number;
}
