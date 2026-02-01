
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { InvestorProfitRequestListView } from 'src/sections/investor/profit-request/view/investor-profit-request-list';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

export default function InvestorProfitRequestsPage() {
  const { user } = useAuthContext();
  const { t } = useTranslate();

  return (
    <RoleBasedGuard currentRole={user?.type} acceptRoles={['investor']} hasContent>
      <Helmet>
        <title>{`${t('investor.dashboard.profitRequestPage.title')} - ${CONFIG.site.name}`}</title>
      </Helmet>

      <InvestorProfitRequestListView />
    </RoleBasedGuard>
  );
}
