import type { IUserProfile } from 'src/types/user-profile';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Skeleton, TextField } from '@mui/material';

import { fData } from 'src/utils/format-number';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { uploadAvatar } from 'src/auth/context/jwt';

import { AccountAddAddressDialog } from './account-add-address-dialog';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  photoURL: schemaHelper.file({ message: { required_error: 'Avatar is required!' } }),
  isPublic: zod.boolean(),
});

export function AccountGeneral() {
  const { user: authUser, setUser } = useAuthContext();
  const [profileData, setProfileData] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [addAddressOpen, setAddAddressOpen] = useState(false);

  const { t } = useTranslate();

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(endpoints.auth.me);
      setProfileData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenAddAddress = () => {
    setAddAddressOpen(true);
  };

  const handleCloseAddAddress = () => {
    setAddAddressOpen(false);
  };

  const handleAddressAdded = () => {
    toast.success(t('accountPage.addressAddedSuccess'));
    fetchProfile(); // Refresh profile data to show new address
  };

  const user = profileData || authUser;

  const defaultValues = {
    photoURL: user?.avatar || null,
    isPublic: false,
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const file = data.photoURL;

      if (!(file instanceof File)) {
        toast.error(t('accountPage.noValidSelected'));
        return;
      }

      // Upload avatar using the /auth/user/upload-avatar endpoint
      const response = await uploadAvatar({ avatar: file });

      // Update auth context with the new user data from response
      if (setUser && response.data) {
        setUser({
          ...authUser,
          ...response.data,
        });
      }

      // Refresh profile data to get complete user info
      const profileResponse = await axiosInstance.get(endpoints.auth.me);
      setProfileData(profileResponse.data.data);

      toast.success(t('accountPage.avatarUploadSuccess'));
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.msg || error?.message || 'Failed to upload avatar';
      toast.error(errorMessage);
    }
  });

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Skeleton variant="circular" width={144} height={144} sx={{ mx: 'auto' }} />
            <Skeleton variant="text" sx={{ mt: 3 }} />
            <Skeleton variant="rectangular" height={36} sx={{ mt: 2 }} />
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={300} />
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="photoURL"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(2048)}
                </Typography>
              }
            />

            <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
              {t('accountPage.avatarUpload')}
            </LoadingButton>
          </Card>
        </Form>
      </Grid>

      <Grid xs={12} md={8}>
        <Card sx={{ p: 3, mb: 6 }}>
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">{t('accountPage.status')}:</Typography>
              <Label
                variant="soft"
                color={
                  (user?.status === 'active' && 'success') ||
                  (user?.status === 'pending' && 'warning') ||
                  (user?.status === 'banned' && 'error') ||
                  'default'
                }
              >
                {t(`accountPage.statusValues.${user?.status}`)}
              </Label>
            </Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">{t('accountPage.type')}:</Typography>
              <Typography
                variant="body2"
                sx={{
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color:
                    user?.type === 'client'
                      ? 'success.main'
                      : user?.type === 'vendor'
                        ? 'info.main'
                        : 'warning.main',
                }}
              >
                {t(`accountPage.typeValues.${user?.type}`)}
              </Typography>
            </Box>
          </Box>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <TextField
              name="name"
              value={user?.name || t('accountPage.noData')}
              label={t('accountPage.name')}
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              name="last_name"
              value={user?.last_name || t('accountPage.noData')}
              label={t('accountPage.lastName')}
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              name="email"
              value={user?.email || t('accountPage.noData')}
              label={t('accountPage.email')}
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              name="phoneNumber"
              value={user?.phone || t('accountPage.noData')}
              label={t('accountPage.phoneNumber')}
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              name="country"
              value={user?.country?.name || t('accountPage.noData')}
              label={t('accountPage.country')}
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              name="nationality"
              value={user?.nationality?.nationality || t('accountPage.noData')}
              label={t('accountPage.nationality')}
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              name="currency"
              value={user?.currency?.currency_name || t('accountPage.noData')}
              label={t('accountPage.currency')}
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              name="gender"
              value={user?.gender || t('accountPage.noData')}
              label={t('accountPage.gender')}
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              name="national_id"
              value={user?.national_id || t('accountPage.noData')}
              label={t('accountPage.nationalId')}
              InputLabelProps={{ shrink: true }}
              disabled
            />
            <TextField
              name="birth_date"
              value={user?.birth_date || t('accountPage.noData')}
              label={t('accountPage.birthDate')}
              InputLabelProps={{ shrink: true }}
              disabled
            />
          </Box>
        </Card>

        {/* Addresses Section */}
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6">{t('accountPage.addresses')}</Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenAddAddress}
            >
              {t('accountPage.addAddress')}
            </Button>
          </Box>

          {user?.addresses && user.addresses.length > 0 ? (
            user.addresses.map((address: any, index: number) => (
              <Box
                key={address.id}
                sx={{
                  mb: index < user.addresses.length - 1 ? 3 : 0,
                  pb: index < user.addresses.length - 1 ? 3 : 0,
                  borderBottom: index < user.addresses.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {t('accountPage.addressNumber', { number: index + 1 })}
                </Typography>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <TextField
                    name={`address_${index}`}
                    value={address.address}
                    label={t('accountPage.address')}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    fullWidth
                    sx={{ gridColumn: { sm: 'span 2' } }}
                  />
                  <TextField
                    name={`post_code_${index}`}
                    value={address.post_code}
                    label={t('accountPage.postCode')}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                  <TextField
                    name={`latitude_${index}`}
                    value={address.latitude}
                    label={t('accountPage.latitude')}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                  <TextField
                    name={`longitude_${index}`}
                    value={address.longitude}
                    label={t('accountPage.longitude')}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('accountPage.noData')}
            </Typography>
          )}
        </Card>
      </Grid>

      {/* Add Address Dialog */}
      <AccountAddAddressDialog
        open={addAddressOpen}
        onClose={handleCloseAddAddress}
        onAddressAdded={handleAddressAdded}
      />
    </Grid>
  );
}
