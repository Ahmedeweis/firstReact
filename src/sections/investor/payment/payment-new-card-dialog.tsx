import type { DialogProps } from '@mui/material/Dialog';
import type {
  PaymentMethodType,
  CreatePaymentMethodRequest,
} from 'src/types/investor/payment-methods';

import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales/use-locales';
import { createPaymentMethod } from 'src/actions/investor/payment-methods';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  onClose: () => void;
  onSuccess?: () => void;
};

export function PaymentNewCardDialog({ onClose, onSuccess, ...other }: Props) {
  const { t } = useTranslate();
  const [formData, setFormData] = useState({
    type: 'visa' as PaymentMethodType,
    name: '',
    card_number: '',
    expiry: '',
    cvc: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      if (!formData.name.trim()) {
        setError(t('investor.payment.addNewPaymentMethod.validation.nameRequired'));
        return;
      }
      if (!formData.card_number.trim()) {
        setError(t('investor.payment.addNewPaymentMethod.validation.cardNumberRequired'));
        return;
      }
      if (!formData.expiry.trim()) {
        setError(t('investor.payment.addNewPaymentMethod.validation.expiryRequired'));
        return;
      }
      if (!formData.cvc.trim()) {
        setError(t('investor.payment.addNewPaymentMethod.validation.cvcRequired'));
        return;
      }

      const requestData: CreatePaymentMethodRequest = {
        type: formData.type,
        name: formData.name.trim(),
        card_number: formData.card_number.trim(),
        expiry: formData.expiry.trim(),
        cvc: formData.cvc.trim(),
      };

      await createPaymentMethod(requestData);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Fallback: close dialog
        onClose();
      }
    } catch (err: any) {
      console.error('Failed to create payment method:', err);
      setError(err?.message || t('investor.payment.addNewPaymentMethod.errors.general'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog maxWidth="sm" onClose={onClose} {...other}>
      <DialogTitle>{t('investor.payment.addNewPaymentMethod.title')}</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <Stack spacing={2.5}>
          {error && (
            <Typography color="error" variant="body2" sx={{ textAlign: 'center', py: 1 }}>
              {error}
            </Typography>
          )}

          <TextField
            select
            label={t('investor.payment.addNewPaymentMethod.cardType')}
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="visa">{t('investor.payment.types.visa')}</MenuItem>
            <MenuItem value="mastercard">{t('investor.payment.types.mastercard')}</MenuItem>
            <MenuItem value="amex">{t('investor.payment.types.amex')}</MenuItem>
          </TextField>

          <TextField
            autoFocus
            label={t('investor.payment.addNewPaymentMethod.cardHolderName')}
            placeholder={t('investor.payment.addNewPaymentMethod.placeholders.cardHolderName')}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label={t('investor.payment.addNewPaymentMethod.cardNumber')}
            placeholder={t('investor.payment.addNewPaymentMethod.placeholders.cardNumber')}
            value={formData.card_number}
            onChange={(e) => handleInputChange('card_number', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Stack spacing={2} direction="row">
            <TextField
              label={t('investor.payment.addNewPaymentMethod.expirationDate')}
              placeholder={t('investor.payment.addNewPaymentMethod.placeholders.expiry')}
              value={formData.expiry}
              onChange={(e) => handleInputChange('expiry', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label={t('investor.payment.addNewPaymentMethod.cvvCvc')}
              placeholder={t('investor.payment.addNewPaymentMethod.placeholders.cvc')}
              value={formData.cvc}
              onChange={(e) => handleInputChange('cvc', e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      arrow
                      placement="top"
                      title={t('investor.payment.addNewPaymentMethod.tooltips.cvc')}
                      slotProps={{ tooltip: { sx: { maxWidth: 160, textAlign: 'center' } } }}
                    >
                      <Iconify width={18} icon="eva:info-outline" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            sx={{ typography: 'caption', color: 'text.disabled' }}
          >
            <Iconify icon="carbon:locked" sx={{ mr: 0.5 }} />
            {t('investor.payment.addNewPaymentMethod.security')}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={onClose} disabled={isSubmitting}>
          {t('investor.payment.addNewPaymentMethod.cancelButton')}
        </Button>

        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting
            ? t('investor.payment.addNewPaymentMethod.addingButton')
            : t('investor.payment.addNewPaymentMethod.addButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
