
import React from 'react';
import { Construction } from '@/types/construction';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, MapPin } from 'lucide-react';

interface MapFallbackViewProps {
  constructions: Construction[];
  error: string | null;
  onMarkerClick?: (construction: Construction) => void;
}

const MapFallbackView: React.FC<MapFallbackViewProps> = ({ 
  constructions, 
  error, 
  onMarkerClick 
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow overflow-auto max-h-full flex flex-col gap-4">
      <Alert variant="default">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Visualização em Lista</AlertTitle>
        <AlertDescription>
          {error || "O mapa interativo não está disponível no seu dispositivo."}
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

export default MapFallbackView;
