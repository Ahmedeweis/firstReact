import type { ButtonProps } from '@mui/material/Button';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }: ButtonProps) {
  const { t } = useTranslate();

  return (
    <Button
      component={RouterLink}
      href={CONFIG.auth.redirectPath}
      variant="outlined"
      sx={sx}
      {...other}
    >
      {t('auth.signIn')}
    </Button>
  );
}
