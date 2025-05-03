
import React, { useState, useMemo } from 'react';
import Map from '@/components/Map';
import FilterBar from '@/components/FilterBar';
import CategoryScroller from '@/components/CategoryScroller';
import ConstructionCard from '@/components/ConstructionCard';
import ConstructionDetails from '@/components/ConstructionDetails';
import { Construction, ConstructionFilter, CategoryOption } from '@/types/construction';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Calendar, Home, MapPin, Search } from 'lucide-react';
import { mockConstructions, getCities, getLicenseTypes, filterConstructions } from '@/data/mockData';
import useAuth from '@/hooks/useAuth';

const Index = () => {
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState("map");
  const [selectedConstruction, setSelectedConstruction] = useState<Construction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filter, setFilter] = useState<ConstructionFilter>({ status: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories: CategoryOption[] = [
    { id: 'all', label: 'Todos', icon: <Search className="h-4 w-4" /> },
    { id: 'approved', label: 'Aprovados', icon: <Building className="h-4 w-4" /> },
    { id: 'pending', label: 'Em Aprovação', icon: <Calendar className="h-4 w-4" /> },
    { id: 'residential', label: 'Residencial', icon: <Home className="h-4 w-4" /> },
    { id: 'commercial', label: 'Comercial', icon: <Building className="h-4 w-4" /> },
  ];

  const cities = useMemo(() => getCities(), []);
  const licenseTypes = useMemo(() => getLicenseTypes(), []);

  const filteredConstructions = useMemo(() => {
    let filtered = filterConstructions(mockConstructions, {
      ...filter,
      search: searchQuery
    });

    if (selectedCategory === 'approved') {
      filtered = filtered.filter(c => c.status === 'approved');
    } else if (selectedCategory === 'pending') {
      filtered = filtered.filter(c => c.status === 'pending');
    } else if (selectedCategory === 'residential') {
      filtered = filtered.filter(c => c.licenseType === 'Residencial');
    } else if (selectedCategory === 'commercial') {
      filtered = filtered.filter(c => c.licenseType === 'Comercial');
    }

    return filtered;
  }, [filter, searchQuery, selectedCategory]);

  const handleFilterChange = (newFilter: ConstructionFilter) => {
    setFilter(newFilter);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleMarkerClick = (construction: Construction) => {
    setSelectedConstruction(construction);
    setIsDetailsOpen(true);
  };

  const handleViewDetails = (construction: Construction) => {
    setSelectedConstruction(construction);
    setIsDetailsOpen(true);
  };

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="container px-4 py-6 mx-auto max-w-7xl flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Obra Alerta Maps</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
        
        <FilterBar 
          onFilterChange={handleFilterChange} 
          onSearch={handleSearch}
          cities={cities}
          licenseTypes={licenseTypes}
        />

        <CategoryScroller 
          categories={categories} 
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        <Tabs 
          value={selectedTab} 
          onValueChange={setSelectedTab} 
          className="flex-1 flex flex-col mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Mapa</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="flex-1 min-h-[500px]">
            <div className="relative h-full rounded-lg overflow-hidden border">
              <Map 
                constructions={filteredConstructions} 
                onMarkerClick={handleMarkerClick}
              />
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium">
                  {filteredConstructions.length} obras encontradas
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="flex-1">
            {filteredConstructions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">Nenhuma obra encontrada</h3>
                <p className="text-muted-foreground mt-2">
                  Tente ajustar seus filtros para ver mais resultados
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setFilter({ status: 'all' });
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredConstructions.map(construction => (
                  <ConstructionCard
                    key={construction.id}
                    construction={construction}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <ConstructionDetails 
          construction={selectedConstruction}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      </div>
    </main>
  );
};

export default Index;
