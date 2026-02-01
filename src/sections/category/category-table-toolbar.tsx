import type { ICategoryTableFilters, ICategoryTableFilterValue } from 'src/types/category';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { type SelectChangeEvent } from '@mui/material/Select';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  filters: ICategoryTableFilters;
  onResetPage: () => void;
  onFilters: (name: string, value: ICategoryTableFilterValue) => void;
  statusOptions: { value: string; label: string }[];
};

export function CategoryTableToolbar({ filters, onResetPage, onFilters, statusOptions }: Props) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      onFilters('name', event.target.value);
    },
    [onFilters, onResetPage]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent) => {
      onResetPage();
      onFilters('status', event.target.value);
    },
    [onFilters, onResetPage]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Status</InputLabel>

          <Select
            value={filters.status}
            onChange={handleFilterStatus}
            input={<OutlinedInput label="Status" />}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search categories..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <Stack spacing={2.5} sx={{ p: 3 }}>
          {/* Add additional filter options here if needed */}
        </Stack>
      </CustomPopover>
    </>
  );
}
