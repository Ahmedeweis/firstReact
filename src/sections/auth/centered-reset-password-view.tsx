import { z as zod } from 'zod';
import {useState} from "react";
import { useForm } from 'react-hook-form';
import {useNavigate} from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { PasswordIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import {useTranslate} from "../../locales";
import {requestPasswordReset} from "../../auth/context/jwt";


export function CenteredResetPasswordView() {
  const {t} = useTranslate();

  // ----------------------------------------------------------------------
   type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>;
  const ResetPasswordSchema = zod.object({
    email: zod
      .string()
      .min(1, { message: t('auth.authValidation.emailRequired') })
      .email({ message: t('auth.authValidation.emailInvalid') }),
  });
  // ----------------------------------------------------------------------


  const defaultValues = { email: '' };
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();


  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await requestPasswordReset({ email: data.email });
      navigate(paths.auth.updatePassword, { state: { email: data.email } });
    } catch (error) {
      console.error(error);
      setErrorMsg(error.msg);
    }
  });

  const renderHead = (
    <>
      <PasswordIcon sx={{ mx: 'auto' }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center', whiteSpace: 'pre-line' }}>
        <Typography variant="h5">
          {t('auth.forgotPasswordHeader')}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('auth.forgotPasswordMessage')}
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
        autoFocus
        InputLabelProps={{ shrink: true }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Send request..."
      >
        {t('auth.sendRequest')}
      </LoadingButton>

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
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
