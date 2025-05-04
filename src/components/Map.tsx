
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
  const [mapboxToken] = useState<string>(DEFAULT_MAPBOX_TOKEN);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapboxSupported, setMapboxSupported] = useState(true);
  const [checkedSupport, setCheckedSupport] = useState(false);

  // Check if WebGL is supported before initializing map
  useEffect(() => {
    try {
      // More robust WebGL detection
      const canvas = document.createElement('canvas');
      let gl = null;
      
      try {
        gl = canvas.getContext('webgl') || 
             canvas.getContext('experimental-webgl') || 
             canvas.getContext('webgl2');
      } catch (e) {
        console.error("Error getting WebGL context:", e);
      }
      
      const supportsWebGL = !!(gl && gl instanceof WebGLRenderingContext);
      
      console.log("WebGL support check:", {
        hasWebGLRenderingContext: !!window.WebGLRenderingContext,
        context: gl,
        supported: supportsWebGL
      });
      
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

  // Initialize map if WebGL is supported
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

    // Cleanup previous map if it exists
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
      {!mapboxSupported ? renderFallbackView() : null}
      <div 
        ref={mapContainer} 
        className={`map-container h-full ${!mapboxSupported ? 'hidden' : ''}`} 
      />
      {mapError && mapboxSupported && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg text-sm">
          Erro no mapa. <Button variant="link" className="p-0 h-auto" onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      )}
    </div>
  );
};

export default Map;
