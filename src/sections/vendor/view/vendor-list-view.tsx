import type { IVendor, IVendorTableFilters } from 'src/types/vendor';

import useSWR from 'swr';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import CircularProgress from '@mui/material/CircularProgress';

import { useSetState } from 'src/hooks/use-set-state';

import { fetcher } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { VendorTableRow } from '../vendor-table-row';
import { VendorTableToolbar } from '../vendor-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'id', label: 'ID', width: 100 },
];

// ----------------------------------------------------------------------

export function VendorListView() {
  const table = useTable();

  const filters = useSetState<IVendorTableFilters>({ name: '' });

  // Adjust page to be 1-indexed for backend if needed, usually MUI is 0-indexed.
  // Laravel/Backend usually expects 1-based page.
  const page = table.page + 1;

  const { data, isLoading } = useSWR(
    [`/vendors`, { page, per_page: table.rowsPerPage, search: filters.state.name }],
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const [tableData, setTableData] = useState<IVendor[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (data) {
      // Adapt based on actual API response structure. 
      // Assuming Standard: { data: [...], meta: { total: ... } } or { data: [...], total: ... }
      // If data.data is the array:
      const list = data.data || [];
      setTableData(list);
      setTotalCount(data.meta?.total || data.total || list.length);
    }
  }, [data]);

  const notFound = (!tableData.length && !isLoading);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Vendors List"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Vendors', href: '/dashboard/vendor' },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <VendorTableToolbar filters={filters} onResetPage={() => table.setPage(0)} />

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            {isLoading ? (
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
            ) : (
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={totalCount}
                  onSort={table.onSort}
                />

                <TableBody>
                  {tableData.map((row) => (
                    <VendorTableRow key={row.id} row={row} />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            )}
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={totalCount}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
