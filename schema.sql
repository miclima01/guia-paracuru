-- ============================================
-- GUIA PARACURU - Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Carnival Schedule / Attractions
CREATE TABLE attractions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  location TEXT,
  artist TEXT,
  image_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News Articles
CREATE TABLE news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'geral',
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses (restaurants, bars, hotels, etc.)
CREATE TABLE businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  website TEXT,
  image_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_partner BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency Contacts
CREATE TABLE emergency_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  icon TEXT DEFAULT 'phone',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transport Contacts (taxi, mototaxi - premium list)
CREATE TABLE transport_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('taxi', 'mototaxi')),
  is_premium BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  device_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  mercadopago_id TEXT,
  qr_code TEXT,
  qr_code_base64 TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Premium Access records
CREATE TABLE premium_access (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  device_id TEXT NOT NULL,
  payment_id UUID REFERENCES payments(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- App Settings (key-value store)
CREATE TABLE app_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_attractions_date ON attractions(date);
CREATE INDEX idx_attractions_premium ON attractions(is_premium);
CREATE INDEX idx_news_published ON news(published_at DESC);
CREATE INDEX idx_news_featured ON news(is_featured);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_partner ON businesses(is_partner);
CREATE INDEX idx_businesses_featured ON businesses(is_featured);
CREATE INDEX idx_transport_category ON transport_contacts(category);
CREATE INDEX idx_payments_device ON payments(device_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_premium_device ON premium_access(device_id);
CREATE INDEX idx_premium_expires ON premium_access(expires_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read attractions" ON attractions FOR SELECT USING (true);
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public read businesses" ON businesses FOR SELECT USING (true);
CREATE POLICY "Public read emergency" ON emergency_contacts FOR SELECT USING (true);
CREATE POLICY "Public read transport" ON transport_contacts FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON app_settings FOR SELECT USING (true);

-- Payments: users can read their own
CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Users read own premium" ON premium_access FOR SELECT USING (true);

-- Service role gets full access (for admin API routes)
CREATE POLICY "Service full access attractions" ON attractions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access news" ON news FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access businesses" ON businesses FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access emergency" ON emergency_contacts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access transport" ON transport_contacts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access payments" ON payments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access premium" ON premium_access FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access settings" ON app_settings FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_attractions_updated_at
  BEFORE UPDATE ON attractions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

CREATE POLICY "Public read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Service upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media');

CREATE POLICY "Service update media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media');

CREATE POLICY "Service delete media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media');

-- ============================================
-- SEED DATA
-- ============================================

-- Default settings
INSERT INTO app_settings (key, value) VALUES
  ('carnival_name', 'Paracuru Folia 2026'),
  ('carnival_start_date', '2026-02-13'),
  ('carnival_end_date', '2026-02-17'),
  ('city_name', 'Paracuru'),
  ('state', 'Ceará'),
  ('premium_price', '1.99'),
  ('premium_duration_days', '7'),
  ('hero_image', ''),
  ('about_text', 'Bem-vindo ao Guia Paracuru! Seu guia completo para o Carnaval de Paracuru 2026.'),
  ('support_whatsapp', '85994293148');

-- Sample emergency contacts
INSERT INTO emergency_contacts (name, phone, category, icon, order_index) VALUES
  ('Hospital / Pronto Socorro', '192', 'hospital', 'hospital', 1),
  ('RAIO / Polícia', '190', 'police', 'shield', 2),
  ('Bombeiros', '193', 'fire', 'flame', 3);
