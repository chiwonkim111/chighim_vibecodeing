/**
 * Supabase 데이터베이스 타입 정의
 */

// 사용자 프로필
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  customer_key: string;
  created_at: string;
  updated_at: string;
}

// 단건 결제
export interface Payment {
  id: string;
  user_id: string;
  payment_key: string | null;
  order_id: string;
  order_name: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'READY' | 'IN_PROGRESS' | 'DONE' | 'CANCELED' | 'FAILED';
  method: string | null;
  card_company: string | null;
  card_number: string | null;
  card_type: string | null;
  installment_months: number;
  approved_at: string | null;
  receipt_url: string | null;
  failure_code: string | null;
  failure_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// 빌링키
export interface BillingKey {
  id: string;
  user_id: string;
  billing_key: string;
  customer_key: string;
  card_company: string | null;
  card_number: string | null;
  card_type: string | null;
  owner_type: string | null;
  is_active: boolean;
  authenticated_at: string | null;
  created_at: string;
  updated_at: string;
}

// 구독
export interface Subscription {
  id: string;
  user_id: string;
  billing_key_id: string | null;
  plan_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'CANCELED' | 'EXPIRED';
  billing_cycle: 'MONTHLY' | 'YEARLY';
  current_period_start: string | null;
  current_period_end: string | null;
  next_billing_date: string | null;
  canceled_at: string | null;
  cancel_reason: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// 구독 결제 기록
export interface SubscriptionPayment {
  id: string;
  subscription_id: string;
  user_id: string;
  payment_key: string | null;
  order_id: string;
  amount: number;
  status: 'PENDING' | 'DONE' | 'FAILED';
  period_start: string | null;
  period_end: string | null;
  approved_at: string | null;
  failure_code: string | null;
  failure_message: string | null;
  retry_count: number;
  created_at: string;
}

