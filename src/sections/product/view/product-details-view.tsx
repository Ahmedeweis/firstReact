
import type { IProductApiItem } from 'src/types/product';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useFormatPrice } from 'src/utils/format-price';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { useCart } from 'src/hooks/use-cart';
import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
// ----------------------------------------------------------------------
// Helper function to get product image
function getProductImage(product: IProductApiItem): string {
  // Try product's own media first (most common case)
  const productMedia = (product as any).media?.[0]?.file_url;
  if (productMedia && productMedia.trim() !== '') {
    return productMedia.startsWith('http')
      ? productMedia
      : `https://retail-international-network-api.smartleadtech.com/${productMedia}`;
  }
  // Try related product cover
  const relatedCover = product.related?.[0]?.cover;
  if (relatedCover && relatedCover.trim() !== '') {
    return `https://retail-international-network-api.smartleadtech.com/${relatedCover}`;
  }
  // Try related product media
  const relatedMediaUrl = product.related?.[0]?.media?.[0]?.file_url;
  if (relatedMediaUrl && relatedMediaUrl.trim() !== '') {
    return relatedMediaUrl.startsWith('http')
      ? relatedMediaUrl
      : `https://retail-international-network-api.smartleadtech.com/${relatedMediaUrl}`;
  }
  // Try manufacturer cover
  const manufacturerCover = product.manufacturer?.cover;
  if (manufacturerCover && manufacturerCover.trim() !== '') {
    return `https://retail-international-network-api.smartleadtech.com/${manufacturerCover}`;
  }
  // Try category cover
  const categoryCover = product.category?.cover;
  if (categoryCover && categoryCover.trim() !== '') {
    return `https://retail-international-network-api.smartleadtech.com/${categoryCover}`;
  }
  // Fallback to placeholder
  return '/assets/placeholder.svg';
}
export function ProductDetailsView() {
  const { t } = useTranslate();
  const params = useParams();
  const router = useRouter();
  const { format: formatPrice } = useFormatPrice();
  const { addToCart, isInCart } = useCart();
  const { id } = params;
  const [product, setProduct] = useState<IProductApiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setLoading(false);
        toast.error('Product ID is missing');
        return;
      }
      try {
        setLoading(true);
        console.log('Fetching product details for ID:', id);
        const endpoint = endpoints.product.details(id);
        console.log('Endpoint URL:', endpoint);
        const response = await axiosInstance.get(endpoint);
        console.log('Product details response:', response.data);
        if (response.data.success) {
          const productData = response.data.data;
          if (!productData) {
            toast.error('Product data is missing');
            setProduct(null);
            return;
          }
          setProduct(productData);
          if (productData.colors && Array.isArray(productData.colors) && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0]);
          }
          if (productData.sizes && Array.isArray(productData.sizes) && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
        } else {
          toast.error(response.data.msg || 'Failed to load product details');
          setProduct(null);
        }
      } catch (error: any) {
        console.error('Failed to fetch product details:', error);
        console.error('Error response:', error?.response);
        const errorMessage =
          error?.response?.data?.msg ||
          error?.response?.data?.message ||
          error?.message ||
          'Failed to load product details';
        toast.error(errorMessage);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);
  const handleQuantityChange = useCallback((change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  }, []);
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (product.stock_status !== 'in_stock') {
      toast.error(t('product.details.productOutOfStock'));
      return;
    }
    addToCart(product, quantity, selectedColor || undefined, selectedSize || undefined);
    toast.success(`${product.name} ${t('product.details.addedToCart')}`);
  }, [product, quantity, selectedColor, selectedSize, addToCart, t]);
  if (loading) {
    return (
      <DashboardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }
  if (!product && !loading) {
    return (
      <DashboardContent>
        <Button
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          onClick={() => router.push(paths.dashboard.product.shop)}
          sx={{ mb: 3 }}
        >
          {t('product.details.backToProducts')}
        </Button>
        <EmptyContent
          filled
          sx={{ py: 10 }}
          title={t('product.details.productNotFound')}
          description={t('product.details.productNotFoundDescription')}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:cart-plus-bold" />}
              onClick={() => router.push(paths.dashboard.product.shop)}
            >
              {t('product.details.backToShop')}
            </Button>
          }
        />
      </DashboardContent>
    );
  }
  if (!product) {
    return null;
  }
  const totalPrice = parseFloat(product.sale_price || product.regular_price) * quantity;
  return (
    <DashboardContent>
      <Button
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        onClick={() => router.push(paths.dashboard.product.shop)}
        sx={{ mb: 3 }}
      >
        {t('product.details.backToProducts')}
      </Button>
      <Grid container spacing={3}>
        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <Box
              component="img"
              src={getProductImage(product)}
              alt={product.name}
              sx={{ width: '100%', height: 400, objectFit: 'cover' }}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/assets/placeholder.svg';
              }}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                {product.sale_price ? (
                  <>
                    <Typography variant="h5" color="error">
                      {formatPrice(product.sale_price)}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.disabled"
                      sx={{ textDecoration: 'line-through' }}
                    >
                      {formatPrice(product.regular_price)}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h5">
                    {formatPrice(product.regular_price)}
                  </Typography>
                )}
                <Chip
                  label={product.stock_status === 'in_stock' ? t('product.details.inStock') : t('product.details.outOfStock')}
                  color={product.stock_status === 'in_stock' ? 'success' : 'error'}
                />
              </Stack>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('product.details.colors')}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {product.colors.map((color) => (
                      <Chip
                        key={color}
                        label={color}
                        onClick={() => setSelectedColor(color)}
                        color={selectedColor === color ? 'primary' : 'default'}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('product.details.sizes')}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {product.sizes.map((size) => (
                      <Chip
                        key={size}
                        label={size}
                        onClick={() => setSelectedSize(size)}
                        color={selectedSize === size ? 'primary' : 'default'}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
              {/* Quantity */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('product.details.quantity')}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Iconify icon="eva:minus-fill" />
                  </IconButton>
                  <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Iconify icon="eva:plus-fill" />
                  </IconButton>
                </Stack>
              </Box>
              {/* Product Info */}
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>{t('product.details.sku')}:</strong> {product.sku || 'N/A'}
                </Typography>
                {product.category && (
                  <Typography variant="body2">
                    <strong>{t('product.details.category')}:</strong> {product.category.name}
                  </Typography>
                )}
                {product.manufacturer && (
                  <Typography variant="body2">
                    <strong>{t('product.details.manufacturer')}:</strong> {product.manufacturer.name}
                  </Typography>
                )}
                <Typography variant="body2">
                  <strong>{t('product.details.stock')}:</strong> {product.stock || 0} {t('product.details.units')}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* Add to Cart Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {t('product.details.addToCart')}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={3}>
                {/* Order Summary */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('product.details.orderSummary')}
                  </Typography>
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {t('product.details.product')}:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {product.name}
                      </Typography>
                    </Stack>
                    {selectedColor && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          {t('product.details.color')}:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {selectedColor}
                        </Typography>
                      </Stack>
                    )}
                    {selectedSize && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          {t('product.details.size')}:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {selectedSize}
                        </Typography>
                      </Stack>
                    )}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {t('product.details.quantity')}:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {quantity}
                      </Typography>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6">{t('product.details.total')}:</Typography>
                      <Typography variant="h6" color="primary">
                        {formatPrice(totalPrice)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handleAddToCart}
                  disabled={!product || product.stock_status !== 'in_stock'}
                  startIcon={
                    <Iconify
                      icon={
                        product &&
                          isInCart(product.id, selectedColor || undefined, selectedSize || undefined)
                          ? 'solar:check-circle-bold'
                          : 'solar:cart-plus-bold'
                      }
                    />
                  }
                  sx={{
                    minHeight: 48,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {product &&
                    isInCart(product.id, selectedColor || undefined, selectedSize || undefined)
                    ? t('product.details.alreadyInCart')
                    : t('product.details.addToCart')}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => router.push(paths.dashboard.product.cart)}
                  startIcon={<Iconify icon="solar:cart-bold" />}
                >
                  {t('product.details.viewCart')}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
