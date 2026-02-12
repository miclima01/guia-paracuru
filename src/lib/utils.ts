import { BusinessCategory, NewsCategory, ServiceCategory } from '@/types';

// Date formatting
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(d);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(d);
}

export function formatTime(time: string): string {
  return time.substring(0, 5);
}

export function formatDateWithWeekday(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  });
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
  hospital: 'Hospital',
  health_post: 'Posto de Saúde',
  other: 'Outro',
};

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  pousada: 'Pousada',
  hotel: 'Hotel',
  hospital: 'Hospital',
  pharmacy: 'Farmácia',
  market: 'Mercado',
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

// Class names helper
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Sanitize HTML - strip dangerous tags/attributes, keep safe formatting
export function sanitizeHtml(html: string): string {
  // Remove script tags and their content
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove event handlers (onclick, onerror, etc.)
  clean = clean.replace(/\s*on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');
  // Remove javascript: URLs
  clean = clean.replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '');
  // Remove iframe, object, embed, form tags
  clean = clean.replace(/<\/?(iframe|object|embed|form|input|textarea|button|select)\b[^>]*>/gi, '');
  // Remove style tags and their content
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  return clean;
}
