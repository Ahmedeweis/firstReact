import type { PaymentMethod } from 'src/types/client/payment-methods';

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
import { deletePaymentMethod, useGetPaymentMethods } from 'src/actions/client/payment-methods';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { EmptyContent } from 'src/components/empty-content';

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
      case 'bank_transfer':
        return 'solar:bank-bold';
      case 'paypal':
        return 'logos:paypal';
      default:
        return 'solar:card-bold';
    }
  };

  const getPaymentMethodLabel = (type: string) => {
    return t(`payment.methods.types.${type}`, type);
  };

  if (paymentMethodsLoading) {
    return (
      <Card>
        <CardHeader title={t('payment.methods.title')} />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>{t('payment.methods.loading')}</Typography>
        </Box>
      </Card>
    );
  }

  if (paymentMethodsError) {
    return (
      <Card>
        <CardHeader title={t('payment.methods.title')} />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{t('payment.methods.error')}</Typography>
          <Button onClick={refetch} sx={{ mt: 1 }}>
            {t('payment.methods.retry')}
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader
          title={t('payment.methods.title')}
          action={
            <Button
              size="small"
              color="primary"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={newCard.onTrue}
            >
              {t('payment.methods.addNew')}
            </Button>
          }
        />

        <Box sx={{ p: 3 }}>
          {paymentMethods.length === 0 ? (
            <EmptyContent
              filled
              title={t('payment.methods.noMethods')}
              description={t('payment.methods.noMethodsDescription')}
              action={
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={newCard.onTrue}
                >
                  {t('payment.methods.addMethod')}
                </Button>
              }
            />
          ) : (
            <Stack spacing={2}>
              {paymentMethods.map((method) => (
                <Paper
                  key={method.id}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: (theme) => theme.customShadows.z8,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1.5,
                          bgcolor: 'background.neutral',
                        }}
                      >
                        <Iconify icon={getPaymentMethodIcon(method.type)} width={32} />
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {method.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {getPaymentMethodLabel(method.type)}
                          </Typography>
                          {method.card_number && method.card_number !== 'N/A' && (
                            <>
                              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                •
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {method.card_number}
                              </Typography>
                            </>
                          )}
                          {method.expiry && method.expiry !== 'N/A' && (
                            <>
                              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                •
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {t('payment.methods.expires')} {method.expiry}
                              </Typography>
                            </>
                          )}
                        </Stack>
                      </Box>
                    </Stack>

                    <Tooltip title={t('payment.methods.deleteMethod')}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleConfirmDelete(method)}
                        sx={{
                          '&:hover': {
                            bgcolor: 'error.lighter',
                          },
                        }}
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
        title={t('payment.methods.deleteConfirm.title')}
        content={t('payment.methods.deleteConfirm.content')}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={isDeleting}
            onClick={handleDelete}
          >
            {t('payment.methods.deleteConfirm.delete')}
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




