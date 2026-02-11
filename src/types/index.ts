// Database types
export interface Attraction {
  id: string;
  name: string;
  description?: string | null;
  date: string;
  start_time: string;
  end_time?: string | null;
  location?: string | null;
  artist?: string | null;
  image_url?: string | null;
  is_premium: boolean;
  is_featured?: boolean;
  location_url?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url?: string;
  category: string;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  description?: string;
  category: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  website?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  is_partner: boolean;
  is_premium: boolean;
  is_featured: boolean;
  rating?: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  category: string;
  icon: string;
  order_index: number;
  created_at: string;
}

export interface TransportContact {
  id: string;
  name: string;
  phone: string;
  category: 'taxi' | 'mototaxi';
  is_premium: boolean;
  order_index: number;
  created_at: string;
}

export interface Payment {
  id: string;
  device_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  mercadopago_id?: string;
  qr_code?: string;
  qr_code_base64?: string;
  expires_at: string;
  paid_at?: string;
  created_at: string;
}

export interface PremiumAccess {
  id: string;
  device_id: string;
  payment_id: string;
  granted_at: string;
  expires_at: string;
}

export interface AppSetting {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export type NewsCategory = 'geral' | 'avisos' | 'eventos' | 'turismo' | 'seguranca';

export type BusinessCategory =
  | 'restaurant'
  | 'bar'
  | 'hotel'
  | 'pousada'
  | 'beach_club'
  | 'pharmacy'
  | 'market'
  | 'gas_station'
  | 'hospital'
  | 'health_post'
  | 'other';

export type EmergencyCategory =
  | 'hospital'
  | 'police'
  | 'fire'
  | 'other';
