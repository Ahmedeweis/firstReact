import type { Dayjs } from 'dayjs';
import type { SelectChangeEvent } from '@mui/material';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type {
  TransactionFilterQuery} from 'src/types/investor/transactions';

import dayjs from 'dayjs';
import { useCallback } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import {
  Grid,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  InputAdornment,
} from '@mui/material';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { SortByField ,
  SortDirection,
  TransactionType
} from 'src/types/investor/transactions';

export type Props = {
  dateError: boolean;
  onResetPage: () => void;
  filters: UseSetStateReturn<TransactionFilterQuery>;
};

export function TransactionTableToolbar({ filters, dateError, onResetPage }: Props) {
  const { t } = useTranslate();

  const handleStartDate = useCallback(
    (value: Dayjs | null) => {
      onResetPage();
      filters.setState({ start_date: value ? value.toISOString() : null });
    },
    [filters, onResetPage]
  );

  const handleEndDate = useCallback(
    (value: Dayjs | null) => {
      onResetPage();
      filters.setState({ end_date: value ? value.toISOString() : null });
    },
    [filters, onResetPage]
  );

  const handleMinAmountSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ min_amount: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleMaxAmountSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ max_amount: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleTypeChange = useCallback(
    (event: SelectChangeEvent<TransactionType>) => {
      onResetPage();
      filters.setState({ type: event.target.value as TransactionType });
    },
    [filters, onResetPage]
  );

  const handleSortByChange = useCallback(
    (event: SelectChangeEvent<SortByField>) => {
      onResetPage();
      filters.setState({ sort_by: event.target.value as SortByField });
    },
    [filters, onResetPage]
  );

  const handleSortDirChange = useCallback(
    (event: SelectChangeEvent<SortDirection>) => {
      onResetPage();
      filters.setState({ sort_direction: event.target.value as SortDirection });
    },
    [filters, onResetPage]
  );

  return (
    <Grid container spacing={2} sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <DatePicker
          label={t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.startDate')}
          value={filters?.state.start_date ? dayjs(filters.state.start_date as string) : null}
          onChange={handleStartDate}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <DatePicker
          label={t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.endDate')}
          value={filters?.state.end_date ? dayjs(filters.state.end_date as string) : null}
          onChange={handleEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText: dateError
                ? t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.errorDate')
                : null,
            },
          }}
          sx={{
            [`& .${formHelperTextClasses.root}`]: {
              bottom: { md: -40 },
              position: { md: 'absolute' },
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <TextField
          fullWidth
          type="number"
          value={filters?.state.min_amount || ''}
          onChange={handleMinAmountSearch}
          placeholder={t(
            'investor.dashboard.transactionsPage.transactionTable.tableToolbar.minAmount'
          )}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:money-bold" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <TextField
          fullWidth
          type="number"
          value={filters?.state.max_amount || ''}
          onChange={handleMaxAmountSearch}
          placeholder={t(
            'investor.dashboard.transactionsPage.transactionTable.tableToolbar.maxAmount'
          )}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:money-bold" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <FormControl fullWidth>
          <InputLabel>{t('investor.dashboard.transactionsPage.transactionTable.type')}</InputLabel>
          <Select
            value={filters.state.type || ''}
            onChange={handleTypeChange}
            label={t('investor.dashboard.transactionsPage.transactionTable.type')}
          >
            <MenuItem value="">
              {t('investor.dashboard.transactionsPage.transactionTable.typeValues.all')}
            </MenuItem>
            <MenuItem value={TransactionType.Deposit}>
              {t('investor.dashboard.transactionsPage.transactionTable.typeValues.deposit')}
            </MenuItem>
            <MenuItem value={TransactionType.Withdrawal}>
              {t('investor.dashboard.transactionsPage.transactionTable.typeValues.withdrawal')}
            </MenuItem>
            <MenuItem value={TransactionType.Profit}>
              {t('investor.dashboard.transactionsPage.transactionTable.typeValues.profit')}
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <FormControl fullWidth>
          <InputLabel>
            {t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortBy')}
          </InputLabel>
          <Select
            value={filters.state.sort_by || ''}
            onChange={handleSortByChange}
            label={t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortBy')}
          >
            <MenuItem value="" defaultChecked>
              {t(
                'investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortByValues.none'
              )}
            </MenuItem>
            <MenuItem value={SortByField.CreatedAt}>
              {t(
                'investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortByValues.createdAt'
              )}
            </MenuItem>
            <MenuItem value={SortByField.Amount}>
              {t(
                'investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortByValues.amount'
              )}
            </MenuItem>
            <MenuItem value={SortByField.Type}>
              {t(
                'investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortByValues.type'
              )}
            </MenuItem>
            <MenuItem value={SortByField.Status}>
              {t(
                'investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortByValues.status'
              )}
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <FormControl fullWidth>
          <InputLabel>
            {t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortByDirection')}
          </InputLabel>
          <Select
            value={filters.state.sort_direction || ''}
            onChange={handleSortDirChange}
            label={t(
              'investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortByDirection'
            )}
          >
            <MenuItem value="">
              {t(
                'investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortByDirectionValues.none'
              )}
            </MenuItem>
            <MenuItem value={SortDirection.Asc}>
              {t(
                'investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortByDirectionValues.asc'
              )}
            </MenuItem>
            <MenuItem value={SortDirection.Desc}>
              {t(
                'investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortByDirectionValues.desc'
              )}
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
