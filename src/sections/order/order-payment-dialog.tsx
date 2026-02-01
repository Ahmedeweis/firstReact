import type { IOrderItem } from 'src/types/order';

import { useState, useMemo } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Paper,
  Dialog,
  Button,
  MenuItem,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

import { useGetPaymentMethods } from 'src/actions/client/payment-methods';
import { useFormatPrice } from 'src/utils/format-price';

import { Iconify } from 'src/components/iconify';
import { useTranslate } from 'src/locales';

type Props = {
  open: boolean;
  order: IOrderItem | null;
  onClose: () => void;
  onPay: (paymentMethod: string, paymentMethodId?: number) => Promise<void>;
  isPaying: boolean;
};

const PAYMENT_METHODS_KEYS = [
  { value: 'cash_on_delivery', labelKey: 'cash_on_delivery', icon: 'solar:money-bag-bold' },
  { value: 'myfatoorah', labelKey: 'myfatoorah', icon: 'solar:card-bold' },
  { value: 'paypal', labelKey: 'paypal', icon: 'logos:paypal' },
  { value: 'bank_transfer', labelKey: 'bank_transfer', icon: 'solar:bank-bold' },
];

export function OrderPaymentDialog({ open, order, onClose, onPay, isPaying }: Props) {
  const { t } = useTranslate();
  const { paymentMethods } = useGetPaymentMethods();
  const { format } = useFormatPrice();
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'other'>('other');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handlePay = async () => {
    if (selectedMethod === 'card' && !selectedCardId) {
      setError(t('orderPayment.selectCardError'));
      return;
    }
    if (selectedMethod === 'other' && !paymentMethod.trim()) {
      setError(t('orderPayment.methodRequiredError'));
      return;
    }

    setError('');
    if (selectedMethod === 'card' && selectedCardId) {
      await onPay('card', selectedCardId);
    } else {
      await onPay(paymentMethod);
    }
  };

  const handleClose = () => {
    if (!isPaying) {
      setSelectedMethod('other');
      setPaymentMethod('cash_on_delivery');
      setSelectedCardId(null);
      setError('');
      onClose();
    }
  };

  const getCardIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'visa':
        return 'logos:visa';
      case 'mastercard':
        return 'logos:mastercard';
      case 'amex':
        return 'logos:american-express';
      default:
        return 'solar:card-bold';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:card-bold" width={24} />
          <Typography variant="h6">{t('orderPayment.title')} {order?.orderNumber}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('orderPayment.customer')}: {order?.customer.name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {t('orderPayment.totalAmount')}: {format(order?.totalAmount || 0)}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {t('orderPayment.currentStatus')}: {order?.status}
              </Typography>
            </Stack>

            {error && (
              <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            {/* Payment Method Selection */}
            <RadioGroup
              value={selectedMethod}
              onChange={(e) => {
                setSelectedMethod(e.target.value as 'card' | 'other');
                setError('');
              }}
            >
              {/* Saved Cards Option */}
              {paymentMethods.length > 0 && (
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:card-bold" width={20} />
                      <Typography variant="body2">{t('orderPayment.useSavedCard')}</Typography>
                    </Stack>
                  }
                  disabled={isPaying}
                />
              )}

              {/* Other Payment Methods */}
              <FormControlLabel
                value="other"
                control={<Radio />}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="solar:wallet-money-bold" width={20} />
                    <Typography variant="body2">{t('orderPayment.otherMethods')}</Typography>
                  </Stack>
                }
                disabled={isPaying}
              />
            </RadioGroup>

            {/* Saved Cards Selection */}
            {selectedMethod === 'card' && paymentMethods.length > 0 && (
              <Stack spacing={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('orderPayment.selectCard')}
                </Typography>
                {paymentMethods.map((card) => (
                  <Paper
                    key={card.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: selectedCardId === card.id ? 2 : 1,
                      borderColor: selectedCardId === card.id ? 'primary.main' : 'divider',
                      bgcolor: selectedCardId === card.id ? 'primary.lighter' : 'background.paper',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                    onClick={() => {
                      setSelectedCardId(card.id);
                      setError('');
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Iconify icon={getCardIcon(card.type)} width={32} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">{card.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {card.card_number} • {t('orderPayment.expires')} {card.expiry}
                        </Typography>
                      </Box>
                      {selectedCardId === card.id && (
                        <Iconify icon="solar:check-circle-bold" width={24} color="primary.main" />
                      )}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}

            {/* Other Payment Methods Selection */}
            {selectedMethod === 'other' && (
              <TextField
                fullWidth
                select
                label={t('orderPayment.paymentMethod')}
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setError('');
                }}
                error={!!error}
                helperText={error || t('orderPayment.helperText')}
                disabled={isPaying}
                required
              >
                {PAYMENT_METHODS_KEYS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon={option.icon} width={20} />
                      <Typography>{t(`orderPayment.methods.${option.labelKey}`)}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            )}

            {paymentMethods.length === 0 && selectedMethod === 'card' && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                {t('orderPayment.noSavedCards')}
              </Typography>
            )}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isPaying}>
          {t('orderPayment.cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={isPaying}
          onClick={handlePay}
          startIcon={<Iconify icon="solar:card-bold" />}
          color="success"
        >
          {t('orderPayment.process')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
