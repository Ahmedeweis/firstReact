import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { Card, Stack, Divider, CardHeader } from '@mui/material';

import { useTranslate } from 'src/locales';
import { sendContactUsMessage } from 'src/actions/investor/contact-us';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';

interface InvestorAddContactUsProps {
  open: boolean;
  close: () => void;
}

export function InvestorAddContactUs({ open, close }: InvestorAddContactUsProps) {
  const { t } = useTranslate();

  const ContactSchema = zod.object({
    subject: zod
      .string()
      .min(4, { message: t('investor.dashboard.contactUsPage.contactUsForm.subjectRequired') })
      .refine((val) => val.trim() !== '', {
        message: t('investor.dashboard.contactUsPage.contactUsForm.subjectRequired'),
      }),
    message: zod
      .string()
      .min(10, { message: t('investor.dashboard.contactUsPage.contactUsForm.messageRequired') })
      .refine((val) => val.trim() !== '', {
        message: t('investor.dashboard.contactUsPage.contactUsForm.messageRequired'),
      }),
  });

  type ContactSchemaType = zod.infer<typeof ContactSchema>;

  const defaultValues = useMemo<ContactSchemaType>(
    () => ({
      subject: '',
      message: '',
    }),
    []
  );

  const methods = useForm<ContactSchemaType>({
    resolver: zodResolver(ContactSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await sendContactUsMessage(data);
      if (res.success) {
        toast.success(res.msg);
        reset();
        close();
      } else {
        toast.error(res.msg || t('investor.dashboard.contactUsPage.contactUsForm.actionFailed'));
      }
    } catch (err) {
      toast.error(err?.message || t('investor.dashboard.contactUsPage.contactUsForm.actionFailed'));
    }
  });

  const handleClose = () => {
    reset(defaultValues);
    close();
  };

  const renderFields = (
    <Card>
      <CardHeader
        title={t('investor.dashboard.contactUsPage.contactUsForm.formTitle')}
        subheader={t('investor.dashboard.contactUsPage.contactUsForm.formSubtitle')}
        sx={{ mb: 3 }}
      />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text
          name="subject"
          label={t('investor.dashboard.contactUsPage.contactUsForm.subject')}
          InputLabelProps={{ shrink: true }}
        />
        <Field.Text
          name="message"
          label={t('investor.dashboard.contactUsPage.contactUsForm.message')}
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
          {t('investor.dashboard.contactUsPage.contactUsForm.send')}
        </LoadingButton>
      }
    />
  );
}
