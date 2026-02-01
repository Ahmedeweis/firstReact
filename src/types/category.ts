// ----------------------------------------------------------------------

export type ICategoryStatus = 'active' | 'inactive' | 'pending';

export type ICategory = {
  id: number;
  name: string;
  description: string;
  status: ICategoryStatus;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  cover: string | null;
};

export type ICategoryListResponse = {
  success: boolean;
  msg: string;
  data: ICategory[];
  meta: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
};

export type ICategoryTableFilters = {
  name: string;
  status: string;
};

export type ICategoryTableFilterValue = string | string[];
