import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { Card, Stack, Divider, CardHeader } from '@mui/material';

import { useTranslate } from 'src/locales';
import { sendProfitRequest } from 'src/actions/investor/profit-request';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';

interface InvestorAddProfitRequestProps {
  open: boolean;
  close: () => void;
}

export function InvestorAddProfitRequest({ open, close }: InvestorAddProfitRequestProps) {
  const { t } = useTranslate();

  const ProfitRequestSchema = zod.object({
    amount: zod
      .number({
        required_error: t('investor.dashboard.profitRequestPage.profitRequestForm.amountRequired'),
        invalid_type_error: t(
          'investor.dashboard.profitRequestPage.profitRequestForm.amountInvalid'
        ),
      })
      .min(1, {
        message: t('investor.dashboard.profitRequestPage.profitRequestForm.amountPositive'),
      }),
    message: zod
      .string()
      .min(10, {
        message: t('investor.dashboard.profitRequestPage.profitRequestForm.messageRequired'),
      })
      .refine((val) => val.trim() !== '', {
        message: t('investor.dashboard.profitRequestPage.profitRequestForm.messageRequired'),
      }),
  });

  type ProfitRequestSchemaType = zod.infer<typeof ProfitRequestSchema>;

  const defaultValues = useMemo<ProfitRequestSchemaType>(
    () => ({
      amount: 0, // أو أي قيمة افتراضية منطقية
      message: '',
    }),
    []
  );

  const methods = useForm<ProfitRequestSchemaType>({
    resolver: zodResolver(ProfitRequestSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await sendProfitRequest({
        ...data,
        amount: String(data.amount),
      });
      if (res.success) {
        toast.success(res.msg);
        reset();
        close();
      } else {
        toast.error(
          res.msg || t('investor.dashboard.profitRequestPage.profitRequestForm.actionFailed')
        );
      }
    } catch (err) {
      toast.error(
        err?.message || t('investor.dashboard.profitRequestPage.profitRequestForm.actionFailed')
      );
    }
  });

  const handleClose = () => {
    reset(defaultValues);
    close();
  };

  const renderFields = (
    <Card>
      <CardHeader
        title={t('investor.dashboard.profitRequestPage.profitRequestForm.formTitle')}
        subheader={t('investor.dashboard.profitRequestPage.profitRequestForm.formSubtitle')}
        sx={{ mb: 3 }}
      />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text
          name="amount"
          label={t('investor.dashboard.profitRequestPage.profitRequestForm.amount')}
          InputLabelProps={{ shrink: true }}
          type="number"
        />
        <Field.Text
          name="message"
          label={t('investor.dashboard.profitRequestPage.profitRequestForm.message')}
          InputLabelProps={{ shrink: true }}
          multiline
          rows={4}
        />
      </Stack>
    </Card>
  );

  return (
    <ConfirmDialog
      open={open}
      onClose={handleClose}
      content={
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={2}>{renderFields}</Stack>
        </Form>
      }
      action={
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
          onClick={onSubmit}
        >
          {t('investor.dashboard.profitRequestPage.profitRequestForm.send')}
        </LoadingButton>
      }
    />
  );
}
