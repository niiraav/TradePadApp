import React, { useState } from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

export interface MapPreviewProps {
  address: string;
  onTap?: () => void;
}

export const MapPreview: React.FC<MapPreviewProps> = ({ address, onTap }) => {
  const [error, setError] = useState(false);

  if (!address) return null;

  const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  const handleClick = () => {
    if (onTap) {
      onTap();
    } else {
      window.open(mapsUrl, '_blank');
    }
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(address)}`, '_blank');
  };

  // Fallback placeholder if iframe fails
  if (error) {
    return (
      <div
        onClick={handleClick}
        className="h-[120px] rounded-[10px] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative bg-[radial-gradient(circle,#E5E7EB_1px,transparent_1px)] bg-[length:12px_12px]"
      >
        <MapPin size={28} color="#9CA3AF" />
        <p className="text-[13px] text-[#6B7280] mt-1 px-4 text-center truncate w-full">
          {address}
        </p>
        <div className="absolute bottom-1.5 right-2 flex items-center gap-1 text-[11px] text-[#9CA3AF]">
          <ExternalLink size={10} />
          Open in Maps
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-[10px] overflow-hidden h-[140px] group">
      {/* Real map iframe */}
      <iframe
        src={embedUrl}
        width="100%"
        height="140"
        style={{ border: 0, pointerEvents: 'none' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onError={() => setError(true)}
        title={`Map of ${address}`}
      />
      
      {/* Click overlay — taps open full Google Maps */}
      <div
        onClick={handleClick}
        className="absolute inset-0 cursor-pointer"
        aria-label="Open map"
      />

      {/* Address label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
        <p className="text-[12px] text-white font-medium truncate drop-shadow">
          {address}
        </p>
      </div>

      {/* Directions button */}
      <button
        onClick={handleDirections}
        className="absolute top-2 right-2 w-[36px] h-[36px] rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        aria-label="Get directions"
      >
        <Navigation size={16} color="#111827" />
      </button>
    </div>
  );
};
