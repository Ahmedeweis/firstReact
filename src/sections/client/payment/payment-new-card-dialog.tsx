import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import type { DialogProps } from '@mui/material/Dialog';

import { createPaymentMethod } from 'src/actions/client/payment-methods';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import type {
  PaymentMethodType,
  CreatePaymentMethodRequest,
} from 'src/types/client/payment-methods';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  onClose: () => void;
  onSuccess?: () => void;
};

export function PaymentNewCardDialog({ onClose, onSuccess, ...other }: Props) {
  const { t } = useTranslate();
  const [formData, setFormData] = useState({
    type: 'visa' as PaymentMethodType | string,
    name: '',
    card_number: '',
    expiry: '',
    cvc: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    handleInputChange('card_number', formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    handleInputChange('expiry', formatted);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
    handleInputChange('cvc', cleaned);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      if (!formData.name.trim()) {
        setError(t('payment.newCard.errors.nameRequired'));
        return;
      }
      if (!formData.card_number.trim() || formData.card_number.replace(/\s/g, '').length < 13) {
        setError(t('payment.newCard.errors.invalidCardNumber'));
        return;
      }
      if (!formData.expiry.trim() || formData.expiry.length !== 5) {
        setError(t('payment.newCard.errors.invalidExpiry'));
        return;
      }
      if (!formData.cvc.trim() || formData.cvc.length < 3) {
        setError(t('payment.newCard.errors.invalidCvc'));
        return;
      }

      const requestData: CreatePaymentMethodRequest = {
        type: formData.type,
        name: formData.name.trim(),
        card_number: formData.card_number.replace(/\s/g, ''),
        expiry: formData.expiry.trim(),
        cvc: formData.cvc.trim(),
      };

      await createPaymentMethod(requestData);

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      console.error('Failed to create payment method:', err);
      setError(err?.message || t('payment.newCard.errors.addFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog maxWidth="sm" fullWidth onClose={onClose} {...other}>
      <DialogTitle>{t('payment.newCard.title')}</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <Stack spacing={3}>
          {error && (
            <Typography color="error" variant="body2" sx={{ textAlign: 'center', py: 1 }}>
              {error}
            </Typography>
          )}

          <TextField
            select
            fullWidth
            label={t('payment.newCard.cardType')}
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="visa">{t('payment.methods.types.visa')}</MenuItem>
            <MenuItem value="mastercard">{t('payment.methods.types.mastercard')}</MenuItem>
            <MenuItem value="amex">{t('payment.methods.types.amex')}</MenuItem>
            <MenuItem value="bank_transfer">{t('payment.methods.types.bank_transfer')}</MenuItem>
            <MenuItem value="paypal">{t('payment.methods.types.paypal')}</MenuItem>
          </TextField>

          <TextField
            fullWidth
            autoFocus
            label={t('payment.newCard.cardHolderName')}
            placeholder={t('payment.newCard.placeholders.cardHolderName')}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label={t('payment.newCard.cardNumber')}
            placeholder={t('payment.newCard.placeholders.cardNumber')}
            value={formData.card_number}
            onChange={handleCardNumberChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 19 }}
          />

          <Stack spacing={2} direction="row">
            <TextField
              fullWidth
              label={t('payment.newCard.expiryDate')}
              placeholder={t('payment.newCard.placeholders.expiryDate')}
              value={formData.expiry}
              onChange={handleExpiryChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 5 }}
            />
            <TextField
              fullWidth
              label={t('payment.newCard.cvc')}
              placeholder={t('payment.newCard.placeholders.cvc')}
              value={formData.cvc}
              onChange={handleCvcChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 4 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      arrow
                      placement="top"
                      title={t('payment.newCard.tooltips.cvc')}
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
            {t('payment.newCard.securityNote')}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={onClose} disabled={isSubmitting}>
          {t('payment.newCard.cancel')}
        </Button>

        <LoadingButton variant="contained" onClick={handleSubmit} loading={isSubmitting}>
          {t('payment.newCard.addCard')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}




