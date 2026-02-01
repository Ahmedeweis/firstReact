import type {
  IOrderPayment,
  IOrderCustomer,
  IOrderDelivery,
  IOrderShippingAddress,
} from 'src/types/order';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  payment?: IOrderPayment;
  customer?: IOrderCustomer;
  delivery?: IOrderDelivery;
  shippingAddress?: IOrderShippingAddress;
};

export function OrderDetailsInfo({ customer, delivery, payment, shippingAddress }: Props) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const isClient = user?.type === 'client';
  const renderCustomer = (
    <>
      <CardHeader
        title={t('orderDetails.customerInfo')}
        action={
          <>
            {!isClient && (
              <IconButton>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            )}
          </>
        }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer?.name}
          src={customer?.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customer?.name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{customer?.email}</Box>

          <div>
            {t('orderDetails.ipAddress')}:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {customer?.ipAddress}
            </Box>
          </div>

          <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 1 }}
          >
            {t('orderDetails.addToBlacklist')}
          </Button>
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader
        title={t('orderDetails.delivery')}
        action={
          <>
            {!isClient && (
              <IconButton>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            )}
          </>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('orderDetails.shipBy')}
          </Box>
          {delivery?.shipBy}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('orderDetails.speedy')}
          </Box>
          {delivery?.speedy}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('orderDetails.trackingNo')}
          </Box>
          <Link underline="always" color="inherit">
            {delivery?.trackingNumber}
          </Link>
        </Stack>
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      <CardHeader
        title={t('orderDetails.shippingAddress')}
        action={
          <>
            {!isClient && (
              <IconButton>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            )}
          </>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('orderDetails.address')}
          </Box>
          {shippingAddress?.fullAddress}
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('orderDetails.phoneNumber')}
          </Box>
          {shippingAddress?.phoneNumber}
        </Stack>
      </Stack>
    </>
  );

  const getPaymentIcon = (method: string) => {
    const methodLower = method?.toLowerCase() || '';
    if (methodLower.includes('visa')) return 'logos:visa';
    if (methodLower.includes('mastercard') || methodLower.includes('master')) return 'logos:mastercard';
    if (methodLower.includes('amex') || methodLower.includes('american')) return 'logos:american-express';
    if (methodLower.includes('paypal')) return 'logos:paypal';
    if (methodLower.includes('bank')) return 'solar:bank-bold';
    return 'solar:card-bold';
  };

  const getPaymentLabel = (method: string) => {
    const methodLower = method?.toLowerCase() || '';
    if (methodLower.includes('visa')) return 'Visa';
    if (methodLower.includes('mastercard') || methodLower.includes('master')) return 'Mastercard';
    if (methodLower.includes('amex') || methodLower.includes('american')) return 'American Express';
    if (methodLower.includes('paypal')) return 'PayPal';
    if (methodLower.includes('bank')) return 'Bank Transfer';
    if (methodLower.includes('cash')) return 'Cash on Delivery';
    if (methodLower.includes('myfatoorah')) return 'MyFatoorah';
    return method || 'N/A';
  };

  const renderPayment = (
    <>
      <CardHeader
        title={t('orderDetails.payment')}
        action={
          <>
            {!isClient && (
              <IconButton>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            )}
          </>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('orderDetails.method')}
          </Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon={getPaymentIcon(payment?.cardType || payment?.paymentMethod || '')} width={24} />
            <Typography variant="body2" fontWeight={500}>
              {getPaymentLabel(payment?.cardType || payment?.paymentMethod || '')}
            </Typography>
          </Stack>
        </Stack>

        {payment?.cardNumber && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
              {t('orderDetails.cardNumber')}
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {payment.cardNumber}
            </Typography>
          </Stack>
        )}

        {payment?.paymentStatus && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
              {t('orderDetails.status')}
            </Box>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{
                color:
                  payment.paymentStatus === 'completed'
                    ? 'success.main'
                    : payment.paymentStatus === 'pending'
                      ? 'warning.main'
                      : 'error.main',
              }}
            >
              {payment.paymentStatus}
            </Typography>
          </Stack>
        )}
      </Stack>
    </>
  );

  return (
    <Card>
      {renderCustomer}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderDelivery}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderPayment}
    </Card>
  );
}
