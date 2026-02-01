import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { useTranslate } from 'src/locales';
import { Scrollbar } from 'src/components/scrollbar';

import axiosInstance, { endpoints } from 'src/utils/axios';

import type { ICategory } from 'src/types/category';

// ----------------------------------------------------------------------

// Note: Will be translated in component
export const GENDER_OPTIONS_KEYS = [
  { key: 'men', value: 'Men' },
  { key: 'women', value: 'Women' },
  { key: 'kids', value: 'Kids' },
];

export const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

// Note: Will be translated in component
export const PRICE_OPTIONS_KEYS = [
  { value: 'below', key: 'below25', min: undefined, max: 25 },
  { value: 'between', key: 'between2575', min: 25, max: 75 },
  { value: 'above', key: 'above75', min: 75, max: undefined },
];

export const COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  //
  filters: {
    gender: string[];
    category_id: number | null;
    colors: string[];
    price_min: number | null;
    price_max: number | null;
    priceRange: string;
    rating: string;
    search: string;
  };
  onFilters: (name: string, value: string | string[] | number | null) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
};

export default function ProductFilters({
  open,
  onOpen,
  onClose,
  //
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
}: Props) {
  const { t } = useTranslate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await axiosInstance.get(endpoints.category.list, {
          params: { notPaginated: true },
        });
        if (response.data.success) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);
  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {t('product.shop.filters.title')}
      </Typography>

      <Button
        size="small"
        color="inherit"
        onClick={onResetFilters}
        startIcon={<Iconify icon="solar:restart-bold" />}
      >
        {t('product.shop.filters.clearAll')}
      </Button>

      <Box onClick={onClose} sx={{ cursor: 'pointer' }}>
        <Iconify icon="mingcute:close-line" />
      </Box>
    </Stack>
  );

  const renderSearch = (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth
        size="small"
        value={filters.search}
        onChange={(e) => onFilters('search', e.target.value)}
        placeholder={t('product.shop.filters.search')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );

  const renderGender = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{t('product.shop.filters.gender')}</Typography>
      <FormGroup>
        {GENDER_OPTIONS_KEYS.map((item) => (
          <FormControlLabel
            key={item.value}
            control={
              <Checkbox
                checked={filters.gender.includes(item.value)}
                onClick={() => {
                  const newValue = filters.gender.includes(item.value)
                    ? filters.gender.filter((value) => value !== item.value)
                    : [...filters.gender, item.value];
                  onFilters('gender', newValue);
                }}
              />
            }
            label={t(`product.shop.filters.${item.key}`)}
          />
        ))}
      </FormGroup>
    </Stack>
  );

  const renderCategory = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{t('product.shop.filters.category')}</Typography>
      {categoriesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <RadioGroup
          value={filters.category_id || 'all'}
          onChange={(event) => {
            const value = event.target.value === 'all' ? null : parseInt(event.target.value, 10);
            onFilters('category_id', value);
          }}
        >
          <FormControlLabel value="all" control={<Radio />} label={t('product.shop.filters.all')} />
          {categories.map((category) => (
            <FormControlLabel
              key={category.id}
              value={category.id.toString()}
              control={<Radio />}
              label={category.name}
            />
          ))}
        </RadioGroup>
      )}
    </Stack>
  );


  const renderPrice = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{t('product.shop.filters.price')}</Typography>
      <RadioGroup
        value={filters.priceRange || 'all'}
        onChange={(event) => {
          const selectedOption = PRICE_OPTIONS_KEYS.find((opt) => opt.value === event.target.value);
          if (selectedOption) {
            onFilters('priceRange', event.target.value);
            onFilters('price_min', selectedOption.min ?? null);
            onFilters('price_max', selectedOption.max ?? null);
          } else {
            onFilters('priceRange', 'all');
            onFilters('price_min', null);
            onFilters('price_max', null);
          }
        }}
      >
        <FormControlLabel value="all" control={<Radio />} label={t('product.shop.filters.all')} />
        {PRICE_OPTIONS_KEYS.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio />}
            label={t(`product.shop.filters.${item.key}`)}
          />
        ))}
      </RadioGroup>
    </Stack>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Iconify
            icon="ic:round-filter-list"
            width={20}
            sx={canReset ? { color: 'primary.main' } : {}}
          />
        }
        onClick={onOpen}
      >
        {t('product.shop.filters.title')}
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 2.5 }}>
            {renderSearch}
            <Divider sx={{ borderStyle: 'dashed' }} />
            {renderGender}
            <Divider sx={{ borderStyle: 'dashed' }} />
            {renderCategory}
            <Divider sx={{ borderStyle: 'dashed' }} />
            {renderPrice}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
