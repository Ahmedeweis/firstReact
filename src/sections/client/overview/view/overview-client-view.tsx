import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { ClientOrderStats } from '../client-order-stats';
import { ClientTotalSpent } from '../client-total-spent';
import { ClientRecentOrders } from '../client-recent-orders';
import { ClientQuickActions } from '../client-quick-actions';
import { ClientCartSummary } from '../client-cart-summary';

// ----------------------------------------------------------------------

export function OverviewClientView() {
  const { t } = useTranslate();

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 4 }}>
        {t('client.dashboard.dashboardOverview.title')}
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid xs={12} md={6} lg={3}>
          <ClientOrderStats />
        </Grid>

        <Grid xs={12} md={6} lg={3}>
          <ClientTotalSpent />
        </Grid>

        <Grid xs={12} md={6} lg={3}>
          <ClientCartSummary />
        </Grid>

        <Grid xs={12} md={6} lg={3}>
          <ClientQuickActions />
        </Grid>

        {/* Recent Orders */}
        <Grid xs={12}>
          <ClientRecentOrders />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}




