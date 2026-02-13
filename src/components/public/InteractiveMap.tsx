'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Star, Navigation, MessageCircle, Clock } from 'lucide-react';
import { CATEGORY_LABELS, SERVICE_CATEGORY_LABELS } from '@/lib/utils';
import type { BusinessCategory, ServiceCategory } from '@/types';

export interface MapMarker {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  address?: string | null;
  opening_hours?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  image_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_partner?: boolean;
  is_featured?: boolean;
  source: 'business' | 'service';
}

function getMarkerLabel(marker: MapMarker): string {
  if (marker.source === 'service') {
    return SERVICE_CATEGORY_LABELS[marker.category as ServiceCategory] || marker.category;
  }
  return CATEGORY_LABELS[marker.category as BusinessCategory] || marker.category;
}

// Fix default marker icons (Leaflet + webpack issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORY_EMOJIS: Record<string, string> = {
  restaurant: '🍴',
  bar: '🍻',
  hotel: '🛏️',
  pousada: '🏡',
  beach_club: '🍹',
  pharmacy: '💊',
  market: '🛒',
  gas_station: '⛽',
  hospital: '🏥',
  health_post: '🩺',
  praia: '🏝️',
  rodoviaria: '🚍',
  bank: '💵',
  police: '👮',
  mechanic: '🔧',
  arena: '🎪',
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
  praia: '#0ea5e9',
  rodoviaria: '#475569',
  bank: '#16a34a',
  police: '#2563eb',
  mechanic: '#475569',
  arena: '#9333ea',
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

// Component to fit bounds when markers change
function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  const initRef = useRef(false);

  useEffect(() => {
    if (markers.length > 0 && !initRef.current) {
      const bounds = L.latLngBounds(
        markers.map((b) => [b.latitude!, b.longitude!] as [number, number])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
        initRef.current = true;
      }
    }
  }, [markers, map]);

  return null;
}

interface InteractiveMapProps {
  markers: MapMarker[];
}

export default function InteractiveMap({ markers }: InteractiveMapProps) {
  const mappable = markers.filter(
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

        <FitBounds markers={mappable} />

        {mappable.map((item) => (
          <Marker
            key={`${item.source}-${item.id}`}
            position={[item.latitude!, item.longitude!]}
            icon={createCategoryIcon(item.category)}
          >
            <Popup maxWidth={280} minWidth={240}>
              <div className="font-sans -mx-2 -my-1">
                {item.image_url && (
                  <div className="h-28 -mt-1 -mx-0 mb-2 overflow-hidden rounded-lg">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-1 mb-1.5">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${item.source === 'service' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {getMarkerLabel(item)}
                  </span>
                  {item.source === 'service' && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                      Serviço
                    </span>
                  )}
                  {item.is_partner && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                      Parceiro
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-gray-900 leading-tight">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {item.address && (
                  <p className="text-xs text-gray-400 mt-1.5 flex items-start gap-1">
                    <MapPin size={12} className="shrink-0 mt-0.5" />
                    {item.address}
                  </p>
                )}

                {item.opening_hours && (
                  <p className="text-xs text-gray-400 mt-1.5 flex items-start gap-1">
                    <Clock size={12} className="shrink-0 mt-0.5" />
                    {item.opening_hours}
                  </p>
                )}

                {item.phone && (
                  <p className="text-xs text-gray-500 mt-1">
                    <a href={`tel:${item.phone}`} className="text-blue-600 font-medium">
                      {item.phone}
                    </a>
                  </p>
                )}

                {item.is_partner && (
                  <div className="flex gap-0.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  {(item.whatsapp || item.phone) && (
                    <a
                      href={`https://wa.me/55${(item.whatsapp || item.phone || '').replace(/\D/g, '')}`}
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
                    href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
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
