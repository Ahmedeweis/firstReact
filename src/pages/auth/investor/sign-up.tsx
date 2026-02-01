import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { CenteredSignUpInvestorView } from 'src/sections/auth/investor/centered-sign-up-Investor-view';

// ----------------------------------------------------------------------



export default function Page() {
  const { t } = useTranslate();
  return (
    <>
      <Helmet>
        <title>
          {' '}
          {t('auth.signUpInvestorTitle')} - {CONFIG.site.name}
        </title>
      </Helmet>

      <CenteredSignUpInvestorView />
    </>
  );
}
