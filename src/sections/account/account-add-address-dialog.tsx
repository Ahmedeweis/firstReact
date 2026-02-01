import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Country = {
  id: number;
  name: string;
};

type State = {
  id: number;
  name: string;
};

type City = {
  id: number;
  name: string;
};

export const AddAddressSchema = zod.object({
  address: zod.string().min(1, 'Address is required'),
  country_id: zod.string().optional(),
  state_id: zod.string().optional(),
  city_id: zod.string().optional(),
  post_code: zod.string().min(1, 'Post code is required'),
  latitude: zod.string().min(1, 'Latitude is required'),
  longitude: zod.string().min(1, 'Longitude is required'),
});

export type AddAddressSchemaType = zod.infer<typeof AddAddressSchema>;

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onAddressAdded: () => void;
};

export function AccountAddAddressDialog({ open, onClose, onAddressAdded }: Props) {
  const { t } = useTranslate();

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = {
    address: '',
    country_id: '',
    state_id: '',
    city_id: '',
    post_code: '',
    latitude: '',
    longitude: '',
  };

  const methods = useForm<AddAddressSchemaType>({
    mode: 'all',
    resolver: zodResolver(AddAddressSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await axiosInstance.get(`${endpoints.core.countries}?notPaginated=true`);
        console.log('Countries response:', response.data);
        const countriesData = response.data.data || [];
        console.log('Number of countries loaded:', countriesData.length);
        setCountries(countriesData);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        toast.error('Failed to load countries');
      } finally {
        setLoadingCountries(false);
      }
    };

    if (open) {
      fetchCountries();
    }
  }, [open]);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) {
        setStates([]);
        return;
      }

      try {
        setLoadingStates(true);
        console.log('Fetching states for country:', selectedCountry);
        const response = await axiosInstance.get(endpoints.core.states(selectedCountry));
        console.log('States response:', response.data);
        const statesData = response.data.data || [];
        console.log('Number of states loaded:', statesData.length);
        setStates(statesData);
      } catch (error) {
        console.error('Failed to fetch states:', error);
        toast.error('Failed to load states');
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState) {
        setCities([]);
        return;
      }

      try {
        setLoadingCities(true);
        console.log('Fetching cities for state:', selectedState);
        const response = await axiosInstance.get(endpoints.core.cities(selectedState));
        console.log('Cities response:', response.data);
        const citiesData = response.data.data || [];
        console.log('Number of cities loaded:', citiesData.length);
        setCities(citiesData);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        toast.error('Failed to load cities');
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedState]);



  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);

      // For testing: Using hardcoded IDs
      const requestBody = {
        address: data.address,
        state_id: 1,
        country_id: 1,
        city_id: 1,
        post_code: data.post_code,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      };

      console.log('Sending request with body:', requestBody);

      const response = await axiosInstance.post(endpoints.auth.addresses, requestBody);

      console.log('Address added successfully:', response.data);
      toast.success('Address added successfully!');
      onAddressAdded();
      handleClose();
    } catch (error: any) {
      console.error('Failed to add address:', error);
      const errorMessage = error?.msg || error?.message || 'Failed to add address';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSelectedCountry('');
      setSelectedState('');
      setStates([]);
      setCities([]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:map-point-bold" width={24} />
          <span>{t('accountPage.addNewAddress')}</span>
        </Stack>
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {/* Note: Country, State, and City dropdowns are for display only.
                Testing mode: All submissions use IDs of 1 */}
            <TextField
              {...register('address')}
              fullWidth
              label={t('accountPage.address')}
              error={!!errors.address}
              helperText={errors.address?.message}
              disabled={isSubmitting}
            />

            <Autocomplete
              fullWidth
              options={countries}
              getOptionLabel={(option) => option.name}
              value={countries.find((c) => c.id.toString() === selectedCountry) || null}
              onChange={(event, newValue) => {
                const value = newValue ? newValue.id.toString() : '';
                setSelectedCountry(value);
                setValue('country_id', value);
                setValue('state_id', '');
                setValue('city_id', '');
                setSelectedState('');
                setStates([]);
                setCities([]);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('accountPage.selectCountry')}
                  helperText={`${t('accountPage.selectCountry')} (Optional - for display only)`}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
              disabled={isSubmitting || loadingCountries}
            />

            <Autocomplete
              fullWidth
              options={states}
              getOptionLabel={(option) => option.name}
              value={states.find((s) => s.id.toString() === selectedState) || null}
              onChange={(event, newValue) => {
                const value = newValue ? newValue.id.toString() : '';
                setSelectedState(value);
                setValue('state_id', value);
                setValue('city_id', '');
                setCities([]);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('accountPage.selectState')}
                  helperText={`${t('accountPage.selectState')} (Optional - for display only)`}
                />
              )}
              disabled={isSubmitting || loadingStates || !selectedCountry}
            />

            <Autocomplete
              fullWidth
              options={cities}
              getOptionLabel={(option) => option.name}
              value={
                cities.find((c) => c.id.toString() === (methods.watch('city_id') || '')) || null
              }
              onChange={(event, newValue) => {
                setValue('city_id', newValue ? newValue.id.toString() : '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('accountPage.selectCity')}
                  helperText={`${t('accountPage.selectCity')} (Optional - for display only)`}
                />
              )}
              disabled={isSubmitting || loadingCities || !selectedState}
            />

            <TextField
              {...register('post_code')}
              fullWidth
              label={t('accountPage.postCode')}
              error={!!errors.post_code}
              helperText={errors.post_code?.message}
              disabled={isSubmitting}
            />

            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <TextField
                {...register('latitude')}
                fullWidth
                label={t('accountPage.latitude')}
                type="number"
                inputProps={{ step: 'any' }}
                error={!!errors.latitude}
                helperText={errors.latitude?.message}
                disabled={isSubmitting}
              />

              <TextField
                {...register('longitude')}
                fullWidth
                label={t('accountPage.longitude')}
                type="number"
                inputProps={{ step: 'any' }}
                error={!!errors.longitude}
                helperText={errors.longitude?.message}
                disabled={isSubmitting}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting} color="inherit">
            {t('common.cancel')}
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('accountPage.addAddress')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
