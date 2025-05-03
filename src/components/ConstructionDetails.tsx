
import React from 'react';
import { Construction } from '@/types/construction';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Building, CalendarDays, MapPin, ArrowRight } from 'lucide-react';

interface ConstructionDetailsProps {
  construction: Construction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConstructionDetails: React.FC<ConstructionDetailsProps> = ({ 
  construction, 
  open,
  onOpenChange
}) => {
  if (!construction) return null;

  const {
    address,
    status,
    documentDate,
    constructionArea,
    landArea,
    licenseType,
    fileName,
    cnpj,
    companyName,
    city
  } = construction;

  const formattedDate = format(new Date(documentDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const getGoogleMapsLink = () => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', ' + city)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Detalhes da Obra</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">{address}</h3>
            <Badge variant={status === 'approved' ? 'default' : 'outline'} className={
              status === 'approved' ? 'bg-status-approved' : 'text-status-pending border-status-pending'
            }>
              {status === 'approved' ? 'Aprovada' : 'Em aprovação'}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{city}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Documento: {formattedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{companyName}</span>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Área construção</p>
              <p className="font-medium">{constructionArea} m²</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Área terreno</p>
              <p className="font-medium">{landArea} m²</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de licença</p>
              <p className="font-medium">{licenseType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CNPJ</p>
              <p className="font-medium">{cnpj}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Nome do arquivo</p>
            <p className="font-medium">{fileName}</p>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button asChild>
              <a href={getGoogleMapsLink()} target="_blank" rel="noopener noreferrer">
                Ver no Google Maps
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConstructionDetails;
