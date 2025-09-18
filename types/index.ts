import { User, Movie, WatchHistory, Invite, Payment } from "@prisma/client";

export type UserPlan = "GUEST" | "FREE" | "PREMIUM";

export interface UserWithRelations extends User {
  watchHistory?: WatchHistory[];
  invites?: Invite[];
  payments?: Payment[];
}

export interface MovieWithUrls extends Omit<Movie, "videoUrls"> {
  videoUrls: {
    "360p": string;
    "480p": string;
    "720p": string;
    FHD: string;
  };
}

export interface WatchSession {
  movieId: string;
  userId: string;
  resolution: VideoResolution;
  timestamp: Date;
}

export type VideoResolution = "360p" | "480p" | "720p" | "FHD";

export interface QuotaCheck {
  canWatch: boolean;
  remainingViews: number;
  reason?: string;
  resetTime?: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  plan: UserPlan;
  dailyViews: number;
  bonusViews: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface MovieFilters {
  genre?: string;
  isAdult?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaymentData {
  amount: number;
  type: "PREMIUM_UPGRADE" | "DONATION";
  description?: string;
}

export interface InviteData {
  email: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
