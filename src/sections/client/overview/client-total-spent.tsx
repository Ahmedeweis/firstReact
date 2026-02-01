import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paper, varAlpha } from 'src/theme/styles';

import { useGetClientOrders } from 'src/actions/client/overview';
import { useFormatPrice } from 'src/utils/format-price';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ClientTotalSpent() {
  const { t } = useTranslate();
  const { orders, ordersLoading } = useGetClientOrders();
  const { format } = useFormatPrice();

  const totalSpent = useMemo(() => {
    if (!orders || orders.length === 0) return 0;

    return orders
      .filter((order: any) => order.status === 'completed')
      .reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0);
  }, [orders]);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.vars.palette.success.main} 0%, ${theme.vars.palette.success.dark} 100%)`,
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
          <Iconify icon="solar:wallet-money-bold" width={32} />
        </Box>

        <Typography variant="h3" sx={{ mb: 0.5 }}>
          {ordersLoading ? '...' : format(totalSpent)}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
          {t('client.dashboard.totalSpent.title')}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 'auto' }}>
          <Iconify icon="solar:chart-2-bold" width={20} />
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {t('client.dashboard.totalSpent.subtitle')}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

