import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetPaymentMethods } from 'src/actions/client/payment-methods';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ClientQuickActions() {
  const { t } = useTranslate();
  const router = useRouter();
  const { paymentMethods } = useGetPaymentMethods();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.vars.palette.info.main} 0%, ${theme.vars.palette.info.dark} 100%)`,
        color: 'common.white',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Iconify icon="solar:card-bold" width={32} />
        </Box>

        <Typography variant="h3" sx={{ mb: 0.5 }}>
          {paymentMethods.length}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
          {t('client.dashboard.quickActions.paymentMethods')}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={() => router.push(paths.dashboard.client.paymentMethods)}
          sx={{
            mt: 'auto',
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'common.white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.3)',
            },
          }}
          startIcon={<Iconify icon="solar:add-circle-bold" />}
        >
          {t('client.dashboard.quickActions.manageCards')}
        </Button>
      </CardContent>
    </Card>
  );
}

