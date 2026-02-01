import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { CenteredSignUpVendorView } from 'src/sections/auth/vendor/centered-sign-up-vendor-view';

// ----------------------------------------------------------------------



export default function Page() {
  const { t } = useTranslate();
  return (
    <>
      <Helmet>
        <title>
          {' '}
          {t('auth.signUpVendorTitle')} - {CONFIG.site.name}
        </title>
      </Helmet>

      <CenteredSignUpVendorView />
    </>
  );
}
