import Grid from '@mui/material/Grid';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { InvestorTotalBalance } from 'src/sections/investor/overview/investor-total-balance';
import { InvestorTotalProfits } from 'src/sections/investor/overview/investor-total-profits';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

import { AccountGeneral } from '../account-general';

// ----------------------------------------------------------------------

export function AccountView() {
  const { user } = useAuthContext();

  const { t } = useTranslate();
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('accountPage.title')}
        links={[
          { name: t('accountPage.dashboard'), href: paths.dashboard.root },
          { name: t('accountPage.user') },
          { name: t('accountPage.profile') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <AccountGeneral />

      <RoleBasedGuard acceptRoles={['investor']} sx={{ mb: 5, mt: 10 }} currentRole={user?.type}>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={6}>
            <InvestorTotalBalance />
          </Grid>
          <Grid item xs={6}>
            <InvestorTotalProfits />
          </Grid>
        </Grid>
      </RoleBasedGuard>
    </DashboardContent>
  );
}
