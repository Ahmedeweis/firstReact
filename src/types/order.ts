import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};

export type IOrderHistory = {
  orderTime: IDateValue;
  paymentTime: IDateValue;
  deliveryTime: IDateValue;
  completionTime: IDateValue;
  timeline: { title: string; time: IDateValue }[];
};

export type IOrderShippingAddress = {
  fullAddress: string;
  phoneNumber: string;
};

export type IOrderPayment = {
  cardType: string;
  cardNumber: string;
  paymentMethod?: string;
  paymentMethodId?: number;
  paymentStatus?: string;
};

export type IOrderDelivery = {
  shipBy: string;
  speedy: string;
  trackingNumber: string;
};

export type IOrderShipment = {
  id: number;
  shipping_method: string;
  status: string;
  tracking_number: string;
};

export type IOrderPaymentDetails = {
  id: number;
  method: string;
  status: string;
  amount: string;
};

export type IOrderCustomer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  ipAddress: string;
};

export type IOrderProductItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  coverUrl: string;
  quantity: number;
};

// Order Creation Types
export type IOrderCreateItem = {
  product_id: number;
  quantity: number;
};

export type IOrderShippingAddressInput = {
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

export type IOrderCreateInput = {
  vendor_id: number;
  items: IOrderCreateItem[];
  payment_method: string;
  shipping_method: string;
  shipping_address: IOrderShippingAddressInput;
  notes?: string;
};

export type IOrderItem = {
  id: string;
  taxes: number;
  status: string;
  shipping: number;
  discount: number;
  subtotal: number;
  orderNumber: string;
  totalAmount: number;
  totalQuantity: number;
  createdAt: IDateValue;
  history: IOrderHistory;
  payment: IOrderPayment;
  customer: IOrderCustomer;
  delivery: IOrderDelivery;
  items: IOrderProductItem[];
  shippingAddress: IOrderShippingAddress;
};

// API Response Types
export type IOrderApiResponse = {
  success: boolean;
  msg: string;
  data: IOrderApiItem[];
  meta: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
};

export type IOrderApiItem = {
  id: number;
  client: {
    id: number;
    name: string;
    email: string;
  };
  vendor: {
    id: number;
    name: string;
    email: string;
  };
  status: string;
  total: string;
  payment_method: string;
  shipping_method: string;
  shipping_address: {
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  notes: string;
  items: IOrderApiProductItem[];
  payment: {
    id: number;
    method: string;
    status: string;
    amount: string;
  };
  shipment: {
    id: number;
    shipping_method: string;
    status: string;
    tracking_number: string;
  };
  created_at: string;
  updated_at: string;
};

export type IOrderApiProductItem = {
  id: number;
  product: {
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
    sale_price: string;
    price_includes_tax: boolean;
    tax_percentage: string;
    date_start: string;
    is_published: boolean;
    stock_status: string;
    category_id: number;
    manufacturer_id: number;
    related: any[];
  };
  quantity: number;
  price: string;
  total: string;
};
