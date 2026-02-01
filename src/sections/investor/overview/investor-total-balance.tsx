import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { useGetInvestorOverview } from 'src/actions/investor/overview';

import { Iconify } from 'src/components/iconify';

import { ChargeDialog } from '../charge';

// ----------------------------------------------------------------------

export function InvestorTotalBalance() {
  const theme = useTheme();
  const chargeDialog = useBoolean();

  const { balance } = useGetInvestorOverview();

  const { t, i18n } = useTranslate();

  const isArabic = i18n.resolvedLanguage === 'ar';

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        gap: { xs: 2, sm: 3 },
        borderRadius: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: { xs: 'center', md: 'left' },
        width: '100%',
        maxWidth: { xs: 320, sm: 480, md: 720 },
        mx: 'auto',
        border: `1px solid ${theme.vars.palette.primary.light}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Typography
          sx={{
            typography: { xs: 'subtitle2', sm: 'h6', md: 'h4' },
            mb: 1,
            whiteSpace: 'pre-line',
          }}
        >
          {t('investor.dashboard.dashboardOverview.totalBalance')}
        </Typography>

        <Typography
          sx={{
            typography: { xs: 'body1', sm: 'h6', md: 'h3' },
            maxWidth: 300,
          }}
        >
          {balance}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={chargeDialog.onTrue}
          sx={{
            mt: { xs: 1, sm: 2 },
            fontSize: { xs: 12, sm: 14, md: 16 },
            px: { xs: 2, sm: 3 },
            py: { xs: 0.5, sm: 1 },
          }}
        >
          {t('investor.dashboard.dashboardOverview.chargeBalance')}{' '}
          <Iconify
            icon={isArabic ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'}
            width={16}
            height={16}
          />
        </Button>
      </Box>

      <Box
        component="img"
        src="/assets/money.png"
        alt={t('investor.dashboard.dashboardOverview.totalBalance')}
        sx={{
          width: { xs: 100, sm: 160, md: 220 },
          height: 'auto',
          mt: { xs: 2, md: 0 },
        }}
      />

      <ChargeDialog
        open={chargeDialog.value}
        onClose={chargeDialog.onFalse}
        onSuccess={() => {
          // Refresh overview data after successful charge
          // This will be handled by the overview hook automatically
        }}
      />
    </Box>
  );
}
