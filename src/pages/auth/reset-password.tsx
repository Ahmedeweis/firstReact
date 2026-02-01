import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { CenteredResetPasswordView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useTranslate();
  return (
    <>
      <Helmet>
        <title>
          {' '}
          {t('auth.resetPasswordTitle')} - {CONFIG.site.name}
        </title>
      </Helmet>

      <CenteredResetPasswordView />
    </>
  );
}
