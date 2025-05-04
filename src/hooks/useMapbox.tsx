
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Construction } from '@/types/construction';
import { toast } from '@/components/ui/use-toast';
import { createMapMarker } from '@/components/MapMarker';
import { checkWebGLSupport } from '@/utils/webGLDetection';

// Default Mapbox token
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoidmljZW56bzE5ODYiLCJhIjoiY21hOTJ1dDk3MW43ajJwcHdtancwbG9zbSJ9.TTMx21fG8mpx04i1h2hl-Q';

interface UseMapboxProps {
  constructions: Construction[];
  onMarkerClick?: (construction: Construction) => void;
  center?: [number, number];
  zoom?: number;
}

export const useMapbox = ({
  constructions,
  onMarkerClick,
  center = [-49.6401, -27.2423],
  zoom = 9
}: UseMapboxProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken] = useState<string>(DEFAULT_MAPBOX_TOKEN);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapboxSupported, setMapboxSupported] = useState(true);
  const [checkedSupport, setCheckedSupport] = useState(false);

  // Check WebGL support
  useEffect(() => {
    const supportsWebGL = checkWebGLSupport();
    
    if (!supportsWebGL) {
      console.log("Browser doesn't support WebGL");
      setMapboxSupported(false);
      setMapError("Seu navegador não suporta WebGL, necessário para exibir o mapa.");
    }
    
    setCheckedSupport(true);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !checkedSupport || !mapboxSupported) {
      console.log("Map initialization skipped:", { 
        hasContainer: !!mapContainer.current, 
        hasToken: !!mapboxToken, 
        checkedSupport, 
        mapboxSupported 
      });
      return;
    }

    // Cleanup previous map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    try {
      console.log("Initializing Mapbox with token:", mapboxToken);
      
      mapboxgl.accessToken = mapboxToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      newMap.on('load', () => {
        console.log("Map loaded successfully");
        setMapLoaded(true);
        setMapError(null);
        toast({
          title: "Mapa carregado",
          description: "O mapa foi carregado com sucesso!",
        });
      });

      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError("Erro ao carregar o mapa. Verifique sua conexão.");
        setMapboxSupported(false);
        toast({
          title: "Erro ao carregar o mapa",
          description: "Não foi possível carregar o mapa. Usando visualização alternativa.",
          variant: "destructive"
        });
      });

      map.current = newMap;
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
      setMapError("Erro ao inicializar o mapa. Seu navegador pode não suportar WebGL.");
      setMapboxSupported(false);
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, center, zoom, checkedSupport, mapboxSupported]);

  // Add markers to map
  useEffect(() => {
    if (!map.current || !mapLoaded || !mapboxToken || !mapboxSupported) return;
    
    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add new markers
    constructions.forEach(construction => {
      try {
        if (!construction.latitude || !construction.longitude) return;
        
        const marker = createMapMarker({
          map: map.current!,
          construction,
          onMarkerClick
        });
        
        markers.current.push(marker);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });
  }, [constructions, mapboxToken, onMarkerClick, mapLoaded, mapboxSupported]);

  return {
    mapContainer,
    mapboxSupported,
    mapError,
    mapLoaded
  };
};
