import type { DialogProps } from '@mui/material/Dialog';
import type { ChargeFormData } from 'src/types/investor/charge';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
import Slider from '@mui/material/Slider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import AlertTitle from '@mui/material/AlertTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales/use-locales';
import { createChargeRequest } from 'src/actions/investor/charge';
import { useGetInvestorOverview } from 'src/actions/investor/overview';
import { useGetPaymentMethods } from 'src/actions/investor/payment-methods';

import { Iconify } from 'src/components/iconify';

import { PaymentType } from 'src/types/investor/charge';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  onClose: () => void;
  onSuccess?: () => void;
};

export function ChargeDialog({ onClose, onSuccess, ...other }: Props) {
  const { t } = useTranslate();
  const { paymentMethods } = useGetPaymentMethods();
  const { balance } = useGetInvestorOverview();

  const [formData, setFormData] = useState<ChargeFormData>({
    payment_type: PaymentType.Visa,
    payment_method_id: 0,
    amount: 0,
  });

  const [sliderValue, setSliderValue] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setSliderValue(value);
    setFormData((prev) => ({ ...prev, amount: value }));
  };

  const validateForm = (): boolean => {
    // Validate amount
    if (!formData.amount || formData.amount <= 0) {
      setError(t('investor.charge.validation.amountRequired'));
      return false;
    }

    // Validate payment type
    if (!formData.payment_type) {
      setError(t('investor.charge.validation.paymentTypeRequired'));
      return false;
    }

    // Validate payment method
    if (!formData.payment_method_id) {
      setError(t('investor.charge.validation.paymentMethodRequired'));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      setIsSubmitting(true);
      setError(null);

      await createChargeRequest(formData);

      setSuccess(true);

      // Call success callback after a delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }, 2000);
    } catch (err: any) {
      console.error('Failed to process charge:', err);
      setError(err?.message || t('investor.charge.errors.general'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (other.open) {
      setFormData({
        payment_type: PaymentType.Visa,
        payment_method_id: 0,
        amount: 0,
      });
      setSliderValue(0);
      setError(null);
      setSuccess(false);
    }
  }, [other.open]);

  if (success) {
    return (
      <Dialog maxWidth="md" onClose={handleClose} {...other}>
        <DialogContent sx={{ overflow: 'unset', p: 5, textAlign: 'center' }}>
          <Stack spacing={4} alignItems="center">
            {/* Success Icon */}
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'success.main',
                mb: 3,
              }}
            >
              <Iconify icon="eva:checkmark-fill" width={50} />
            </Avatar>

            {/* Success Title */}
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {t('investor.charge.success')}
            </Typography>

            {/* Success Message */}
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 400 }}>
              {t('investor.charge.info')}
            </Typography>

            {/* Continue Button */}
            <Button
              variant="contained"
              onClick={handleClose}
              fullWidth
              size="large"
              sx={{
                bgcolor: 'grey.800',
                '&:hover': {
                  bgcolor: 'grey.900',
                },
                mt: 3,
                py: 2,
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'medium',
                fontSize: '1.1rem',
              }}
            >
              {t('investor.charge.continue') || 'Continue'}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog maxWidth="sm" onClose={handleClose} {...other}>
      <DialogContent sx={{ overflow: 'unset', p: 3 }}>
        <Stack spacing={3} alignItems="center">
          {/* Header with Icon */}
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'error.main',
              mb: 1,
            }}
          >
            <Iconify icon="eva:arrow-downward-fill" width={32} />
          </Avatar>

          <Typography variant="h5" fontWeight="bold" textAlign="center">
            {t('investor.charge.title')}
          </Typography>

          {/* Current Balance Information */}
          <Box
            sx={{
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 2,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Current Balance
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {balance} USD
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          {/* Amount Selection with Slider */}
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                {t('investor.charge.amount')}
              </Typography>
              <Chip label={`${sliderValue} USD`} size="small" sx={{ bgcolor: 'grey.300' }} />
            </Box>

            <Slider
              value={sliderValue}
              onChange={handleSliderChange}
              min={0}
              max={10000}
              step={100}
              sx={{
                '& .MuiSlider-track': {
                  bgcolor: 'success.main',
                },
                '& .MuiSlider-thumb': {
                  bgcolor: 'white',
                  border: '2px solid',
                  borderColor: 'success.main',
                },
              }}
            />

            <TextField
              type="number"
              label={t('investor.charge.amount')}
              placeholder={t('investor.charge.placeholders.amount')}
              value={formData.amount}
              onChange={(e) => {
                const value = Number(e.target.value);
                setFormData((prev) => ({ ...prev, amount: value }));
                setSliderValue(value);
              }}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Payment Method Section */}
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'error.main',
              borderRadius: 2,
              p: 2,
              width: '100%',
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Credit / Debit card
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We support Mastercard, Visa, Discover and Stripe.
            </Typography>

            {/* Card Logos */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Iconify icon="logos:mastercard" width={32} />
              <Iconify icon="logos:visa" width={32} />
              <Iconify icon="logos:american-express" width={32} />
            </Box>

            {/* Payment Method Selection */}
            <FormControl fullWidth>
              <InputLabel>{t('investor.charge.paymentMethod')}</InputLabel>
              <Select
                value={formData.payment_method_id || ''}
                label={t('investor.charge.paymentMethod')}
                onChange={(e) => {
                  const methodId = Number(e.target.value);
                  const method = paymentMethods.find((m) => m.id === methodId);

                  // Update payment method ID
                  handleInputChange('payment_method_id', methodId);

                  // Automatically update payment_type based on the selected card type
                  // This will send visa, mastercard, or amex with the endpoint
                  if (method) {
                    handleInputChange('payment_type', method.type);
                  }
                }}
                renderValue={(selected) => {
                  const method = paymentMethods.find((m) => m.id === selected);
                  if (!method) return '';

                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify
                        icon={
                          method.type === 'visa'
                            ? 'logos:visa'
                            : method.type === 'mastercard'
                              ? 'logos:mastercard'
                              : method.type === 'amex'
                                ? 'logos:american-express'
                                : 'solar:card-bold'
                        }
                        width={20}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {method.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {method.card_number !== 'N/A'
                            ? method.card_number
                            : `${method.type.toUpperCase()} Card`}
                        </Typography>
                      </Box>
                    </Box>
                  );
                }}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.id} value={method.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify
                        icon={
                          method.type === 'visa'
                            ? 'logos:visa'
                            : method.type === 'mastercard'
                              ? 'logos:mastercard'
                              : method.type === 'amex'
                                ? 'logos:american-express'
                                : 'solar:card-bold'
                        }
                        width={20}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {method.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {method.card_number !== 'N/A'
                            ? method.card_number
                            : `${method.type.toUpperCase()} Card`}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Add New Card Link */}
            <Typography
              variant="body2"
              color="error.main"
              sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
                mt: 1,
                textAlign: 'center',
              }}
              onClick={() => {
                // TODO: Open add new card dialog
                console.log('Add new card clicked');
              }}
            >
              + Add new card
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          fullWidth
          size="large"
          sx={{
            bgcolor: 'grey.800',
            '&:hover': {
              bgcolor: 'grey.700',
            },
          }}
        >
          {isSubmitting ? t('investor.charge.chargingButton') : 'Charge'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
