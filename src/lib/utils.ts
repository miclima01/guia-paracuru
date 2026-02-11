import { BusinessCategory, EmergencyCategory, NewsCategory } from '@/types';

// Date formatting
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatTime(time: string): string {
  return time.substring(0, 5);
}

// Currency formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

// Category labels
export const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  restaurant: 'Restaurante',
  bar: 'Bar',
  hotel: 'Hotel',
  pousada: 'Pousada',
  beach_club: 'Beach Club',
  pharmacy: 'Farmácia',
  market: 'Mercado',
  gas_station: 'Posto de Gasolina',
  other: 'Outro',
};

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  geral: 'Geral',
  avisos: 'Avisos',
  eventos: 'Eventos',
  turismo: 'Turismo',
  seguranca: 'Segurança',
};

export const EMERGENCY_ICONS: Record<string, string> = {
  hospital: '🏥',
  police: '🚔',
  fire: '🚒',
  other: '📞',
};

// Phone formatting
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// String utilities
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Validation
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

// Class names helper
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
