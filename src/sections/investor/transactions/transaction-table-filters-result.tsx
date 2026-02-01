import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { TransactionFilterQuery } from 'src/types/investor/transactions';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<TransactionFilterQuery>;
};

export function TransactionTableFiltersResult({ filters, totalResults, onResetPage, sx }: Props) {
  const isActive = (value: any) => value !== undefined && value !== '';

  const { t } = useTranslate();

  const handleRemoveType = useCallback(() => {
    if (!filters.state.type) return;
    onResetPage();
    filters.setState({ type: undefined });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    if (!filters.state.status) return;
    onResetPage();
    filters.setState({ status: undefined });
  }, [filters, onResetPage]);

  const handleRemoveMinAmount = useCallback(() => {
    if (!filters.state.min_amount) return;
    onResetPage();
    filters.setState({ min_amount: undefined });
  }, [filters, onResetPage]);

  const handleRemoveMaxAmount = useCallback(() => {
    if (!filters.state.max_amount) return;
    onResetPage();
    filters.setState({ max_amount: undefined });
  }, [filters, onResetPage]);

  const handleRemoveStartDate = useCallback(() => {
    if (!filters.state.start_date) return;
    onResetPage();
    filters.setState({ start_date: null });
  }, [filters, onResetPage]);

  const handleRemoveEndDate = useCallback(() => {
    if (!filters.state.end_date) return;
    onResetPage();
    filters.setState({ end_date: null });
  }, [filters, onResetPage]);

  const handleRemoveSortBy = useCallback(() => {
    if (!isActive(filters.state.sort_by)) return;
    onResetPage();
    filters.setState({ sort_by: undefined });
  }, [filters, onResetPage]);

  const handleRemoveSortDirection = useCallback(() => {
    if (!isActive(filters.state.sort_direction)) return;
    onResetPage();
    filters.setState({ sort_direction: undefined });
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock
        label={`${t('investor.dashboard.transactionsPage.transactionTable.type')}:`}
        isShow={!!filters.state.type}
      >
        <Chip
          {...chipProps}
          label={t(
            `investor.dashboard.transactionsPage.transactionTable.typeValues.${filters.state.type}`
          )}
          onDelete={handleRemoveType}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label={`${t('investor.dashboard.transactionsPage.transactionTable.status')}:`}
        isShow={!!filters.state.status}
      >
        <Chip
          {...chipProps}
          label={t(
            `investor.dashboard.transactionsPage.transactionTable.statusValues.${filters.state.status}`
          )}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label={`${t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.startDate')}:`}
        isShow={!!filters.state.start_date}
      >
        <Chip
          {...chipProps}
          label={` ${fDate(filters.state.start_date)}`}
          onDelete={handleRemoveStartDate}
        />
      </FiltersBlock>

      <FiltersBlock
        label={`${t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.endDate')}:`}
        isShow={!!filters.state.end_date}
      >
        <Chip
          {...chipProps}
          label={` ${fDate(filters.state.end_date)}`}
          onDelete={handleRemoveEndDate}
        />
      </FiltersBlock>

      <FiltersBlock
        label={`${t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.minAmount')}:`}
        isShow={!!filters.state.min_amount}
      >
        <Chip
          {...chipProps}
          label={` ${filters.state.min_amount}`}
          onDelete={handleRemoveMinAmount}
        />
      </FiltersBlock>

      <FiltersBlock
        label={`${t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.maxAmount')}:`}
        isShow={!!filters.state.max_amount}
      >
        <Chip
          {...chipProps}
          label={`${filters.state.max_amount}`}
          onDelete={handleRemoveMaxAmount}
        />
      </FiltersBlock>

      <FiltersBlock
        label={`${t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortBy')}:`}
        isShow={isActive(filters.state.sort_by)}
      >
        <Chip {...chipProps} label={filters.state.sort_by} onDelete={handleRemoveSortBy} />
      </FiltersBlock>

      <FiltersBlock
        label={`${t('investor.dashboard.transactionsPage.transactionTable.tableToolbar.sortByDirection')}:`}
        isShow={isActive(filters.state.sort_direction)}
      >
        <Chip
          {...chipProps}
          label={filters.state.sort_direction}
          onDelete={handleRemoveSortDirection}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
