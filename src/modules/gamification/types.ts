export enum PointSource {
  DAILY_LOGIN = 'DAILY_LOGIN',
  CHECKIN_STREAK = 'CHECKIN_STREAK',
  TASK_COMPLETION = 'TASK_COMPLETION',
  JOURNEY_COMPLETION = 'JOURNEY_COMPLETION',
  BADGE_EARNED = 'BADGE_EARNED',
  REFERRAL = 'REFERRAL',
  SHOP_PURCHASE = 'SHOP_PURCHASE',
  ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT'
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  conditionType: string;
  requiredValue: number;
  isOwned: boolean; 
  obtainedAt?: string;
}

export interface PointHistory {
  id: number;
  amount: number;
  source: PointSource;
  description: string;
  createdAt: string;
}