import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales/use-locales';

import { PaymentMethods } from '../payment-methods';

// ----------------------------------------------------------------------

export function PaymentView() {
  const { t } = useTranslate();

  return (
    <Container sx={{ pt: 5, pb: 10 }}>
      <Typography variant="h3" align="center" sx={{ mb: 2 }}>
        {t('investor.payment.title')}
      </Typography>

      <Typography align="center" sx={{ color: 'text.secondary', mb: 5 }}>
        {t('investor.payment.subtitle')}
      </Typography>

      <PaymentMethods />
    </Container>
  );
}
