import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { CenteredVerifyView } from 'src/sections/auth';

// ----------------------------------------------------------------------



export default function Page() {
   const { t } = useTranslate();
  return (
    <>
      <Helmet>
        <title> {t('auth.verifyTitle')} - {CONFIG.site.name}</title>
      </Helmet>

      <CenteredVerifyView />
    </>
  );
}
