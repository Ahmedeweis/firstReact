import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useGetClientOrders } from 'src/actions/client/overview';
import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ClientOrderStats() {
  const { t } = useTranslate();
  const { orders, ordersLoading } = useGetClientOrders();

  const stats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
      };
    }

    return {
      total: orders.length,
      pending: orders.filter((order: any) => order.status === 'pending').length,
      completed: orders.filter((order: any) => order.status === 'completed').length,
      cancelled: orders.filter((order: any) => order.status === 'cancelled').length,
    };
  }, [orders]);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.primary.dark} 100%)`,
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
          <Iconify icon="solar:bag-check-bold" width={32} />
        </Box>

        <Typography variant="h3" sx={{ mb: 0.5 }}>
          {ordersLoading ? '...' : stats.total}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
          {t('client.dashboard.orderStats.totalOrders')}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255,255,255,0.16)' }}>
          <Box>
            <Typography variant="h6">{stats.pending}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {t('client.dashboard.orderStats.pending')}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">{stats.completed}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {t('client.dashboard.orderStats.completed')}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

