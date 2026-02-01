// ----------------------------------------------------------------------

export type IVendor = {
  id: number;
  name: string;
  avatar: string | null;
};

export type IVendorListResponse = {
  success: boolean;
  msg: string;
  data: IVendor[];
  meta: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
};

export type IVendorTableFilters = {
  name: string;
};
