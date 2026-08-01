export type UserRole = "worker" | "buyer" | "both";
export type JobStatus = "open" | "assigned" | "completed" | "cancelled";
export type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  area: string | null;
  nid_verified: boolean;
  avatar_url: string | null;
  rating_avg: number;
  rating_count: number;
  is_admin: boolean;
  is_suspended: boolean;
  suspended_reason: string | null;
}

export interface SiteSettings {
  default_commission_pct: number;
  min_commission_pct: number;
  max_commission_pct: number;
  site_name_bn: string;
  support_email: string;
  support_phone: string;
  maintenance_mode: boolean;
}

export interface SkillCategory {
  id: number;
  name_bn: string;
  name_en: string;
  group_name: string;
}

export interface WorkerProfile {
  user_id: string;
  hourly_rate: number;
  bio: string | null;
  max_daily_hours: number;
  is_active: boolean;
  profiles?: Profile;
  worker_skills?: { skill_categories: SkillCategory }[];
}

export interface Job {
  id: string;
  buyer_id: string;
  skill_id: number;
  title: string;
  description: string | null;
  area: string;
  estimated_hours: number;
  budget_hourly: number | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  status: JobStatus;
  assigned_worker_id: string | null;
  created_at: string;
  skill_categories?: SkillCategory;
  profiles?: Profile;
}

export interface Bid {
  id: string;
  job_id: string;
  worker_id: string;
  rate_offered: number;
  message: string | null;
  status: BidStatus;
  created_at: string;
  profiles?: Profile;
}

export const AREAS = [
  "ধানমন্ডি",
  "বনানী",
  "গুলশান",
  "উত্তরা",
  "মিরপুর",
  "মোহাম্মদপুর",
  "বাড্ডা",
  "মালিবাগ",
  "যাত্রাবাড়ী",
  "খিলগাঁও",
] as const;
