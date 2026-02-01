import type { IDateValue } from 'src/types/common';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import { useTranslate } from 'src/locales';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  status?: string;
  backLink: string;
  orderNumber?: string;
  createdAt?: IDateValue;
  onChangeStatus: (newValue: string) => void;
  statusOptions: { value: string; label: string }[];
  onShipOrder?: () => void;
  isShipping?: boolean;
  onPayOrder?: () => void;
  isPaying?: boolean;
};

export function OrderDetailsToolbar({
  status,
  backLink,
  createdAt,
  orderNumber,
  statusOptions,
  onChangeStatus,
  onShipOrder,
  isShipping = false,
  onPayOrder,
  isPaying = false,
}: Props) {
  const { t } = useTranslate();
  const popover = usePopover();
  const { user } = useAuthContext();
  const isClient = user?.type === 'client';

  return (
    <>
      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{ mb: { xs: 3, md: 5 } }}>
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4"> {t('orderToolbar.order')} {orderNumber} </Typography>
              <Label
                variant="soft"
                color={
                  (status === 'completed' && 'success') ||
                  (status === 'pending' && 'warning') ||
                  (status === 'cancelled' && 'error') ||
                  'default'
                }
              >
                {status}
              </Label>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {!isClient && (
            <Button
              color="inherit"
              variant="outlined"
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={popover.onOpen}
              sx={{ textTransform: 'capitalize' }}
            >
              {status}
            </Button>
          )}

          {status === 'pending' && onPayOrder && (
            <Button
              color="success"
              variant="contained"
              disabled={isPaying}
              startIcon={<Iconify icon="solar:card-bold" />}
              onClick={onPayOrder}
            >
              {isPaying ? t('orderToolbar.processing') : t('orderToolbar.payOrder')}
            </Button>
          )}

          {(status === 'pending' || status === 'completed') && onShipOrder && (
            <Button
              color="primary"
              variant="contained"
              disabled={isShipping}
              startIcon={<Iconify icon="solar:delivery-bold" />}
              onClick={onShipOrder}
            >
              {isShipping ? t('orderToolbar.shipping') : t('orderToolbar.shipOrder')}
            </Button>
          )}

          <Button
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          >
            {t('orderToolbar.print')}
          </Button>

          {!isClient && (
            <Button color="inherit" variant="contained" startIcon={<Iconify icon="solar:pen-bold" />}>
              {t('orderToolbar.edit')}
            </Button>
          )}
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          {statusOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === status}
              onClick={() => {
                popover.onClose();
                onChangeStatus(option.value);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
