import { supabase } from '@/lib/supabase';
import { Construction } from '@/types/construction';

export const getConstructions = async (): Promise<Construction[]> => {
  const { data, error } = await supabase
    .from('licenças_ambientais')
    .select('*');

  if (error) {
    console.error('Erro ao buscar construções:', error);
    throw error;
  }

  return data || [];
};

export const getCities = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('licenças_ambientais')
    .select('city')
    .order('city');

  if (error) {
    console.error('Erro ao buscar cidades:', error);
    throw error;
  }

  // Remover duplicatas
  const cities = [...new Set(data.map(item => item.city))];
  return cities;
};

export const getLicenseTypes = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('licenças_ambientais')
    .select('licenseType')
    .order('licenseType');

  if (error) {
    console.error('Erro ao buscar tipos de licença:', error);
    throw error;
  }

  // Remover duplicatas
  const types = [...new Set(data.map(item => item.licenseType))];
  return types;
};

export const filterConstructions = async (filter: {
  status?: 'approved' | 'pending' | 'all',
  dateRange?: { start?: string, end?: string },
  city?: string,
  licenseType?: string,
  search?: string
}): Promise<Construction[]> => {
  let query = supabase
    .from('licenças_ambientais')
    .select('*');

  // Aplicar filtros
  if (filter.status && filter.status !== 'all') {
    query = query.eq('status', filter.status);
  }

  if (filter.dateRange?.start) {
    query = query.gte('documentDate', filter.dateRange.start);
  }

  if (filter.dateRange?.end) {
    // Adicionar um dia para incluir o dia final completo
    const endDate = new Date(filter.dateRange.end);
    endDate.setDate(endDate.getDate() + 1);
    query = query.lt('documentDate', endDate.toISOString().split('T')[0]);
  }

  if (filter.city) {
    query = query.eq('city', filter.city);
  }

  if (filter.licenseType) {
    query = query.eq('licenseType', filter.licenseType);
  }

  if (filter.search) {
    query = query.or(`address.ilike.%${filter.search}%,companyName.ilike.%${filter.search}%,city.ilike.%${filter.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao filtrar construções:', error);
    throw error;
  }

  return data || [];
};