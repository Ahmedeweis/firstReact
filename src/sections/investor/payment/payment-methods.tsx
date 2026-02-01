import type { PaymentMethod } from 'src/types/investor/payment-methods';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales/use-locales';
import { deletePaymentMethod, useGetPaymentMethods } from 'src/actions/investor/payment-methods';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { PaymentNewCardDialog } from './payment-new-card-dialog';

// ----------------------------------------------------------------------

export function PaymentMethods() {
  const { t } = useTranslate();
  const confirm = useBoolean();
  const newCard = useBoolean();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { paymentMethods, paymentMethodsLoading, paymentMethodsError, refetch } =
    useGetPaymentMethods();

  const handleDelete = async () => {
    if (!selectedMethod) return;

    try {
      setIsDeleting(true);
      await deletePaymentMethod(selectedMethod.id);
      refetch();
      confirm.onFalse();
      setSelectedMethod(null);
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDelete = (method: PaymentMethod) => {
    setSelectedMethod(method);
    confirm.onTrue();
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
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

  const getPaymentMethodLabel = (type: string) => {
    switch (type) {
      case 'visa':
        return t('investor.payment.types.visa');
      case 'mastercard':
        return t('investor.payment.types.mastercard');
      case 'amex':
        return t('investor.payment.types.amex');
      default:
        return type;
    }
  };

  if (paymentMethodsLoading) {
    return (
      <Card>
        <CardHeader title={t('investor.payment.title')} />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>{t('investor.payment.loading')}</Typography>
        </Box>
      </Card>
    );
  }

  if (paymentMethodsError) {
    return (
      <Card>
        <CardHeader title={t('investor.payment.title')} />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{t('investor.payment.error')}</Typography>
          <Button onClick={refetch} sx={{ mt: 1 }}>
            {t('investor.payment.retry')}
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader
          title={t('investor.payment.title')}
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={newCard.onTrue}
            >
              {t('investor.payment.addNew')}
            </Button>
          }
        />

        <Box sx={{ p: 3 }}>
          {paymentMethods.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('investor.payment.noMethods')}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {paymentMethods.map((method) => (
                <Paper
                  key={method.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Iconify icon={getPaymentMethodIcon(method.type)} width={24} />

                      <Box>
                        <Typography variant="subtitle2">{method.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {getPaymentMethodLabel(method.type)}
                          {method.card_number !== 'N/A' && ` • ${method.card_number}`}
                          {method.expiry !== 'N/A' &&
                            ` • ${t('investor.payment.expires')}: ${method.expiry}`}
                        </Typography>
                      </Box>
                    </Stack>

                    <Tooltip title="Delete payment method">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleConfirmDelete(method)}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('investor.payment.deleteConfirm.title')}
        content={t('investor.payment.deleteConfirm.content')}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={isDeleting}
            onClick={handleDelete}
          >
            {t('investor.payment.delete')}
          </LoadingButton>
        }
      />

      <PaymentNewCardDialog
        open={newCard.value}
        onClose={newCard.onFalse}
        onSuccess={() => {
          refetch();
          newCard.onFalse();
        }}
      />
    </>
  );
}
