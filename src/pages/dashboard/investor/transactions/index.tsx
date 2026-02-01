import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { TransactionListView } from 'src/sections/investor/transactions/view/list-view';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';



// ----------------------------------------------------------------------

export default function InvestorTransactionsPage() {
  const { user } = useAuthContext();

  const { t } = useTranslate();

  return (
    <RoleBasedGuard currentRole={user?.type} acceptRoles={['investor']} hasContent>
      <Helmet>
        <title>{`${t('investor.dashboard.transactionsPage.title')} - ${CONFIG.site.name}`} </title>
      </Helmet>

      <TransactionListView/>
    </RoleBasedGuard>
  );
}
