import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { OverviewInvestorView } from 'src/sections/investor/overview/view';
import { OverviewVendorView } from 'src/sections/vendor/overview/view';
import { OverviewClientView } from 'src/sections/client/overview';

import { useAuthContext } from 'src/auth/hooks';

import { BlankView } from '../../sections/blank/view';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  const { user } = useAuthContext();

  const { t } = useTranslate();

  return (
    <>
      {user?.type === 'vendor' && (
        <>
          <Helmet>
            <title>{`${t('vendor.dashboard.dashboardOverview.title')} ${CONFIG.site.name}`} </title>
          </Helmet>

          <OverviewVendorView />
        </>
      )}
      {user?.type === 'client' && (
        <>
          <Helmet>
            <title>{`${t('client.dashboard.dashboardOverview.title')} ${CONFIG.site.name}`} </title>
          </Helmet>

          <OverviewClientView />
        </>
      )}
      {user?.type === 'investor' && (
        <>
          <Helmet>
            <title>
              {`${t('investor.dashboard.dashboardOverview.title')} ${CONFIG.site.name}`}{' '}
            </title>
          </Helmet>

          <OverviewInvestorView />
        </>
      )}
    </>
  );
}
