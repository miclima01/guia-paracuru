'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Star, Navigation, MessageCircle } from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/utils';
import type { Business, BusinessCategory } from '@/types';

// Fix default marker icons (Leaflet + webpack issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORY_EMOJIS: Record<string, string> = {
  restaurant: '🍽️',
  bar: '🍺',
  hotel: '🏨',
  pousada: '🏠',
  beach_club: '🏖️',
  pharmacy: '💊',
  market: '🛒',
  gas_station: '⛽',
  hospital: '🏥',
  health_post: '🩺',
  other: '📍',
};

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: '#ef4444',
  bar: '#f97316',
  hotel: '#8b5cf6',
  pousada: '#6366f1',
  beach_club: '#06b6d4',
  pharmacy: '#22c55e',
  market: '#eab308',
  gas_station: '#64748b',
  hospital: '#dc2626',
  health_post: '#e11d48',
  other: '#ec4899',
};

function createCategoryIcon(category: string) {
  const emoji = CATEGORY_EMOJIS[category] || CATEGORY_EMOJIS.other;
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;

  return L.divIcon({
    html: `<div style="
      background: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
    ">${emoji}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

// Component to fit bounds when businesses change
function FitBounds({ businesses }: { businesses: Business[] }) {
  const map = useMap();
  const initRef = useRef(false);

  useEffect(() => {
    if (businesses.length > 0 && !initRef.current) {
      const bounds = L.latLngBounds(
        businesses.map((b) => [b.latitude!, b.longitude!] as [number, number])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
        initRef.current = true;
      }
    }
  }, [businesses, map]);

  return null;
}

interface InteractiveMapProps {
  businesses: Business[];
}

export default function InteractiveMap({ businesses }: InteractiveMapProps) {
  const mappable = businesses.filter(
    (b) => b.latitude != null && b.longitude != null
  );

  // Paracuru City aligned center
  const PARACURU_CENTER: [number, number] = [-3.4120, -39.0315];

  return (
    <div className="relative flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}>
      <MapContainer
        center={PARACURU_CENTER}
        zoom={15}
        className="flex-1 w-full rounded-xl z-0"
        style={{ height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds businesses={mappable} />

        {mappable.map((biz) => (
          <Marker
            key={biz.id}
            position={[biz.latitude!, biz.longitude!]}
            icon={createCategoryIcon(biz.category)}
          >
            <Popup maxWidth={280} minWidth={240}>
              <div className="font-sans -mx-2 -my-1">
                {biz.image_url && (
                  <div className="h-28 -mt-1 -mx-0 mb-2 overflow-hidden rounded-lg">
                    <img
                      src={biz.image_url}
                      alt={biz.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-1 mb-1.5">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                    {CATEGORY_LABELS[biz.category as BusinessCategory] || biz.category}
                  </span>
                  {biz.is_partner && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                      Parceiro
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-gray-900 leading-tight">
                  {biz.name}
                </h3>

                {biz.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {biz.description}
                  </p>
                )}

                {biz.address && (
                  <p className="text-xs text-gray-400 mt-1.5 flex items-start gap-1">
                    <MapPin size={12} className="shrink-0 mt-0.5" />
                    {biz.address}
                  </p>
                )}

                {biz.phone && (
                  <p className="text-xs text-gray-500 mt-1">
                    <a href={`tel:${biz.phone}`} className="text-blue-600 font-medium">
                      {biz.phone}
                    </a>
                  </p>
                )}

                {biz.is_partner && (
                  <div className="flex gap-0.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  {(biz.whatsapp || biz.phone) && (
                    <a
                      href={`https://wa.me/55${(biz.whatsapp || biz.phone || '').replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl text-xs font-bold no-underline"
                      style={{ background: '#25D366', color: 'white' }}
                    >
                      <MessageCircle size={14} />
                      WhatsApp
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${biz.latitude},${biz.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl text-xs font-bold no-underline"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' }}
                  >
                    <Navigation size={14} />
                    Abrir rota
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

    </div>
  );
}
