import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IProductFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

export type IProductTableFilters = {
  stock: string[];
  publish: string[];
};

export type IProductReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
};

export type IProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  postedAt: IDateValue;
  isPurchased: boolean;
  attachments?: string[];
};

export type IProductItem = {
  id: string;
  sku: string;
  name: string;
  code: string;
  price: number;
  taxes: number;
  tags: string[];
  sizes: string[];
  publish: string;
  gender: string[];
  coverUrl: string;
  images: string[];
  colors: string[];
  quantity: number;
  category: string;
  available: number;
  totalSold: number;
  description: string;
  totalRatings: number;
  totalReviews: number;
  createdAt: IDateValue;
  inventoryType: string;
  subDescription: string;
  priceSale: number | null;
  reviews: IProductReview[];
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
  saleLabel: {
    enabled: boolean;
    content: string;
  };
  newLabel: {
    enabled: boolean;
    content: string;
  };
};

// API Response Types for Client Products
export type IProductApiResponse = {
  success: boolean;
  msg: string;
  data: IProductApiItem[];
  meta: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
};

export type IProductApiItem = {
  id: number;
  name: string;
  description: string;
  sub_description: string;
  content: string;
  sku: string;
  code: string;
  quantity: number;
  colors: string[];
  sizes: string[];
  stock: number;
  tags: string[];
  required_shipping: boolean;
  length_class: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  priority: number;
  regular_price: string;
  sale_price: string | null;
  price_includes_tax: boolean;
  tax_percentage: string;
  date_start: string | null;
  is_published: boolean;
  stock_status: string;
  category_id: number;
  manufacturer_id: number;
  category: {
    id: number;
    name: string;
    description: string;
    status: string;
    parent_id: number | null;
    created_at: string;
    updated_at: string;
    cover: string | null;
  };
  manufacturer: {
    id: number;
    name: string;
    description: string;
    cover: string | null;
    media: any[];
  };
  related: IProductRelatedItem[];
};

export type IProductRelatedItem = {
  id: number;
  name: string;
  regular_price: string;
  sale_price: string | null;
  cover: string;
  media: IProductMedia[];
};

export type IProductMedia = {
  file_name: string;
  file_type: string;
  file_url_base64: string;
  file_url: string;
  priority: number;
};
