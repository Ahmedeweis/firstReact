import { z as zod } from 'zod';
import {useState} from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from "@mui/material/Alert";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { AnimateLogo2 } from 'src/components/animate';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { signInWithPassword } from 'src/auth/context/jwt';

import {useTranslate} from "../../locales";



export function CenteredSignInView() {
  const { t }= useTranslate();

  // ----------------------------------------------------------------------
  type SignInSchemaType = zod.infer<typeof SignInSchema>;
   const SignInSchema = zod.object({
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
  });
  // ----------------------------------------------------------------------

  const password = useBoolean();
  const router = useRouter();
  const { checkUserSession } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = { email: '', password: '' };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });



  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      router.refresh();
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // console.info('DATA', data);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.msg);
    }
  });
  const renderLogo = <AnimateLogo2 sx={{ mb: 3, mx: 'auto' }} />;

  const renderHead = (
    <Stack alignItems="center" spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">{t('auth.signInHeader')}</Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('auth.dontHaveAccount')}
        </Typography>

        <Link component={RouterLink} href="/" variant="subtitle2">
          {t('auth.getStarted')}
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="email" label={t('auth.email')} InputLabelProps={{ shrink: true }} />

      <Stack spacing={1}>
        <Typography variant="body2" sx={{ color: 'text.secondary', alignSelf: 'flex-end' }}>
          <Link
            component={RouterLink}
            href={paths.auth.resetPassword}
          >
            {t('auth.forgotPassword')}
          </Link>
        </Typography>
        <Stack spacing={1.5}>
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
        </Stack>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        {t('auth.signInButton')}
      </LoadingButton>
    </Stack>
  );


  return (
    <>
      {renderLogo}

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
