
import React from 'react';
import { Construction } from '@/types/construction';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { MapPin, Calendar, Building, ArrowRight } from 'lucide-react';

interface ConstructionCardProps {
  construction: Construction;
  onViewDetails?: (construction: Construction) => void;
}

const ConstructionCard: React.FC<ConstructionCardProps> = ({ 
  construction,
  onViewDetails 
}) => {
  const {
    address,
    status,
    documentDate,
    constructionArea,
    landArea,
    licenseType,
    companyName,
    city
  } = construction;

  const dateFormatted = formatDistanceToNow(new Date(documentDate), {
    addSuffix: true,
    locale: ptBR
  });

  const getGoogleMapsLink = () => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', ' + city)}`;
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">{address}</CardTitle>
          <Badge variant={status === 'approved' ? 'default' : 'outline'} className={
            status === 'approved' ? 'bg-status-approved' : 'text-status-pending border-status-pending'
          }>
            {status === 'approved' ? 'Aprovada' : 'Em aprovação'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{city}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{dateFormatted}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{companyName}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="bg-muted px-2 py-1 rounded-md">
              <p className="text-xs text-muted-foreground">Área construção</p>
              <p className="font-medium">{constructionArea} m²</p>
            </div>
            <div className="bg-muted px-2 py-1 rounded-md">
              <p className="text-xs text-muted-foreground">Área terreno</p>
              <p className="font-medium">{landArea} m²</p>
            </div>
          </div>

          <div className="bg-muted px-2 py-1 rounded-md">
            <p className="text-xs text-muted-foreground">Tipo de licença</p>
            <p className="font-medium">{licenseType}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" asChild>
          <a href={getGoogleMapsLink()} target="_blank" rel="noopener noreferrer">
            Ir para o local
          </a>
        </Button>
        <Button variant="default" onClick={() => onViewDetails?.(construction)}>
          <span>Detalhes</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConstructionCard;
