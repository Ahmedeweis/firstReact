import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useCart } from 'src/hooks/use-cart';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ClientCartSummary() {
  const { t } = useTranslate();
  const router = useRouter();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();
  // const cartTotal = getCartTotal();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.vars.palette.warning.main} 0%, ${theme.vars.palette.warning.dark} 100%)`,
        color: 'common.white',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Iconify icon="solar:cart-large-4-bold" width={32} />
        </Box>

        <Typography variant="h3" sx={{ mb: 0.5 }}>
          {cartCount}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.9, mb: cartCount > 0 ? 2 : 0 }}>
          {t('client.dashboard.cartSummary.itemsInCart')}
        </Typography>

        {cartCount > 0 && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => router.push(paths.dashboard.product.cart)}
            sx={{
              mt: 'auto',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'common.white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
            startIcon={<Iconify icon="solar:cart-bold" />}
          >
            {t('client.dashboard.cartSummary.viewCart')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

