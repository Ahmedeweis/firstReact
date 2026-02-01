import type { ICategoryTableFilters, ICategoryTableFilterValue } from 'src/types/category';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: object;
  onResetPage: () => void;
  filters: ICategoryTableFilters;
  onFilters: (name: string, value: ICategoryTableFilterValue) => void;
};

export function CategoryTableFiltersResult({
  filters,
  onFilters,
  totalResults,
  onResetPage,
  sx,
}: Props) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    onFilters('name', '');
  }, [onFilters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    onFilters('status', 'all');
  }, [onFilters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    onFilters('name', '');
    onFilters('status', 'all');
  }, [onFilters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Status:" isShow={filters.status !== 'all'}>
        <Chip {...chipProps} label={filters.status} onDelete={handleRemoveStatus} />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.name}>
        <Chip {...chipProps} label={filters.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
