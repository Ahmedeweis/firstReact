import type { IAddressItem } from 'src/types/common';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export type NewAddressSchemaType = zod.infer<typeof NewAddressSchema>;

export const NewAddressSchema = zod.object({
  city: zod.string().min(1, { message: 'City is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull<string | null>({
    message: { required_error: 'Country is required!' },
  }),
  latitude: zod.string().optional(),
  longitude: zod.string().optional(),
  // Not required
  primary: zod.boolean(),
  addressType: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (address: IAddressItem) => void;
};

export function AddressNewForm({ open, onClose, onCreate }: Props) {
  const defaultValues = {
    name: '',
    city: '',
    state: '',
    address: '',
    zipCode: '',
    country: '',
    latitude: '',
    longitude: '',
    primary: true,
    phoneNumber: '',
    addressType: 'Home',
  };

  const methods = useForm<NewAddressSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewAddressSchema),
    defaultValues,
  });

  const { t } = useTranslate();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      onCreate({
        name: data.name,
        phoneNumber: data.phoneNumber,
        fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
        addressType: data.addressType,
        primary: data.primary,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{t('address.title')}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Field.RadioGroup
              row
              name="addressType"
              options={[
                { label: t('address.home'), value: 'Home' },
                { label: t('address.office'), value: 'Office' },
              ]}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="name" label={t('address.name')} />

              <Field.Phone name="phoneNumber" label={t('address.phone')} />
            </Box>

            <Field.Text name="address" label={t('address.address')} />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
            >

              <Field.Text name="city" label={t('address.city')} />

              <Field.Text name="state" label={t('address.state')} />

              <Field.Text name="zipCode" label={t('address.zipCode')} />
            </Box>

            <Field.CountrySelect
              name="country"
              label={t('address.country')}
              placeholder={t('address.chooseCountry')}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="latitude" label={t('address.latitude')} />

              <Field.Text name="longitude" label={t('address.longitude')} />
            </Box>

            <Field.Checkbox name="primary" label={t('address.default')} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            {t('address.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('address.deliver')}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
