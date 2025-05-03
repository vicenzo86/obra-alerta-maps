
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Construction } from '@/types/construction';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface MapProps {
  constructions: Construction[];
  onMarkerClick?: (construction: Construction) => void;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

// Default Mapbox public token - replace this with your own in production
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHBoOHBvcW0wMGV3MmpteXQ0eGRzOXJuIn0.J6O-2PTjtAqKNvl41IMPDg';

const Map: React.FC<MapProps> = ({ 
  constructions, 
  onMarkerClick, 
  className,
  center = [-49.6401, -27.2423],
  zoom = 9
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Get the Mapbox token from localStorage or use default
  const getMapboxToken = () => {
    const savedToken = localStorage.getItem('mapbox_token');
    return savedToken || DEFAULT_MAPBOX_TOKEN;
  };

  useEffect(() => {
    const token = getMapboxToken();
    setMapboxToken(token);
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Cleanup previous map if it exists
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    try {
      mapboxgl.accessToken = mapboxToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      newMap.on('load', () => {
        setMapLoaded(true);
        toast({
          title: "Mapa carregado",
          description: "O mapa foi carregado com sucesso!",
        });
      });

      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        toast({
          title: "Erro ao carregar o mapa",
          description: "Verifique seu token do Mapbox e tente novamente.",
          variant: "destructive"
        });
      });

      map.current = newMap;
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
      toast({
        title: "Erro ao inicializar o mapa",
        description: "Verifique se o token do Mapbox é válido.",
        variant: "destructive"
      });
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, center, zoom]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !mapboxToken) return;
    
    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add new markers
    constructions.forEach(construction => {
      const { latitude, longitude, status } = construction;
      
      if (!latitude || !longitude) return;

      try {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.borderRadius = '50%';
        el.style.background = status === 'approved' ? '#10b981' : '#f59e0b';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = 'white';
        el.style.fontWeight = 'bold';
        el.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        el.style.cursor = 'pointer';
        el.style.border = '2px solid white';
        el.innerHTML = `<span>${construction.constructionArea}</span>`;
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .addTo(map.current);
          
        el.addEventListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(construction);
          }
          
          // Create popup content
          const popupContent = `
            <div class="font-medium">${construction.address}</div>
            <div class="text-sm text-gray-600">
              ${construction.companyName}
            </div>
            <div class="text-sm mt-2">
              <span class="font-medium">Status:</span> 
              <span class="${status === 'approved' ? 'text-green-600' : 'text-amber-600'}">
                ${status === 'approved' ? 'Aprovada' : 'Em aprovação'}
              </span>
            </div>
          `;
          
          new mapboxgl.Popup({ offset: 25 })
            .setLngLat([longitude, latitude])
            .setHTML(popupContent)
            .addTo(map.current!);
        });
        
        markers.current.push(marker);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });
  }, [constructions, mapboxToken, onMarkerClick, mapLoaded]);

  return (
    <div className={cn('relative w-full h-full rounded-lg overflow-hidden', className)}>
      {!mapboxToken || mapboxToken === DEFAULT_MAPBOX_TOKEN ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-6 z-10">
          <h3 className="text-lg font-medium mb-4">Configuração do Mapa</h3>
          <p className="text-center text-gray-600 mb-4">
            Por favor, entre com seu token público do Mapbox para habilitar o mapa.
          </p>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            placeholder="Token público do Mapbox"
            onChange={(e) => {
              localStorage.setItem('mapbox_token', e.target.value);
              setMapboxToken(e.target.value);
            }}
          />
          <Button 
            variant="outline"
            onClick={() => {
              setMapboxToken(DEFAULT_MAPBOX_TOKEN);
              localStorage.setItem('mapbox_token', DEFAULT_MAPBOX_TOKEN);
            }}
          >
            Usar token padrão (limitado)
          </Button>
          <p className="text-xs text-gray-500 text-center mt-4">
            Você pode encontrar seu token em <a href="https://account.mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600">account.mapbox.com</a>
          </p>
        </div>
      ) : null}
      <div ref={mapContainer} className="map-container h-full" />
    </div>
  );
};

export default Map;
