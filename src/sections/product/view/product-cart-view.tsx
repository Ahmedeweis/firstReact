import type { IOrderCreateInput } from 'src/types/order';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { useCart } from 'src/hooks/use-cart';
import { useFormatPrice } from 'src/utils/format-price';

import { getProductImage } from './product-shop-view';

// ----------------------------------------------------------------------

export function ProductCartView() {
  const { t } = useTranslate();
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { format: formatPrice } = useFormatPrice();

  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
  });
  const [notes, setNotes] = useState('');

  const handlePlaceOrder = useCallback(async () => {
    if (cartItems.length === 0) {
      toast.error(t('product.cart.cartIsEmpty'));
      return;
    }

    // Validate shipping address
    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.country ||
      !shippingAddress.zip
    ) {
      toast.error(t('product.cart.pleaseFillShippingAddress'));
      return;
    }

    try {
      setPlacing(true);

      // Group items by vendor
      const itemsByVendor = cartItems.reduce((acc, item) => {
        const vendorId = item.product.manufacturer_id;
        if (!acc[vendorId]) {
          acc[vendorId] = [];
        }
        acc[vendorId].push({
          product_id: item.product.id,
          quantity: item.quantity,
        });
        return acc;
      }, {} as Record<number, { product_id: number; quantity: number }[]>);

      // Place orders for each vendor
      const orderPromises = Object.entries(itemsByVendor).map(([vendorId, items]) => {
        const orderData: IOrderCreateInput = {
          vendor_id: parseInt(vendorId, 10),
          items,
          payment_method: 'myfatoorah',
          shipping_method: 'DHL',
          shipping_address: shippingAddress,
          notes: notes || undefined,
        };
        return axiosInstance.post(endpoints.order.create, orderData);
      });

      await Promise.all(orderPromises);

      toast.success(t('product.cart.ordersPlacedSuccessfully'));
      clearCart();
      setOrderDialogOpen(false);
      router.push(paths.dashboard.order.root);
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast.error(error?.response?.data?.msg || error?.message || t('product.cart.failedToPlaceOrder'));
    } finally {
      setPlacing(false);
    }
  }, [cartItems, shippingAddress, notes, clearCart, router]);

  const handleOpenOrderDialog = useCallback(() => {
    if (cartItems.length === 0) {
      toast.error(t('product.cart.cartIsEmpty'));
      return;
    }
    setOrderDialogOpen(true);
  }, [cartItems]);

  const handleCloseOrderDialog = useCallback(() => {
    setOrderDialogOpen(false);
    setShippingAddress({
      address: '',
      city: '',
      state: '',
      country: '',
      zip: '',
    });
    setNotes('');
  }, []);

  const total = getCartTotal();

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Typography variant="h4">{t('product.cart.title')}</Typography>
        {cartItems.length > 0 && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:cart-check-bold" />}
            onClick={handleOpenOrderDialog}
            size="large"
          >
            {t('product.cart.placeOrder')}
          </Button>
        )}
      </Stack>

      {cartItems.length === 0 ? (
        <EmptyContent
          filled
          sx={{ py: 10 }}
          title={t('product.cart.emptyCart')}
          description={t('product.cart.emptyCartDescription')}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:cart-plus-bold" />}
              onClick={() => router.push(paths.dashboard.product.shop)}
            >
              {t('product.cart.shopNow')}
            </Button>
          }
        />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              {cartItems.map((item) => (
                <Card key={`${item.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`}>
                  <Stack direction="row" spacing={2}>
                    <CardMedia
                      component="img"
                      sx={{ width: 120, height: 120, objectFit: 'cover' }}
                      image={getProductImage(item.product)}
                      alt={item.product.name}
                    />
                    <CardContent sx={{ flex: 1, p: 2 }}>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {item.product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.product.sub_description}
                            </Typography>
                            {(item.selectedColor || item.selectedSize) && (
                              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                {item.selectedColor && (
                                  <Typography variant="caption" color="text.secondary">
                                    {t('product.cart.color')}: {item.selectedColor}
                                  </Typography>
                                )}
                                {item.selectedSize && (
                                  <Typography variant="caption" color="text.secondary">
                                    {t('product.cart.size')}: {item.selectedSize}
                                  </Typography>
                                )}
                              </Stack>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              removeFromCart(item.id, item.selectedColor, item.selectedSize)
                            }
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ mt: 1 }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1,
                                  item.selectedColor,
                                  item.selectedSize
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Iconify icon="eva:minus-fill" />
                            </IconButton>
                            <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1,
                                  item.selectedColor,
                                  item.selectedSize
                                )
                              }
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Iconify icon="eva:plus-fill" />
                            </IconButton>
                          </Stack>

                          <Typography variant="h6">
                            {formatPrice(
                              parseFloat(item.product.sale_price || item.product.regular_price) *
                              item.quantity
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('product.cart.orderSummary')}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{t('product.cart.items')}:</Typography>
                    <Typography variant="body2">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{t('product.cart.subtotal')}:</Typography>
                    <Typography variant="body2">{formatPrice(total)}</Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">{t('product.cart.total')}:</Typography>
                    <Typography variant="h6" color="primary">
                      {formatPrice(total)}
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<Iconify icon="solar:cart-check-bold" />}
                    onClick={handleOpenOrderDialog}
                  >
                    {t('product.cart.placeOrder')}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Iconify icon="solar:arrow-left-bold" />}
                    onClick={() => router.push(paths.dashboard.product.shop)}
                  >
                    {t('product.cart.continueShopping')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Place Order Dialog */}
      <Dialog open={orderDialogOpen} onClose={handleCloseOrderDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('product.cart.placeOrder')}
          <IconButton
            onClick={handleCloseOrderDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t('product.cart.shippingAddress')}
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  label={t('product.cart.streetAddress')}
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, address: e.target.value }))
                  }
                  required
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t('product.cart.city')}
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({ ...prev, city: e.target.value }))
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t('product.cart.state')}
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({ ...prev, state: e.target.value }))
                      }
                      required
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t('product.cart.country')}
                      value={shippingAddress.country}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({ ...prev, country: e.target.value }))
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t('product.cart.zip')}
                      value={shippingAddress.zip}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({ ...prev, zip: e.target.value }))
                      }
                      required
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              label={t('product.cart.orderNotes')}
              placeholder={t('product.cart.orderNotesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <Box sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 1 }}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">{t('product.cart.paymentMethod')}:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    MyFatoorah
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">{t('product.cart.shippingMethod')}:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    DHL
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1">{t('product.cart.total')}:</Typography>
                  <Typography variant="h6" color="primary">
                    {formatPrice(total)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseOrderDialog} disabled={placing}>
            {t('product.cart.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handlePlaceOrder}
            disabled={placing}
            startIcon={
              placing ? <CircularProgress size={20} /> : <Iconify icon="solar:cart-check-bold" />
            }
          >
            {placing ? t('product.cart.placing') : t('product.cart.placeOrder')}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

