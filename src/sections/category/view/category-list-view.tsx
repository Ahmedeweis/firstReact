import type {
  ICategory,
  ICategoryTableFilters,
  ICategoryTableFilterValue,
} from 'src/types/category';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { useGetCategories } from 'src/actions/category';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { CategoryTableRow } from '../category-table-row';
import { CategoryTableToolbar } from '../category-table-toolbar';
import { CategoryTableFiltersResult } from '../category-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Category' },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'parent', label: 'Parent', width: 180 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function CategoryListView() {
  const table = useTable({ defaultOrderBy: 'name' });

  const router = useRouter();

  const [page, setPage] = useState(1);

  const filters = useSetState<ICategoryTableFilters>({
    name: '',
    status: 'all',
  });

  const { categories, categoriesLoading, categoriesEmpty, meta } = useGetCategories({
    page,
    name: filters.state.name || undefined,
    status: filters.state.status !== 'all' ? filters.state.status : undefined,
  });

  const dataFiltered = applyFilter({
    inputData: categories,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset = !!filters.state.name || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || categoriesEmpty;

  const handleFilters = useCallback(
    (name: string, value: ICategoryTableFilterValue) => {
      table.onResetPage();
      setPage(1);
      filters.setState({ [name]: value });
    },
    [filters, table]
  );

  const handleDeleteRows = useCallback(() => {
    toast.success('Delete success!');
    // Implement bulk delete functionality
  }, []);

  const handleViewRow = useCallback(
    (id: number) => {
      router.push(paths.dashboard.category.details(id.toString()));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handlePageChange = useCallback((event: unknown, newPage: number) => {
    setPage(newPage + 1);
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Categories"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Categories', href: paths.dashboard.category.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={filters.state.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                    'soft'
                  }
                  color={
                    (tab.value === 'active' && 'success') ||
                    (tab.value === 'pending' && 'warning') ||
                    (tab.value === 'inactive' && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all'
                    ? meta.total
                    : categories.filter((cat) => cat.status === tab.value).length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <CategoryTableToolbar
          filters={filters.state}
          onResetPage={() => setPage(1)}
          onFilters={handleFilters}
          statusOptions={STATUS_OPTIONS}
        />

        {canReset && (
          <CategoryTableFiltersResult
            filters={filters.state}
            totalResults={dataFiltered.length}
            onFilters={handleFilters}
            onResetPage={() => setPage(1)}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id.toString())
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={handleDeleteRows}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id.toString())
                  )
                }
              />

              <TableBody>
                {categoriesLoading ? (
                  [...Array(table.rowsPerPage)].map((_, index) => (
                    <CategoryTableRowSkeleton key={index} />
                  ))
                ) : (
                  <>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <CategoryTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id.toString())}
                          onSelectRow={() => table.onSelectRow(row.id.toString())}
                          onViewRow={() => handleViewRow(row.id)}
                        />
                      ))}
                  </>
                )}

                <TableEmptyRows
                  height={table.dense ? 56 : 76}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={page - 1}
          dense={table.dense}
          count={meta.total}
          rowsPerPage={meta.perPage}
          onPageChange={handlePageChange}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={(event) => {
            // Handle rows per page change if needed
          }}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function CategoryTableRowSkeleton() {
  return (
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <Box key={index} component="tr" sx={{ height: 76 }} />
      ))}
    </TableBody>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ICategory[];
  filters: ICategoryTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (category) =>
        category.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        category.description.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((category) => category.status === status);
  }

  return inputData;
}
