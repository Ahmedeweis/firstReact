import { z as zod } from 'zod';
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useLocation } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import {useTranslate} from "../../locales";
import { verifyEmail, resendVerificationEmail } from "../../auth/context/jwt";


interface LocationState {
  email?: string;
}

export function CenteredVerifyView() {
  const { t } = useTranslate();

  // ----------------------------------------------------------------------
   type VerifySchemaType = zod.infer<typeof VerifySchema>;

   const VerifySchema = zod.object({
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
  });
// ----------------------------------------------------------------------

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const location = useLocation();
  const router = useRouter();

  const { email } = (location.state as LocationState) || {};

  const methods = useForm<VerifySchemaType>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: '',
      email: email || '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      const res = await verifyEmail({ email: data.email, token: data.code });
      setSuccessMsg(res.msg);
      setTimeout(() => {
        router.push(paths.auth.signIn);
      }, 2000);
    } catch (error) {
      setSuccessMsg('');
      setErrorMsg(error.msg || 'An error occurred during verification');
      console.error(error);
    }
  });

  const handleResendVerificationEmail = async () => {
    try {
      const currentEmail = getValues('email');
      if (!currentEmail) {
        throw new Error('Email is required to resend verification');
      }
      setErrorMsg('');
      const res = await resendVerificationEmail({ email: currentEmail });
      setSuccessMsg(res.msg);
    } catch (error) {
      setSuccessMsg('');
      setErrorMsg(error.msg || 'Failed to resend verification email');
    }
  };

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ mx: 'auto' }} />
      <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center', whiteSpace: 'pre-line' }}>
        <Typography variant="h5">
          {t('auth.checkEmail')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('auth.checkEmailMessage')}
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
        disabled={!!email} // Convert to boolean
        InputLabelProps={{ shrink: true }}
      />

      <Field.Code name="code" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Verify..."
      >
        {t('auth.verify')}
      </LoadingButton>

      <Typography variant="body2" sx={{ mx: 'auto' }}>
        {t('auth.dontHaveCode')}{' '}
        <Link
          variant="subtitle2"
          sx={{ cursor: 'pointer' }}
          onClick={handleResendVerificationEmail}
        >
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
