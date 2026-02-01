import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { CenteredSignUpClientView } from 'src/sections/auth/client/centered-sign-up-client-view';

// ----------------------------------------------------------------------



export default function Page() {
  const { t } = useTranslate();
  return (
    <>
      <Helmet>
        <title>
          {' '}
          {t('auth.signUpClientTitle')} - {CONFIG.site.name}
        </title>
      </Helmet>

      <CenteredSignUpClientView />
    </>
  );
}
