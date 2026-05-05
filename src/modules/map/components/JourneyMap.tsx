import React, { useEffect, useState, useRef, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer } from 'react-map-gl';
import type { LineLayer, HeatmapLayer } from 'react-map-gl'; 
import mapboxgl from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css'; 
import { mapService } from '../services/map.service';
import { MapMarkerResponse } from '@/modules/checkin/types';
import { Loader2, Play, Pause, FastForward } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

interface JourneyMapProps {
  journeyId?: string;
  boxId?: string;
  userId?: string;
  mapMode: 'markers' | 'heatmap'; // Prop mới
  className?: string;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ journeyId, boxId, userId, mapMode, className }) => {
  const [markers, setMarkers] = useState<MapMarkerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerResponse | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState<number>(-1);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      setLoading(true);
      try {
        let data: MapMarkerResponse[] = [];
        if (journeyId) { data = await mapService.getJourneyMarkers(journeyId); }
        else if (boxId) { data = await mapService.getBoxMarkers(boxId); }
        else if (userId) {
          if (userId === 'me') data = await mapService.getMyMarkers();
          else data = await mapService.getUserMarkers(userId);
        }
        setMarkers(data);
        setPlaybackIndex(data.length - 1);
      } catch (error) { console.error("Lỗi:", error); } finally { setLoading(false); }
    };
    if (journeyId || boxId || userId) fetchMarkers();
  }, [journeyId, boxId, userId]);

  const sortedMarkers = useMemo(() => {
    return [...markers].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  }, [markers]);

  // --- VẼ ĐƯỜNG TIME-LAPSE ---
  const routeGeoJSON = useMemo(() => {
    if (sortedMarkers.length < 2 || playbackIndex < 1 || mapMode === 'heatmap') return null;
    const currentMarkers = sortedMarkers.slice(0, playbackIndex + 1);
    return {
      type: 'Feature' as const, properties: {},
      geometry: { type: 'LineString' as const, coordinates: currentMarkers.map(m => [m.longitude, m.latitude]) }
    };
  }, [sortedMarkers, playbackIndex, mapMode]);

  const routeLayerStyle: LineLayer = {
    id: 'journey-route-layer', type: 'line',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#22c55e', 'line-width': 4, 'line-dasharray': [2, 2], 'line-opacity': 0.8 }
  };

  // --- VẼ HEATMAP (BẢN ĐỒ NHIỆT) ---
  const heatmapGeoJSON = useMemo(() => {
    if (mapMode !== 'heatmap' || markers.length === 0) return null;
    return {
        type: 'FeatureCollection' as const,
        features: markers.map(m => ({
            type: 'Feature' as const,
            properties: {},
            geometry: { type: 'Point' as const, coordinates: [m.longitude, m.latitude] }
        }))
    };
  }, [markers, mapMode]);

  const heatmapLayer: HeatmapLayer = {
    id: 'checkins-heatmap',
    type: 'heatmap',
    paint: {
        'heatmap-weight': 1,
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 3],
        'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(34, 197, 94, 0)',      
            0.2, 'rgba(74, 222, 128, 0.5)', 
            0.4, 'rgba(250, 204, 21, 0.7)', 
            0.6, 'rgba(249, 115, 22, 0.8)', 
            0.8, 'rgba(239, 68, 68, 0.9)',  
            1, 'rgba(185, 28, 28, 1)'       
        ],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 5, 15, 30],
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.8, 15, 0.6]
    }
  };

  // --- LOGIC PHÁT TIME-LAPSE ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && sortedMarkers.length > 0 && mapMode !== 'heatmap') {
      if (playbackIndex >= sortedMarkers.length - 1) {
          setPlaybackIndex(0);
          mapRef.current?.flyTo({ center: [sortedMarkers[0].longitude, sortedMarkers[0].latitude], zoom: 14, duration: 1500 });
      }
      interval = setInterval(() => {
        setPlaybackIndex((prev) => {
          const nextIdx = prev + 1;
          if (nextIdx >= sortedMarkers.length) { setIsPlaying(false); return prev; }
          const marker = sortedMarkers[nextIdx];
          if (mapRef.current) {
            mapRef.current.flyTo({ center: [marker.longitude, marker.latitude], zoom: 14, pitch: 45, duration: 2500, essential: true });
            setSelectedMarker(marker); 
          }
          return nextIdx;
        });
      }, 3500); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, sortedMarkers, playbackIndex, mapMode]);

  const handleMapLoad = (e: any) => {
    if (markers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds(); 
      markers.forEach(m => { if(m.longitude && m.latitude) bounds.extend([m.longitude, m.latitude]); });
      e.target.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 2000 });
    }
  };

  const containerClass = className || "w-full h-full min-h-[250px] rounded-[inherit] overflow-hidden relative z-0";

  if (loading) return (
      <div className={`${containerClass} flex flex-col items-center justify-center bg-[#0a0a0a] !border-none`}>
        <Loader2 className="w-10 h-10 animate-spin text-green-400 mb-3" />
        <span className="text-green-400 font-bold text-sm tracking-widest animate-pulse">ĐANG TÌM KIẾM...</span>
      </div>
  );

  if (markers.length === 0) return (
      <div className={`${containerClass} flex flex-col items-center justify-center bg-[#0a0a0a] text-zinc-500 !border-none`}>
        <div className="text-6xl mb-4 animate-bounce">🛸</div>
        <p className="text-lg font-black text-white/50">Vùng đất trống</p>
      </div>
  );

  const visibleMarkers = mapMode === 'markers' ? sortedMarkers.slice(0, playbackIndex + 1) : [];

  return (
    <div className={containerClass}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 106.660172, latitude: 10.762622, zoom: 5 }}
        mapStyle="mapbox://styles/sonejwt/cmm83hwcx000v01sh197p66jv" 
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={handleMapLoad}
      >
        <div className="absolute bottom-10 left-4 z-10 overflow-hidden rounded-[20px] shadow-2xl">
           <NavigationControl showCompass={false} />
        </div>

        {/* LAYER BẢN ĐỒ NHIỆT */}
        {mapMode === 'heatmap' && heatmapGeoJSON && (
          <Source id="checkins-heatmap-source" type="geojson" data={heatmapGeoJSON}>
            <Layer {...heatmapLayer} />
          </Source>
        )}

        {/* LAYER VẼ ĐƯỜNG */}
        {journeyId && routeGeoJSON && mapMode === 'markers' && (
          <Source id="journey-route-source" type="geojson" data={routeGeoJSON}>
            <Layer {...routeLayerStyle} />
          </Source>
        )}

        {/* LAYER MARKERS (Chỉ hiện khi ko ở chế độ Heatmap) */}
        {mapMode === 'markers' && visibleMarkers.map((marker, index) => {
          const rotation = index % 2 === 0 ? '-rotate-3' : 'rotate-3';
          return (
            <Marker key={marker.checkinId} longitude={marker.longitude} latitude={marker.latitude} anchor="bottom" onClick={(e: any) => { e.originalEvent.stopPropagation(); setSelectedMarker(marker); }}>
              <div className="relative group cursor-pointer transition-all duration-300 hover:z-50 hover:-translate-y-2 origin-bottom mb-2 animate-in zoom-in fade-in duration-500">
                <div className={cn("w-[70px] h-[75px] bg-white p-1.5 rounded-[20px] shadow-[0_12px_25px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110", rotation)}>
                  <div className="w-full h-full rounded-[14px] bg-cover bg-center" style={{ backgroundImage: `url('${marker.thumbnailUrl || marker.userAvatar}')` }} />
                </div>
                <img src={marker.userAvatar} className="w-8 h-8 rounded-full absolute -bottom-3 -right-3 border-[3px] border-white object-cover shadow-lg bg-zinc-200 z-10 group-hover:scale-110 transition-transform" alt="avt" />
                <div className="absolute -top-3 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-md border-[2px] border-white z-10 rotate-[-10deg]">{index + 1}</div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white drop-shadow-md" />
              </div>
            </Marker>
          );
        })}

        {/* POPUP */}
        {selectedMarker && mapMode === 'markers' && (
          <Popup longitude={selectedMarker.longitude} latitude={selectedMarker.latitude} anchor="bottom" offset={80} closeOnClick={false} onClose={() => setSelectedMarker(null)} className="custom-gamified-popup" maxWidth="260px">
            <div className="p-1.5 w-60 bg-white/95 backdrop-blur-xl rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/40">
                <div className="relative w-full h-36 rounded-[22px] overflow-hidden mb-3 shadow-inner">
                    <img src={selectedMarker.thumbnailUrl} alt="Checkin" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10">
                        <p className="font-black text-[16px] text-white truncate drop-shadow-md">{selectedMarker.fullname}</p>
                    </div>
                </div>
                <a href={`/checkin/${selectedMarker.checkinId}`} className="w-full h-11 flex items-center justify-center gap-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-[18px] text-black font-extrabold text-[15px] shadow-[0_5px_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                    Khám phá ngay ✨
                </a>
            </div>
            <style>{`.custom-gamified-popup .mapboxgl-popup-content { background: transparent !important; padding: 0 !important; box-shadow: none !important; } .custom-gamified-popup .mapboxgl-popup-tip { display: none; }`}</style>
          </Popup>
        )}
      </Map>

      {/* THANH ĐIỀU KHIỂN TIME-LAPSE (Chỉ hiện khi ở chế độ marker) */}
      {journeyId && sortedMarkers.length >= 2 && mapMode === 'markers' && (
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-[480px]">
          <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-xl p-4 md:p-5 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-200 dark:border-white/10 flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform shadow-md">
              {isPlaying ? <Pause size={20} strokeWidth={3} /> : <Play size={20} strokeWidth={3} className="ml-1" />}
            </button>
            <div className="flex-1 flex flex-col gap-2">
              <input type="range" min="0" max={sortedMarkers.length - 1} value={playbackIndex} onChange={(e) => { setIsPlaying(false); const idx = parseInt(e.target.value); setPlaybackIndex(idx); const marker = sortedMarkers[idx]; mapRef.current?.flyTo({ center: [marker.longitude, marker.latitude], zoom: 14 }); setSelectedMarker(marker); }} className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-green-500" />
              <div className="flex justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                <span>Điểm xuất phát</span>
                <span>{sortedMarkers[playbackIndex]?.createdAt ? new Date(sortedMarkers[playbackIndex].createdAt).toLocaleDateString('vi-VN') : 'Đích đến'}</span>
              </div>
            </div>
            <button onClick={() => { setIsPlaying(false); setPlaybackIndex(sortedMarkers.length - 1); handleMapLoad({ target: mapRef.current?.getMap() }); }} className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-[18px] flex items-center justify-center shrink-0 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors" title="Xem toàn bộ">
              <FastForward size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};