import { z as zod } from 'zod';
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useLocation } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import {useTranslate} from "../../locales";
import { updatePassword, requestPasswordReset } from "../../auth/context/jwt";



interface LocationState {
  email?: string;
}

export function CenteredUpdatePasswordView() {
  const { t } = useTranslate();

  // ----------------------------------------------------------------------
   type UpdatePasswordSchemaType = zod.infer<typeof UpdatePasswordSchema>;
   const UpdatePasswordSchema = zod
    .object({
      code: zod
        .string()
        .min(1, {
          message: t('auth.authValidation.codeRequired')
        })
        .min(6, {
          message: t('auth.authValidation.codeLength')
        }),
      email: zod
        .string()
        .min(1, {
          message: t('auth.authValidation.emailRequired')
        })
        .email({
          message: t('auth.authValidation.emailInvalid')
        }),
      password: zod
        .string()
        .min(1, {
          message: t('auth.authValidation.passwordRequired')
        })
        .min(6, {
          message: t('auth.authValidation.passwordMinLength')
        }),
      confirmPassword: zod
        .string()
        .min(1, {
          message: t('auth.authValidation.confirmPasswordRequired')
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.authValidation.confirmPasswordMatch'),
      path: ['confirmPassword'],
    });
  // ----------------------------------------------------------------------


  const password = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();
  const location = useLocation();

  const { email } = (location.state as LocationState) || {};

  const defaultValues = {
    code: '',
    email: email || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    getValues,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const res = await updatePassword({
        email: data.email,
        token: data.code,
        password: data.password,
        password_confirmation: data.confirmPassword
      });
      setSuccessMsg(res.msg);
      reset(); // Reset all fields after successful submission
      setTimeout(() => {
        router.push(paths.auth.signIn);
      }, 2000);
    } catch (error) {
      setSuccessMsg('');
      setErrorMsg(error.msg || 'Failed to update password');
      console.error(error);
    }
  });

  const handleResendCode = async () => {
    try {
      const currentEmail = getValues('email');
      if (!currentEmail) {
        throw new Error('Email is required to resend code');
      }
      setErrorMsg('');
      const res = await requestPasswordReset({ email: currentEmail });
      setSuccessMsg(res.msg);
    } catch (error) {
      setSuccessMsg('');
      setErrorMsg(error.msg || 'Failed to resend code');
    }
  };

  const renderHead = (
    <>
      <SentIcon sx={{ mx: 'auto' }} />
      <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center', whiteSpace: 'pre-line' }}>
        <Typography variant="h5">
          {t('auth.requestSentSuccessfully')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('auth.requestSentSuccessfullyMessage')}
        </Typography>
      </Stack>
    </>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label={t('auth.email')}
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        disabled={!!email} // Convert to boolean
      />

      <Field.Code name="code" />

      <Field.Text
        name="password"
        label={t('auth.password')}
        placeholder="6+ characters"
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
        name="confirmPassword"
        label={t('auth.confirmPassword')}
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        placeholder={t('auth.confirmPassword')}
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
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Update password..."
      >
        {t('auth.updatePassword')}
      </LoadingButton>

      <Typography variant="body2" sx={{ mx: 'auto' }}>
        {t('auth.dontHaveCode')}{' '}
        <Link variant="subtitle2" sx={{ cursor: 'pointer' }} onClick={handleResendCode}>
          {t('auth.resendCode')}
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={paths.auth.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{ mx: 'auto', alignItems: 'center', display: 'inline-flex' }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} sx={{ mr: 0.5 }} />
        {t('auth.backToSignIn')}
      </Link>
    </Stack>
  );

  return (
    <>
      {renderHead}
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      {!!successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
