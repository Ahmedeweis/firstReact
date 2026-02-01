import type { IOrderItem } from 'src/types/order';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  order: IOrderItem | null;
  onClose: () => void;
  onShip: (shippingMethod: string) => Promise<void>;
  isShipping: boolean;
};

export function OrderShipDialog({ open, order, onClose, onShip, isShipping }: Props) {
  const [shippingMethod, setShippingMethod] = useState('');
  const [error, setError] = useState('');

  const handleShip = async () => {
    if (!shippingMethod.trim()) {
      setError('Shipping method is required');
      return;
    }

    setError('');
    await onShip(shippingMethod);
  };

  const handleClose = () => {
    if (!isShipping) {
      setShippingMethod('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:delivery-bold" width={24} />
          <Typography variant="h6">Ship Order {order?.orderNumber}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>Customer:</strong> {order?.customer?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>Shipping Method:</strong> {order?.delivery?.shipBy}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>Address:</strong> {order?.shippingAddress?.fullAddress}
              </Typography>
            </Stack>

            <TextField
              fullWidth
              select
              label="Shipping Method"
              value={shippingMethod}
              onChange={(e) => {
                setShippingMethod(e.target.value);
                if (error) setError('');
              }}
              error={!!error}
              helperText={error || 'Select a shipping method'}
              disabled={isShipping}
              required
            >
              <MenuItem value="DHL">DHL</MenuItem>
              <MenuItem value="FedEx">FedEx</MenuItem>
              <MenuItem value="UPS">UPS</MenuItem>
              <MenuItem value="HSL">HSL</MenuItem>
            </TextField>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isShipping}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={isShipping}
          onClick={handleShip}
          startIcon={<Iconify icon="solar:delivery-bold" />}
        >
          Ship Order
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
