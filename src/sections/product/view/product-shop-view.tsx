import type { IProductApiItem } from 'src/types/product';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCart } from 'src/hooks/use-cart';
import { useDebounce } from 'src/hooks/use-debounce';
import { useFormatPrice } from 'src/utils/format-price';
import ProductFilters from '../product-filters';

// ----------------------------------------------------------------------

// Helper function to get product image
export function getProductImage(product: IProductApiItem): string {
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

export function ProductShopView() {
  const { t } = useTranslate();
  const router = useRouter();
  const { addToCart, getCartItemCount, isInCart } = useCart();
  const { format: formatPrice } = useFormatPrice();

  const [products, setProducts] = useState<IProductApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const openFilters = useBoolean();

  const [filters, setFilters] = useState({
    gender: [] as string[],
    category_id: null as number | null,
    colors: [] as string[],
    price_min: null as number | null,
    price_max: null as number | null,
    priceRange: '',
    rating: '',
    search: '',
  });

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search, 500);

  const handleFilters = useCallback(
    (name: string, value: string | string[] | number | null) => {
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      gender: [],
      category_id: null,
      colors: [],
      price_min: null,
      price_max: null,
      priceRange: '',
      rating: '',
      search: '',
    });
  }, []);

  const canReset =
    filters.gender.length > 0 ||
    filters.category_id !== null ||
    filters.price_min !== null ||
    filters.price_max !== null ||
    filters.search !== '' ||
    filters.priceRange !== '';


  const fetchProducts = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true);
        const params: Record<string, any> = {
          page: pageNum,
          per_page: 12,
        };

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        if (filters.category_id) {
          params.category_id = filters.category_id;
        }

        if (filters.price_min !== null) {
          params.price_min = filters.price_min;
        }

        if (filters.price_max !== null) {
          params.price_max = filters.price_max;
        }

        // Note: vendor_id can be added here if needed
        // if (filters.vendor_id) {
        //   params.vendor_id = filters.vendor_id;
        // }

        const response = await axiosInstance.get(endpoints.product.list, { params });

        if (response.data.success) {
          setProducts(response.data.data);
          setTotalPages(response.data.meta.lastPage);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error(t('product.shop.failedToLoadProducts'));
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, filters.category_id, filters.price_min, filters.price_max]
  );

  // Reset to page 1 when filters change (except page itself)
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [debouncedSearch, filters.category_id, filters.price_min, filters.price_max]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, debouncedSearch, filters.category_id, filters.price_min, filters.price_max, fetchProducts]);

  const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  const handleViewDetails = useCallback(
    (productId: number) => {
      router.push(paths.dashboard.product.details(productId.toString()));
    },
    [router]
  );

  const handleAddToCart = useCallback(
    (product: IProductApiItem, event: React.MouseEvent) => {
      event.stopPropagation();

      if (product.stock_status !== 'in_stock') {
        toast.error(t('product.shop.productOutOfStock'));
        return;
      }

      addToCart(product, 1);
      toast.success(`${product.name} ${t('product.shop.addedToCart')}`);
    },
    [addToCart]
  );


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

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4">{t('product.shop.products')}</Typography>
          {getCartItemCount() > 0 && (
            <Chip
              label={`${t('product.shop.cart')} (${getCartItemCount()})`}
              color="primary"
              icon={<Iconify icon="solar:cart-bold" />}
              onClick={() => router.push(paths.dashboard.product.cart)}
              sx={{ cursor: 'pointer' }}
            />
          )}
        </Stack>

        <ProductFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          filters={filters}
          onFilters={handleFilters}
          canReset={canReset}
          onResetFilters={handleResetFilters}
        />
      </Stack>

      {products.length === 0 ? (
        <EmptyContent filled sx={{ py: 10 }} title={t('product.shop.noProducts')} />
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: (theme) => theme.customShadows.z8,
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => handleViewDetails(product.id)}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image={getProductImage(product)}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/placeholder.svg';
                    }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      p: 2,
                      '&:last-child': { pb: 2 },
                    }}
                  >
                    <Stack spacing={1.5} sx={{ flexGrow: 1, minHeight: 0 }}>
                      {/* Product Name */}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: 44,
                        }}
                      >
                        {product.name}
                      </Typography>

                      {/* Description */}
                      {product.sub_description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: '0.813rem',
                            lineHeight: 1.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: 39,
                            mb: 0.5,
                          }}
                        >
                          {product.sub_description}
                        </Typography>
                      )}

                      {/* Colors */}
                      {product.colors && product.colors.length > 0 && (
                        <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ my: 0.5 }}>
                          {product.colors.slice(0, 3).map((color) => (
                            <Chip
                              key={color}
                              label={color}
                              size="small"
                              sx={{
                                height: 24,
                                fontSize: '0.688rem',
                                '& .MuiChip-label': {
                                  px: 1,
                                },
                              }}
                            />
                          ))}
                        </Stack>
                      )}

                      {/* Spacer to push price and buttons down */}
                      <Box sx={{ flexGrow: 1 }} />

                      {/* Price and Stock Status */}
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Box>
                          {product.sale_price ? (
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                              <Typography
                                variant="h6"
                                color="error"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: '1.125rem',
                                }}
                              >
                                {formatPrice(product.sale_price)}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.disabled"
                                sx={{
                                  textDecoration: 'line-through',
                                  fontSize: '0.813rem',
                                }}
                              >
                                {formatPrice(product.regular_price)}
                              </Typography>
                            </Stack>
                          ) : (
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                fontSize: '1.125rem',
                              }}
                            >
                              {formatPrice(product.regular_price)}
                            </Typography>
                          )}
                        </Box>

                        <Chip
                          label={product.stock_status === 'in_stock' ? t('product.shop.inStock') : t('product.shop.outOfStock')}
                          size="small"
                          color={product.stock_status === 'in_stock' ? 'success' : 'error'}
                          sx={{
                            height: 24,
                            fontSize: '0.688rem',
                            '& .MuiChip-label': {
                              px: 1.5,
                            },
                          }}
                        />
                      </Stack>

                      {/* Action Buttons */}
                      <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 0.5 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          size="medium"
                          startIcon={<Iconify icon="solar:eye-bold" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(product.id);
                          }}
                          sx={{
                            minHeight: 40,
                            fontSize: '0.875rem',
                          }}
                        >
                          {t('product.shop.details')}
                        </Button>
                        <Button
                          variant="contained"
                          fullWidth
                          size="medium"
                          disabled={product.stock_status !== 'in_stock'}
                          startIcon={
                            <Iconify
                              icon={
                                isInCart(product.id)
                                  ? 'solar:check-circle-bold'
                                  : 'solar:cart-plus-bold'
                              }
                            />
                          }
                          onClick={(e) => handleAddToCart(product, e)}
                          sx={{
                            minHeight: 40,
                            fontSize: '0.875rem',
                          }}
                        >
                          {isInCart(product.id) ? t('product.shop.inCart') : t('product.shop.addToCart')}
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} />
            </Box>
          )}
        </>
      )}
    </DashboardContent>
  );
}
