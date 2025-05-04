
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Construction } from '@/types/construction';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { AlertCircle, MapPin } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface MapProps {
  constructions: Construction[];
  onMarkerClick?: (construction: Construction) => void;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

// Using the provided Mapbox token
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoidmljZW56bzE5ODYiLCJhIjoiY21hOTJ1dDk3MW43ajJwcHdtancwbG9zbSJ9.TTMx21fG8mpx04i1h2hl-Q';

const Map: React.FC<MapProps> = ({ 
  constructions, 
  onMarkerClick, 
  className,
  center = [-49.6401, -27.2423],
  zoom = 9
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(DEFAULT_MAPBOX_TOKEN);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapboxSupported, setMapboxSupported] = useState(true);
  const [checkedSupport, setCheckedSupport] = useState(false);

  // Check if WebGL is supported before initializing map
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supportsWebGL = !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      
      if (!supportsWebGL) {
        console.log("Browser doesn't support WebGL");
        setMapboxSupported(false);
        setMapError("Seu navegador não suporta WebGL, necessário para exibir o mapa.");
      }
      setCheckedSupport(true);
    } catch (e) {
      console.error("Error checking WebGL support:", e);
      setMapboxSupported(false);
      setMapError("Erro ao verificar suporte para WebGL.");
      setCheckedSupport(true);
    }
  }, []);

  // Get the Mapbox token from localStorage or use default
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  // Initialize map if WebGL is supported
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !checkedSupport || !mapboxSupported) return;

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
        setMapError(null);
        toast({
          title: "Mapa carregado",
          description: "O mapa foi carregado com sucesso!",
        });
      });

      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError("Erro ao carregar o mapa. Verifique seu token do Mapbox.");
        toast({
          title: "Erro ao carregar o mapa",
          description: "Verifique seu token do Mapbox e tente novamente.",
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
  }, [constructions, mapboxToken, onMarkerClick, mapLoaded, mapboxSupported]);

  // Render fallback list view when WebGL is not supported
  const renderFallbackView = () => {
    return (
      <div className="p-4 bg-white rounded-lg shadow overflow-auto max-h-full flex flex-col gap-4">
        <Alert variant="default">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Visualização em Lista</AlertTitle>
          <AlertDescription>
            {mapError || "O mapa interativo não está disponível no seu dispositivo."}
          </AlertDescription>
        </Alert>
        
        {constructions.length > 0 ? (
          <div className="space-y-3">
            {constructions.map((construction) => (
              <div 
                key={construction.id}
                className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => onMarkerClick?.(construction)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{construction.address || 'Endereço não informado'}</p>
                    <p className="text-sm text-muted-foreground">{construction.companyName}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    construction.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {construction.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Área:</span> {construction.constructionArea}m²
                </div>
                {construction.latitude && construction.longitude && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Localização: {construction.latitude.toFixed(4)}, {construction.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Nenhum registro encontrado</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('relative w-full h-full rounded-lg overflow-hidden', className)}>
      {!mapboxToken ? (
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
            Usar token padrão
          </Button>
          <p className="text-xs text-gray-500 text-center mt-4">
            Você pode encontrar seu token em <a href="https://account.mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600">account.mapbox.com</a>
          </p>
        </div>
      ) : !mapboxSupported ? (
        renderFallbackView()
      ) : null}
      <div ref={mapContainer} className="map-container h-full" />
      {mapError && mapboxSupported && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg text-sm">
          Erro no mapa. <Button variant="link" className="p-0 h-auto" onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      )}
    </div>
  );
};

export default Map;
