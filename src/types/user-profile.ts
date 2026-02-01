// ----------------------------------------------------------------------

export type ICountry = {
  id: number;
  name: string;
  nationality: string;
  currency: string;
  iso2: string;
  iso3: string;
  phone_code: string;
  capital: string;
  currency_name: string;
  currency_symbol: string;
};

export type IAddress = {
  id: number;
  address: string;
  state_id: string;
  city_id: string;
  country_id: string;
  post_code: string;
  latitude: string;
  longitude: string;
};

export type IUserProfile = {
  id: number;
  name: string;
  last_name: string | null;
  email: string;
  phone: string;
  avatar: string;
  type: 'client' | 'vendor' | 'investor';
  status: 'active' | 'pending' | 'banned';
  gender: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
  national_id: string;
  country_id: string;
  nationality_id: string;
  currency_id: string;
  addresses: IAddress[];
  currency: ICountry;
  country: ICountry;
  nationality: ICountry;
};

export type IUserProfileResponse = {
  success: boolean;
  msg: string;
  data: IUserProfile;
};
