// Premium access management (localStorage-based)

const DEVICE_ID_KEY = 'guia_paracuru_device_id';
const PREMIUM_KEY = 'guia_paracuru_premium';

export interface PremiumData {
  payment_id: string;
  expires_at: string;
}

// Generate or get device ID
export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

// Check if user has premium access
export function checkPremiumAccess(): boolean {
  if (typeof window === 'undefined') return false;

  const premiumData = localStorage.getItem(PREMIUM_KEY);
  if (!premiumData) return false;

  try {
    const data: PremiumData = JSON.parse(premiumData);
    const expiresAt = new Date(data.expires_at);
    const now = new Date();

    if (now > expiresAt) {
      // Expired, remove from storage
      localStorage.removeItem(PREMIUM_KEY);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// Save premium access
export function savePremiumAccess(paymentId: string, expiresAt: string): void {
  if (typeof window === 'undefined') return;

  const data: PremiumData = {
    payment_id: paymentId,
    expires_at: expiresAt,
  };
  localStorage.setItem(PREMIUM_KEY, JSON.stringify(data));
}

// Remove premium access
export function removePremiumAccess(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PREMIUM_KEY);
}

// Get premium expiration date
export function getPremiumExpiresAt(): Date | null {
  if (typeof window === 'undefined') return null;

  const premiumData = localStorage.getItem(PREMIUM_KEY);
  if (!premiumData) return null;

  try {
    const data: PremiumData = JSON.parse(premiumData);
    return new Date(data.expires_at);
  } catch {
    return null;
  }
}
