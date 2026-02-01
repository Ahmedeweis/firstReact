import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { InvestorTransaction } from '../investor-transaction';
import { InvestorTotalBalance } from '../investor-total-balance';
import { InvestorTotalProfits } from '../investor-total-profits';
import { InvestorRequestProfitsSection } from '../investor-request-profits-section';

// ----------------------------------------------------------------------

export function OverviewInvestorView() {
  const { t } = useTranslate();

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 4 }}>
        {t('investor.dashboard.dashboardOverview.title')}
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <InvestorTotalBalance />
        </Grid>

        <Grid xs={12} md={6}>
          <InvestorTotalProfits />
        </Grid>

        <Grid xs={12}>
          <InvestorTransaction />
        </Grid>
        <Grid xs={12}>
          <InvestorRequestProfitsSection />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
