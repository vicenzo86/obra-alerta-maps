
import { Construction } from '@/types/construction';

export const mockConstructions: Construction[] = [
  {
    id: '1',
    address: 'Av. Atlântica, 1702',
    latitude: -27.5972,
    longitude: -48.5499,
    status: 'approved',
    documentDate: '2023-04-15',
    constructionArea: 450,
    landArea: 600,
    licenseType: 'Residencial',
    fileName: 'licenca_residencial_2023_04.pdf',
    cnpj: '12.345.678/0001-90',
    companyName: 'Construtora Atlântica Ltda',
    city: 'Florianópolis'
  },
  {
    id: '2',
    address: 'Rua Lauro Linhares, 589',
    latitude: -27.6007,
    longitude: -48.5470,
    status: 'pending',
    documentDate: '2023-04-28',
    constructionArea: 780,
    landArea: 1200,
    licenseType: 'Comercial',
    fileName: 'licenca_comercial_2023_04.pdf',
    cnpj: '23.456.789/0001-01',
    companyName: 'Comercial Construções S/A',
    city: 'Florianópolis'
  },
  {
    id: '3',
    address: 'Rua João Pio Duarte, 1420',
    latitude: -27.6060,
    longitude: -48.5415,
    status: 'approved',
    documentDate: '2023-03-10',
    constructionArea: 350,
    landArea: 500,
    licenseType: 'Residencial',
    fileName: 'licenca_residencial_2023_03.pdf',
    cnpj: '34.567.890/0001-12',
    companyName: 'Duarte Empreendimentos Ltda',
    city: 'Florianópolis'
  },
  {
    id: '4',
    address: 'Av. Beira Mar Norte, 3450',
    latitude: -27.5815,
    longitude: -48.5489,
    status: 'approved',
    documentDate: '2023-04-05',
    constructionArea: 1200,
    landArea: 1800,
    licenseType: 'Comercial',
    fileName: 'licenca_comercial_2023_04_2.pdf',
    cnpj: '45.678.901/0001-23',
    companyName: 'Norte Edificações Ltda',
    city: 'Florianópolis'
  },
  {
    id: '5',
    address: 'Rua Desembargador Vitor Lima, 260',
    latitude: -27.6045,
    longitude: -48.5230,
    status: 'pending',
    documentDate: '2023-05-02',
    constructionArea: 850,
    landArea: 1300,
    licenseType: 'Misto',
    fileName: 'licenca_misto_2023_05.pdf',
    cnpj: '56.789.012/0001-34',
    companyName: 'Lima Construções S/A',
    city: 'Florianópolis'
  },
  {
    id: '6',
    address: 'Rua Antônio Edu Vieira, 378',
    latitude: -27.6136,
    longitude: -48.5185,
    status: 'pending',
    documentDate: '2023-04-18',
    constructionArea: 520,
    landArea: 750,
    licenseType: 'Residencial',
    fileName: 'licenca_residencial_2023_04_2.pdf',
    cnpj: '67.890.123/0001-45',
    companyName: 'Vieira Empreendimentos Ltda',
    city: 'Florianópolis'
  },
  {
    id: '7',
    address: 'Av. Madre Benvenuta, 1500',
    latitude: -27.5876,
    longitude: -48.5188,
    status: 'approved',
    documentDate: '2023-03-22',
    constructionArea: 950,
    landArea: 1400,
    licenseType: 'Comercial',
    fileName: 'licenca_comercial_2023_03.pdf',
    cnpj: '78.901.234/0001-56',
    companyName: 'Benvenuta Construções Ltda',
    city: 'Florianópolis'
  },
  {
    id: '8',
    address: 'Rua Deputado Antônio Edu Vieira, 1620',
    latitude: -27.6009,
    longitude: -48.5239,
    status: 'approved',
    documentDate: '2023-05-08',
    constructionArea: 620,
    landArea: 900,
    licenseType: 'Residencial',
    fileName: 'licenca_residencial_2023_05.pdf',
    cnpj: '89.012.345/0001-67',
    companyName: 'Tecno Edificações S/A',
    city: 'Florianópolis'
  },
  {
    id: '9',
    address: 'Av. Rubens de Arruda Ramos, 2560',
    latitude: -27.5880,
    longitude: -48.5480,
    status: 'pending',
    documentDate: '2023-04-30',
    constructionArea: 1400,
    landArea: 2200,
    licenseType: 'Comercial',
    fileName: 'licenca_comercial_2023_04_3.pdf',
    cnpj: '90.123.456/0001-78',
    companyName: 'Ramos Empreendimentos S/A',
    city: 'Florianópolis'
  },
  {
    id: '10',
    address: 'Rodovia SC-401, KM 05, 4320',
    latitude: -27.5528,
    longitude: -48.5012,
    status: 'approved',
    documentDate: '2023-03-05',
    constructionArea: 2800,
    landArea: 5000,
    licenseType: 'Industrial',
    fileName: 'licenca_industrial_2023_03.pdf',
    cnpj: '01.234.567/0001-89',
    companyName: 'SC Indústrias Ltda',
    city: 'São José'
  },
  {
    id: '11',
    address: 'Rua Koesa, 452',
    latitude: -27.5328,
    longitude: -48.4912,
    status: 'approved',
    documentDate: '2023-05-12',
    constructionArea: 380,
    landArea: 550,
    licenseType: 'Residencial',
    fileName: 'licenca_residencial_2023_05_2.pdf',
    cnpj: '12.345.678/0001-90',
    companyName: 'Koesa Construções Ltda',
    city: 'Palhoça'
  },
  {
    id: '12',
    address: 'Av. das Rendeiras, 1840',
    latitude: -27.6444,
    longitude: -48.4758,
    status: 'pending',
    documentDate: '2023-04-25',
    constructionArea: 720,
    landArea: 1100,
    licenseType: 'Hoteleiro',
    fileName: 'licenca_hoteleiro_2023_04.pdf',
    cnpj: '23.456.789/0001-01',
    companyName: 'Lagoa Construções S/A',
    city: 'Florianópolis'
  }
];

export const getCities = (): string[] => {
  const cities = [...new Set(mockConstructions.map(item => item.city))];
  return cities.sort();
};

export const getLicenseTypes = (): string[] => {
  const types = [...new Set(mockConstructions.map(item => item.licenseType))];
  return types.sort();
};

export const filterConstructions = (
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
