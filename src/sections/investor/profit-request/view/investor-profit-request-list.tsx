import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { InvestorAddProfitRequest } from '../investor-add-profit-request';
import { InvestorProfitRequestTable } from '../investor-profit-request-table';

export function InvestorProfitRequestListView() {
  const { t } = useTranslate();

  const confirm = useBoolean();

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('investor.dashboard.profitRequestPage.title')}
        links={[
          { name: t('investor.dashboard.profitRequestPage.dashboard'), href: paths.dashboard.root },
          { name: t('investor.dashboard.profitRequestPage.title') },
        ]}
        action={
          <Button
            onClick={confirm.onTrue}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('investor.dashboard.profitRequestPage.newRequest')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvestorAddProfitRequest open={confirm.value} close={confirm.onFalse} />
      <InvestorProfitRequestTable />
    </DashboardContent>
  );
}
