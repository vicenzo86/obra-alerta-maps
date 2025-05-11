import React, { useState, useMemo, useEffect } from 'react';
import Map from '@/components/Map';
import FilterBar from '@/components/FilterBar';
import CategoryScroller from '@/components/CategoryScroller';
import ConstructionCard from '@/components/ConstructionCard';
import ConstructionDetails from '@/components/ConstructionDetails';
import { Construction, ConstructionFilter, CategoryOption } from '@/types/construction';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Calendar, Home, MapPin, Search } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { createClient } from '@supabase/supabase-js';

// Inicializau00e7u00e3o do cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Index = () => {
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState("map");
  const [selectedConstruction, setSelectedConstruction] = useState<Construction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filter, setFilter] = useState<ConstructionFilter>({ status: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [licenseTypes, setLicenseTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: CategoryOption[] = [
    { id: 'all', label: 'Todos', icon: <Search className="h-4 w-4" /> },
    { id: 'approved', label: 'Aprovados', icon: <Building className="h-4 w-4" /> },
    { id: 'pending', label: 'Em Aprovau00e7u00e3o', icon: <Calendar className="h-4 w-4" /> },
    { id: 'residential', label: 'Residencial', icon: <Home className="h-4 w-4" /> },
    { id: 'commercial', label: 'Comercial', icon: <Building className="h-4 w-4" /> },
  ];

// Função para buscar dados do Supabase
const fetchConstructions = async () => {
  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('licenças_ambientais')
      .select('*');

    if (error) {
      console.error('Erro ao buscar dados:', error);
      return;
    }

    // Mapear os dados do Supabase para o formato esperado pela aplicau00e7u00e3o
    const mappedData: Construction[] = data.map((item: any) => ({
      id: item.id.toString(),
      address: item["Endereço"] || '',
      latitude: 0, // Nu00e3o existe na tabela, definindo valor padru00e3o
      longitude: 0, // Nu00e3o existe na tabela, definindo valor padru00e3o
      status: 'pending', // Nu00e3o existe na tabela, definindo valor padru00e3o
      documentDate: item["Data"] || '',
      constructionArea: parseFloat(item["Área Construída"]) || 0,
      landArea: parseFloat(item["Área do Terreno"]) || 0,
      licenseType: item["Tipo de Licença"] || '',
      fileName: item["Nome do Arquivo"] || '',
      cnpj: item["CNPJ"] || '',
      companyName: item["Nome da Empresa"] || '',
      city: item["Cidade"] || ''
    }));

    setConstructions(mappedData);

    // Extrair cidades e tipos de licença u00fanicos
    const uniqueCities = [...new Set(mappedData.map(item => item.city))].sort();
    const uniqueLicenseTypes = [...new Set(mappedData.map(item => item.licenseType))].sort();

    setCities(uniqueCities);
    setLicenseTypes(uniqueLicenseTypes);
  } catch (error) {
    console.error('Erro ao processar dados:', error);
  } finally {
    setLoading(false);
  }
};

  // Buscar dados ao carregar o componente
  useEffect(() => {
    fetchConstructions();
  }, []);

  // Função para filtrar construções
  const filterConstructions = (
    constructions: Construction[],
    filter: {
      status?: 'approved' | 'pending' | 'all',
      dateRange?: { start?: string, end?: string },
      city?: string,
      licenseType?: string,
      search?: string
    }
  ): Construction[] => {
    return constructions.filter(construction => {
      // Filter by status
      if (filter.status && filter.status !== 'all' && construction.status !== filter.status) {
        return false;
      }

      // Filter by date range
      if (filter.dateRange) {
        const docDate = new Date(construction.documentDate);
        if (filter.dateRange.start) {
          const startDate = new Date(filter.dateRange.start);
          if (docDate < startDate) return false;
        }
        if (filter.dateRange.end) {
          const endDate = new Date(filter.dateRange.end);
          endDate.setHours(23, 59, 59, 999); // Set to end of day
          if (docDate > endDate) return false;
        }
      }

      // Filter by city
      if (filter.city && construction.city !== filter.city) {
        return false;
      }

      // Filter by license type
      if (filter.licenseType && construction.licenseType !== filter.licenseType) {
        return false;
      }

      // Filter by search term
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          construction.address.toLowerCase().includes(searchLower) ||
          construction.companyName.toLowerCase().includes(searchLower) ||
          construction.city.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  };

  const filteredConstructions = useMemo(() => {
    let filtered = filterConstructions(constructions, {
      ...filter,
      search: searchQuery
    });

    if (selectedCategory === 'approved') {
      filtered = filtered.filter(c => c.status === 'approved');
    } else if (selectedCategory === 'pending') {
      filtered = filtered.filter(c => c.status === 'pending');
    } else if (selectedCategory === 'Residencial') {
      filtered = filtered.filter(c => c.licenseType === 'Residencial');
    } else if (selectedCategory === 'Comercial') {
      filtered = filtered.filter(c => c.licenseType === 'Comercial');
    }

    return filtered;
  }, [constructions, filter, searchQuery, selectedCategory]);

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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          </div>
        ) : (
          <>
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
                <div className="relative h-[500px] min-h-[500px] rounded-lg overflow-hidden border">
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
          </>
        )}
      </div>
    </main>
  );
};

export default Index;