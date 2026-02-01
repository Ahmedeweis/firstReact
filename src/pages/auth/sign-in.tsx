import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { CenteredSignInView } from 'src/sections/auth';

// ----------------------------------------------------------------------



export default function Page() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title>
          {' '}
          {t('auth.signInTitle')} - {CONFIG.site.name}
        </title>
      </Helmet>

      <CenteredSignInView />
    </>
  );
}
