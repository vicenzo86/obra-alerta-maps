
export interface Construction {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'approved';
  documentDate: string;
  constructionArea: number;
  landArea: number;
  licenseType: string;
  fileName: string;
  cnpj: string;
  companyName: string;
  city: string;
}

export type ConstructionFilter = {
  status?: 'pending' | 'approved' | 'all';
  dateRange?: {
    start?: string;
    end?: string;
  };
  licenseType?: string;
  city?: string;
}

export type CategoryOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
}
