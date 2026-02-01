import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { InvestorContactUsListView } from 'src/sections/investor/contact-us/view/Investor-contact-us-list';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function InvestorContactUsPage() {
  const { user } = useAuthContext();

  const { t } = useTranslate();

  return (
    <RoleBasedGuard currentRole={user?.type} acceptRoles={['investor']} hasContent>
      <Helmet>
        <title>{`${t('investor.dashboard.contactUsPage.title')} - ${CONFIG.site.name}`} </title>
      </Helmet>

      <InvestorContactUsListView/>
    </RoleBasedGuard>
  );
}
