import Button from "@mui/material/Button";

import { paths } from "src/routes/paths";

import { useBoolean } from "src/hooks/use-boolean";

import { useTranslate } from "src/locales";
import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { InvestorAddContactUs } from "../investor-add-contact-us";
import { InvestorContactMessagesTable } from "../investor-contact-us-table";

export function InvestorContactUsListView(){
  const { t } = useTranslate();

  const confirm = useBoolean();

  console.log(confirm.value)

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('investor.dashboard.contactUsPage.title')}
        links={[
          { name: t('investor.dashboard.contactUsPage.dashboard'), href: paths.dashboard.root },
          { name: t('investor.dashboard.contactUsPage.title') },
        ]}
        action={
          <Button
            onClick={confirm.onTrue}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('investor.dashboard.contactUsPage.title')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <InvestorAddContactUs open={confirm.value} close={confirm.onFalse} />
      <InvestorContactMessagesTable />
    </DashboardContent>
  );
}
