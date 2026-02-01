import type { IOrderItem } from 'src/types/order';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';

import { OrderShipDialog } from '../order-ship-dialog';
import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderPaymentDialog } from '../order-payment-dialog';
import { OrderDetailsHistory } from '../order-details-history';
import { OrderDetailsToolbar } from '../order-details-toolbar';

// ----------------------------------------------------------------------

// Helper to get product media URL
const getProductCover = (product: any) => {
  const media = product?.media?.[0]?.file_url;
  if (media && media.trim() !== '') {
    return media.startsWith('http')
      ? media
      : `https://retail-international-network-api.smartleadtech.com/${media}`;
  }
  return '/assets/placeholder.svg';
};

// Transform API data to match the expected format
const transformOrderData = (apiOrder: any): IOrderItem => ({
  id: apiOrder.id.toString(),
  orderNumber: `#${apiOrder.id.toString().padStart(6, '0')}`,
  status: apiOrder.status,
  totalAmount: parseFloat(apiOrder.total),
  subtotal: parseFloat(apiOrder.total),
  totalQuantity: apiOrder.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
  taxes: 0,
  shipping: 0,
  discount: 0,
  createdAt: apiOrder.created_at,
  customer: {
    id: apiOrder.client.id.toString(),
    name: apiOrder.client.name,
    email: apiOrder.client.email,
    avatarUrl: '',
    ipAddress: '',
  },
  items: apiOrder.items.map((item: any) => ({
    id: item.id.toString(),
    name: item.product.name,
    sku: item.product.sku,
    price: parseFloat(item.price),
    quantity: item.quantity,
    coverUrl: getProductCover(item.product),
  })),
  payment: {
    cardType: apiOrder.payment_method,
    cardNumber: apiOrder.payment?.card_number || apiOrder.payment_method_id ? '****' : '',
    paymentMethod: apiOrder.payment_method,
    paymentMethodId: apiOrder.payment_method_id,
    paymentStatus: apiOrder.payment?.status,
  },
  delivery: {
    shipBy: apiOrder.shipping_method,
    speedy: '',
    trackingNumber: apiOrder.shipment?.tracking_number || '',
  },
  shippingAddress: {
    fullAddress: `${apiOrder.shipping_address.address}, ${apiOrder.shipping_address.city}, ${apiOrder.shipping_address.state}, ${apiOrder.shipping_address.country} ${apiOrder.shipping_address.zip}`,
    phoneNumber: '',
  },
  history: {
    orderTime: apiOrder.created_at,
    paymentTime: apiOrder.created_at,
    deliveryTime: apiOrder.created_at,
    completionTime: apiOrder.created_at,
    timeline: [],
  },
});

type Props = {
  order?: IOrderItem;
};

export function OrderDetailsView({ order: initialOrder }: Props) {
  const { t } = useTranslate();
  const params = useParams();
  const { id } = params;

  const [order, setOrder] = useState<IOrderItem | undefined>(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const [status, setStatus] = useState(order?.status);
  const [shipDialogOpen, setShipDialogOpen] = useState(false);
  const [isShipping, setIsShipping] = useState(false);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Fetch order details if not provided
  useEffect(() => {
    if (!initialOrder && id) {
      const fetchOrderDetails = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(endpoints.order.details(id));

          if (response.data.success && response.data.data) {
            const transformedData = transformOrderData(response.data.data);
            setOrder(transformedData);
            setStatus(transformedData.status);
          } else {
            toast.error(t('orderDetails.failedToLoad'));
          }
        } catch (error) {
          console.error('Error fetching order details:', error);
          toast.error(t('orderDetails.failedToLoad'));
        } finally {
          setLoading(false);
        }
      };

      fetchOrderDetails();
    }
  }, [id, initialOrder]);

  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  const handleOpenShipDialog = useCallback(() => {
    setShipDialogOpen(true);
  }, []);

  const handleCloseShipDialog = useCallback(() => {
    setShipDialogOpen(false);
  }, []);

  const handleShipOrder = useCallback(
    async (shippingMethod: string) => {
      if (!id) return;

      try {
        setIsShipping(true);
        const response = await axiosInstance.post(
          endpoints.order.ship(id),
          { shipping_method: shippingMethod },
          {
            headers: {
              'Accept-Language': localStorage.getItem('i18nextLng'),
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('jwt_access_token')}`,
            },
          }
        );

        if (response.data.success) {
          toast.success(t('order.list.orderShippedSuccessfully'));

          // Update order with the new data
          const updatedOrder = transformOrderData(response.data.data);
          setOrder(updatedOrder);
          setStatus(updatedOrder.status);

          handleCloseShipDialog();
        }
      } catch (error: any) {
        console.error('Error shipping order:', error);
        toast.error(error?.msg || t('order.list.failedToShip'));
      } finally {
        setIsShipping(false);
      }
    },
    [id, handleCloseShipDialog]
  );

  const handleOpenPayDialog = useCallback(() => {
    setPayDialogOpen(true);
  }, []);

  const handleClosePayDialog = useCallback(() => {
    setPayDialogOpen(false);
  }, []);

  const handlePayOrder = useCallback(
    async (paymentMethod: string, paymentMethodId?: number) => {
      if (!id) return;

      try {
        setIsPaying(true);
        const payload: any = { payment_method: paymentMethod };
        if (paymentMethodId) {
          payload.payment_method_id = paymentMethodId;
        }

        const response = await axiosInstance.post(endpoints.order.pay(id), payload, {
          headers: {
            'Accept-Language': localStorage.getItem('i18nextLng'),
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('jwt_access_token')}`,
          },
        });

        if (response.data.success) {
          toast.success(t('order.list.orderPaidSuccessfully'));

          // Update order with the new data
          const updatedOrder = transformOrderData(response.data.data);
          setOrder(updatedOrder);
          setStatus(updatedOrder.status);

          handleClosePayDialog();
        }
      } catch (error: any) {
        console.error('Error paying order:', error);
        toast.error(error?.msg || t('order.list.failedToPay'));
      } finally {
        setIsPaying(false);
      }
    },
    [id, handleClosePayDialog]
  );

  if (loading) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!order) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          {t('orderDetails.notFound')}
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={order?.orderNumber}
        createdAt={order?.createdAt}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
        onPayOrder={handleOpenPayDialog}
        isPaying={isPaying}
        onShipOrder={handleOpenShipDialog}
        isShipping={isShipping}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={order?.items}
              taxes={order?.taxes}
              shipping={order?.shipping}
              discount={order?.discount}
              subtotal={order?.subtotal}
              totalAmount={order?.totalAmount}
            />

            <OrderDetailsHistory history={order?.history} />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            customer={order?.customer}
            delivery={order?.delivery}
            payment={order?.payment}
            shippingAddress={order?.shippingAddress}
          />
        </Grid>
      </Grid>

      <OrderPaymentDialog
        open={payDialogOpen}
        order={order}
        onClose={handleClosePayDialog}
        onPay={handlePayOrder}
        isPaying={isPaying}
      />

      <OrderShipDialog
        open={shipDialogOpen}
        order={order}
        onClose={handleCloseShipDialog}
        onShip={handleShipOrder}
        isShipping={isShipping}
      />
    </DashboardContent>
  );
}
