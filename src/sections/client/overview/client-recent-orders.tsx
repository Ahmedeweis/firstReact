import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetClientOrders } from 'src/actions/client/overview';
import { useFormatPrice } from 'src/utils/format-price';

import { Label } from 'src/components/label';
import { useTranslate } from 'src/locales';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    case 'processing':
      return 'info';
    default:
      return 'default';
  }
};

export function ClientRecentOrders() {
  const { t } = useTranslate();
  const router = useRouter();
  const { orders, ordersLoading } = useGetClientOrders();
  const { format } = useFormatPrice();

  const getStatusLabel = (status: string) => {
    const statusKey = status.toLowerCase();
    return t(`client.dashboard.recentOrders.statusValues.${statusKey}`, status);
  };

  const recentOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    return orders
      .slice()
      .sort((a: any, b: any) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [orders]);

  if (ordersLoading) {
    return (
      <Card>
        <CardHeader title={t('client.dashboard.recentOrders.title')} />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>{t('client.dashboard.recentOrders.loadingOrders')}</Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={t('client.dashboard.recentOrders.title')}
        action={
          <Button
            size="small"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            onClick={() => router.push(paths.dashboard.order.root)}
          >
            {t('client.dashboard.recentOrders.viewAll')}
          </Button>
        }
      />

      {recentOrders.length === 0 ? (
        <Box sx={{ p: 3 }}>
          <EmptyContent
            title={t('client.dashboard.recentOrders.noOrders')}
            description={t('client.dashboard.recentOrders.noOrdersDescription')}
            action={
              <Button
                variant="contained"
                startIcon={<Iconify icon="solar:cart-plus-bold" />}
                onClick={() => router.push(paths.dashboard.product.shop)}
              >
                {t('client.dashboard.recentOrders.browseProducts')}
              </Button>
            }
          />
        </Box>
      ) : (
        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('client.dashboard.recentOrders.orderId')}</TableCell>
                  <TableCell>{t('client.dashboard.recentOrders.date')}</TableCell>
                  <TableCell align="right">{t('client.dashboard.recentOrders.items')}</TableCell>
                  <TableCell align="right">{t('client.dashboard.recentOrders.total')}</TableCell>
                  <TableCell>{t('client.dashboard.recentOrders.status')}</TableCell>
                  <TableCell align="right">{t('client.dashboard.recentOrders.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order: any) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Link
                        component="button"
                        variant="subtitle2"
                        onClick={() => router.push(paths.dashboard.order.details(order.id.toString()))}
                        sx={{ cursor: 'pointer' }}
                      >
                        #{order.id.toString().padStart(6, '0')}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell align="right">
                      {order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">{format(parseFloat(order.total || 0))}</Typography>
                    </TableCell>
                    <TableCell>
                      <Label color={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Label>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('client.dashboard.recentOrders.viewDetails')}>
                        <Button
                          size="small"
                          variant="soft"
                          onClick={() => router.push(paths.dashboard.order.details(order.id.toString()))}
                        >
                          <Iconify icon="solar:eye-bold" />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      )}
    </Card>
  );
}




