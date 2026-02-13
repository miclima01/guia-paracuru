import { supabase } from '@/lib/supabase';
import { formatCarnivalDateRange, formatLocation } from '@/lib/format-dates';
import HomePageClient from '@/components/public/HomePageClient';
import type { NewsArticle, Business } from '@/types';

// Force dynamic rendering since we depend on DB data
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch main content in parallel
  const [
    newsRes,
    bizRes,
    heroRes,
    whatsappRes,
    startDateRes,
    endDateRes,
    cityRes,
    stateRes
  ] = await Promise.all([
    supabase.from('news').select('id,title,summary,image_url,category,published_at').order('published_at', { ascending: false }).limit(3),
    supabase.from('businesses').select('*').eq('is_featured', true).order('order_index').limit(10),
    supabase.from('app_settings').select('value').eq('key', 'hero_background_image').single(),
    supabase.from('app_settings').select('value').eq('key', 'support_whatsapp').single(),
    supabase.from('app_settings').select('value').eq('key', 'carnival_start_date').single(),
    supabase.from('app_settings').select('value').eq('key', 'carnival_end_date').single(),
    supabase.from('app_settings').select('value').eq('key', 'city_name').single(),
    supabase.from('app_settings').select('value').eq('key', 'state').single(),
  ]);

  const news = (newsRes.data || []) as NewsArticle[];
  const featured = (bizRes.data || []) as Business[];
  const heroImage = heroRes.data?.value || null;
  const supportWhatsapp = whatsappRes.data?.value || '';

  let carnivalDates = '13 a 17 de Fevereiro, 2026';
  if (startDateRes.data?.value && endDateRes.data?.value) {
    carnivalDates = formatCarnivalDateRange(startDateRes.data.value, endDateRes.data.value);
  }

  let location = 'Paracuru, Ceará - Brasil';
  if (cityRes.data?.value && stateRes.data?.value) {
    location = formatLocation(cityRes.data.value, stateRes.data.value);
  }

  return (
    <HomePageClient
      heroImage={heroImage}
      news={news}
      featured={featured}
      carnivalDates={carnivalDates}
      location={location}
      supportWhatsapp={supportWhatsapp}
    />
  );
}
