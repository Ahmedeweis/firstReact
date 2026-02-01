import type { DialogProps } from '@mui/material/Dialog';
import type { WithdrawFormData } from 'src/types/investor/withdraw';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slider from '@mui/material/Slider';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales/use-locales';
import { createWithdrawRequest } from 'src/actions/investor/withdraw';

import { Iconify } from 'src/components/iconify';

import { WITHDRAW_PAYMENT_TYPE } from 'src/types/investor/withdraw';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  onClose: () => void;
  onSuccess?: () => void;
  maxAmount?: number;
};

export function WithdrawDialog({ onClose, onSuccess, maxAmount = 0, ...other }: Props) {
  const { t } = useTranslate();

  const [formData, setFormData] = useState<WithdrawFormData>({
    payment_type: WITHDRAW_PAYMENT_TYPE.BANK_TRANSFER,
    amount: 0,
    iban: '',
    name: '',
    swift_code: '',
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
      setError(t('investor.withdraw.validation.amountRequired'));
      return false;
    }

    if (maxAmount > 0 && formData.amount > maxAmount) {
      setError(t('investor.withdraw.validation.amountMax').replace('{max}', String(maxAmount)));
      return false;
    }

    // Validate payment type
    if (!formData.payment_type) {
      setError(t('investor.withdraw.validation.paymentTypeRequired'));
      return false;
    }

    // Validate IBAN
    if (!formData.iban?.trim()) {
      setError(t('investor.withdraw.validation.ibanRequired'));
      return false;
    }

    // Validate name
    if (!formData.name?.trim()) {
      setError(t('investor.withdraw.validation.nameRequired'));
      return false;
    }

    // Validate SWIFT code
    if (!formData.swift_code?.trim()) {
      setError(t('investor.withdraw.validation.swiftCodeRequired'));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      setIsSubmitting(true);
      setError(null);

      const requestData = {
        payment_type: formData.payment_type,
        amount: formData.amount,
        iban: formData.iban,
        name: formData.name,
        swift_code: formData.swift_code,
      };

      await createWithdrawRequest(requestData);

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
      console.error('Failed to process withdrawal:', err);
      setError(err?.message || t('investor.withdraw.errors.general'));
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
        payment_type: WITHDRAW_PAYMENT_TYPE.BANK_TRANSFER,
        amount: 0,
        iban: '',
        name: '',
        swift_code: '',
      });
      setSliderValue(0);
      setError(null);
      setSuccess(false);
    }
  }, [other.open]);

  if (success) {
    return (
      <Dialog maxWidth="sm" onClose={handleClose} {...other}>
        <DialogContent sx={{ overflow: 'unset', p: 4, textAlign: 'center' }}>
          <Stack spacing={3} alignItems="center">
            {/* Success Icon */}
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'success.main',
                mb: 2,
              }}
            >
              <Iconify icon="eva:checkmark-fill" width={40} />
            </Avatar>

            {/* Success Title */}
            <Typography variant="h5" fontWeight="bold">
              Successful process
            </Typography>

            {/* Success Message */}
            <Typography variant="body1" color="text.secondary">
              You have successfully withdrawn your balance
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
                  bgcolor: 'grey.700',
                },
                mt: 2,
              }}
            >
              Continue
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
              bgcolor: 'success.main',
              mb: 1,
            }}
          >
            <Iconify icon="solar:bank-bold" width={32} />
          </Avatar>

          <Typography variant="h5" fontWeight="bold" textAlign="center">
            {t('investor.withdraw.title')}
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Bank Transfer Withdrawal
          </Typography>

          {/* Balance Information */}
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
              Balance
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {maxAmount} USD
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
                {t('investor.withdraw.amount')}
              </Typography>
              <Chip label={`${sliderValue} USD`} size="small" sx={{ bgcolor: 'grey.300' }} />
            </Box>

            <Slider
              value={sliderValue}
              onChange={handleSliderChange}
              min={0}
              max={maxAmount}
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
              label={t('investor.withdraw.amount')}
              placeholder={t('investor.withdraw.placeholders.amount')}
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

          {/* Payment Type (Hidden - Always bank_transfer) */}
          <input type="hidden" name="payment_type" value={WITHDRAW_PAYMENT_TYPE.BANK_TRANSFER} />

          {/* Bank Transfer Fields */}
          <Stack spacing={2} sx={{ width: '100%' }}>
            <TextField
              label={t('investor.withdraw.name')}
              placeholder={t('investor.withdraw.placeholders.name')}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label={t('investor.withdraw.iban')}
                placeholder={t('investor.withdraw.placeholders.iban')}
                value={formData.iban}
                onChange={(e) => handleInputChange('iban', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label={t('investor.withdraw.swiftCode')}
                placeholder={t('investor.withdraw.placeholders.swiftCode')}
                value={formData.swift_code}
                onChange={(e) => handleInputChange('swift_code', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
          </Stack>
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
          {isSubmitting
            ? t('investor.withdraw.withdrawingButton')
            : t('investor.withdraw.withdrawButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
