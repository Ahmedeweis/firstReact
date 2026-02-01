import type { ICountriesItem } from 'src/types/core';

import useSWR from 'swr';
import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fetcher, endpoints } from 'src/utils/axios';

// import { fDate } from 'src/utils/format-time';
import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { AnimateLogo2 } from 'src/components/animate';
import { Form, Field } from 'src/components/hook-form';

import { signUp } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

type CountriesData = {
  data: ICountriesItem[];
  msg: string;
  success: boolean;
};

export function CenteredSignUpClientView() {
  const { t } = useTranslate();
  const [errorMsg, setErrorMsg] = useState('');

  const optionSchema = zod.object({
    label: zod.string().min(1, { message: 'Label is required!' }),
    value: zod.union([zod.number(), zod.string()], { message: 'Value must be valid!' }),
  });

  // ✅ Schema with confirm password validation
  const SignUpClientSchema = zod
    .object({
      name: zod.string().min(1, { message: t('auth.authValidation.firstNameRequired') }),
      lastName: zod.string().min(1, { message: t('auth.authValidation.lastNameRequired') }),
      email: zod
        .string()
        .min(1, { message: t('auth.authValidation.emailRequired') })
        .email({ message: t('auth.authValidation.emailInvalid') }),
      password: zod.string().min(6, { message: t('auth.authValidation.passwordMinLength') }),
      password_confirmation: zod
        .string()
        .min(1, { message: t('auth.authValidation.confirmPasswordRequired') }),
      national_id: zod
        .string()
        .min(1, { message: t('auth.authValidation.nationalIdRequired') })
        .regex(/^\d+$/, { message: t('auth.authValidation.nationalIdInvalid') }),
      phone: zod
        .string()
        .min(1, { message: t('auth.authValidation.phoneNumberRequired') })
        .regex(/^\+?\d+$/, { message: t('auth.authValidation.phoneNumberInvalid') }),
      country_id: optionSchema,
      nationality_id: optionSchema,
      currency_id: optionSchema,
      birth_date: zod.any().optional(), // Removed validation as requested
      gender: zod.string().min(1, { message: 'Gender is required!' }),
      referral_code: zod.string().optional(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      path: ['password_confirmation'],
      message: t('auth.authValidation.confirmPasswordMatch'),
    });

  const url = `${endpoints.core.countries}?notPaginated=true`;

  const { data, isLoading } = useSWR<CountriesData>(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const COUNTRIESNAMESOPTIONS: { value: string; label: string }[] = [];
  const nationalityNAMESOPTIONS: { value: string; label: string }[] = [];
  const currencyNAMESOPTIONS: { value: string; label: string }[] = [];

  data?.data?.forEach((country) => {
    COUNTRIESNAMESOPTIONS.push({ value: country.id, label: country.name });
    nationalityNAMESOPTIONS.push({ value: country.id, label: country.nationality });
    currencyNAMESOPTIONS.push({
      value: country.id,
      label: `${country.currency_name} (${country.currency_symbol})`,
    });
  });

  const password = useBoolean();
  const navigate = useNavigate();

  const defaultValues = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    password_confirmation: '',
    national_id: '',
    phone: '',
    country_id: { value: '', label: '' },
    nationality_id: { value: '', label: '' },
    currency_id: { value: '', label: '' },
    type: 'client',
    gender: 'male',
    birth_date: null,
    referral_code: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpClientSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setErrorMsg('');
      await signUp({
        ...formData,
        password_confirmation: formData.password_confirmation,
        type: 'client',
        gender: formData.gender,
        country_id: formData.country_id.value,
        nationality_id: formData.nationality_id.value,
        currency_id: formData.currency_id.value,
        // Explicitly include referral_code
        referral_code: formData.referral_code || '',
        birth_date: formData.birth_date ? String(formData.birth_date) : undefined
      });
      navigate(paths.auth.verify, { state: { email: formData.email } });
    } catch (formError) {
      console.error(formError);
      setErrorMsg(formError.msg);
    }
  });

  return (
    <>
      <AnimateLogo2 sx={{ mb: 3, mx: 'auto' }} />

      <Stack alignItems="center" spacing={1.5} sx={{ mb: 5 }}>
        <Typography variant="h5">{t('auth.createAccountClient')}</Typography>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('auth.haveAccount')}
          </Typography>
          <Link component={RouterLink} href={paths.auth.signIn} variant="subtitle2">
            {t('auth.signIn')}
          </Link>
        </Stack>
      </Stack>
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Field.Text
              name="name"
              label={t('auth.firstName')}
              InputLabelProps={{ shrink: true }}
              placeholder={t('auth.placeHolder.firstName')}
            />
            <Field.Text
              name="lastName"
              label={t('auth.lastName')}
              InputLabelProps={{ shrink: true }}
              placeholder={t('auth.placeHolder.lastName')}
            />
          </Stack>

          <Field.Text
            name="national_id"
            label={t('auth.nationalId')}
            InputLabelProps={{ shrink: true }}
            placeholder={t('auth.placeHolder.nationalId')}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Field.Text
              name="email"
              label={t('auth.emailAddress')}
              InputLabelProps={{ shrink: true }}
              placeholder={t('auth.placeHolder.emailAddress')}
            />
            <Field.Text
              name="phone"
              label={t('auth.phoneNumber')}
              InputLabelProps={{ shrink: true }}
              placeholder={t('auth.placeHolder.phoneNumber')}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Field.Select
              name="gender"
              label="Gender"
              placeholder="Select Gender"
              InputLabelProps={{ shrink: true }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Field.Select>
          </Stack>

          {!isLoading && data?.data && (
            <>
              <Field.Autocomplete
                name="country_id"
                label={t('auth.country')}
                options={COUNTRIESNAMESOPTIONS}
                placeholder={t('auth.placeHolder.country')}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />

              <Field.Autocomplete
                name="nationality_id"
                label={t('auth.nationality')}
                placeholder={t('auth.placeHolder.nationality')}
                options={nationalityNAMESOPTIONS}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />

              <Field.Autocomplete
                name="currency_id"
                label={t('auth.currency')}
                placeholder={t('auth.placeHolder.currency')}
                options={currencyNAMESOPTIONS}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />
            </>

          )}

          <Field.Text
            name="referral_code"
            label={t('auth.referralCode') || 'Referral Code'}
            placeholder={t('auth.placeHolder.referralCode') || 'Enter referral code (optional)'}
            InputLabelProps={{ shrink: true }}
          />

          <Field.Text
            name="password"
            label={t('auth.password')}
            placeholder={t('auth.placeHolder.password')}
            type={password.value ? 'text' : 'password'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Field.Text
            name="password_confirmation"
            label={t('auth.confirmPassword')}
            placeholder={t('auth.placeHolder.confirmPassword')}
            type={password.value ? 'text' : 'password'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator={`${t('auth.createAccountButton')}...`}
          >
            {t('auth.createAccountButton')}
          </LoadingButton>
        </Stack>
      </Form >

      <Typography
        component="div"
        sx={{
          mt: 3,
          textAlign: 'center',
          typography: 'caption',
          color: 'text.secondary',
        }}
      >
        {'By signing up, I agree to '}
        <Link underline="always" color="text.primary">
          Terms of service
        </Link>
        {' and '}
        <Link underline="always" color="text.primary">
          Privacy policy
        </Link>
        .
      </Typography>
    </>
  );
}
