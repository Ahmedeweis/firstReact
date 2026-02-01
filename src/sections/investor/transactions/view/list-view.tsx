import type { TransactionFilterQuery } from 'src/types/investor/transactions';

import { Tab, Card, Tabs, Table, TableRow, TableBody, TableCell } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useSetState } from 'src/hooks/use-set-state';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetTransactions } from 'src/actions/investor/transactions';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { TransactionStatus } from 'src/types/investor/transactions';

import { TransactionTableRow } from '../transaction-table-row';
import { TransactionTableToolbar } from '../transaction-table-toolbar';
import { TransactionTableFiltersResult } from '../transaction-table-filters-result';

// ----------------------------------------------------------------------

export function TransactionListView() {
  const table = useTable();

  const { t } = useTranslate();

  const TABLE_HEAD = [
    { id: 'id', label: t('investor.dashboard.transactionsPage.transactionTable.transactionId') },
    {
      id: 'created_at',
      label: t('investor.dashboard.transactionsPage.transactionTable.createAt'),
    },
    {
      id: 'amount',
      label: t('investor.dashboard.transactionsPage.transactionTable.amount'),
    },
    {
      id: 'status',
      label: t('investor.dashboard.transactionsPage.transactionTable.status'),
    },
    { id: 'type', label: t('investor.dashboard.transactionsPage.transactionTable.type') },
  ];

  const filters = useSetState<TransactionFilterQuery>({
    type: undefined,
    status: undefined,
    start_date: null,
    end_date: null,
    min_amount: undefined,
    max_amount: undefined,
    sort_by: undefined,
    sort_direction: undefined,
    page: table.page + 1, // important for SWR (API is 1-based)
    per_page: table.rowsPerPage,
  });

  const dateError =
    filters.state.start_date &&
    filters.state.end_date &&
    new Date(filters.state.start_date) > new Date(filters.state.end_date);

  const canReset =
    !!filters.state.type ||
    !!filters.state.status ||
    !!filters.state.start_date ||
    !!filters.state.end_date ||
    !!filters.state.min_amount ||
    !!filters.state.max_amount ||
    !!filters.state.sort_direction ||
    !!filters.state.sort_by;

  const { transactions, transactionsLoading, transactionsMeta } = useGetTransactions(filters.state);

  const TABS = [
    {
      value: 'all',
      label: t('investor.dashboard.transactionsPage.statusTaps.all'),
      color: 'default',
    },
    {
      value: TransactionStatus.Completed,
      label: t('investor.dashboard.transactionsPage.statusTaps.completed'),
      color: 'success',
    },
    {
      value: TransactionStatus.Pending,
      label: t('investor.dashboard.transactionsPage.statusTaps.pending'),
      color: 'warning',
    },
    {
      value: TransactionStatus.Failed,
      label: t('investor.dashboard.transactionsPage.statusTaps.failed'),
      color: 'error',
    },
  ] as const;

  const handleChangePage = (event: unknown, newPage: number) => {
    table.onChangePage(event, newPage);
    filters.setState({ page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    table.onChangeRowsPerPage(event);
    filters.setState({ per_page: newRowsPerPage, page: 1 });
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('investor.dashboard.transactionsPage.title')}
        links={[
          { name: t('investor.dashboard.transactionsPage.dashboard'), href: paths.dashboard.root },
          { name: t('investor.dashboard.transactionsPage.bills') },
          { name: t('investor.dashboard.transactionsPage.transactions') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: { xs: 3, md: 5 } }}>
        <Tabs
          value={filters.state.status || 'all'}
          onChange={(e, value) => {
            filters.setState({ status: value === 'all' ? undefined : value, page: 1 });
          }}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 rgba(145, 158, 171, 0.08)`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label variant="soft" color={tab.color}>
                  {tab.value === 'all'
                    ? transactions.length
                    : transactions.filter((ta) => ta.status === tab.value).length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <TransactionTableToolbar
          filters={filters}
          dateError={!!dateError}
          onResetPage={() => filters.setState({ page: 1 })}
        />

        {canReset && (
          <TransactionTableFiltersResult
            filters={filters}
            onResetPage={() => filters.setState({ page: 1 })}
            totalResults={transactionsMeta.total}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Scrollbar>
          <Table sx={{ minWidth: 800 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} rowCount={transactions.length} />

            <TableBody>
              {transactionsLoading ? (
                <TableRow>
                  <TableCell colSpan={TABLE_HEAD.length} align="center">
                    <LoadingScreen
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 5,
                        mb: 5,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ) : transactions.length ? (
                transactions.map((row) => <TransactionTableRow key={row.id} row={row} />)
              ) : (
                <TableNoData notFound />
              )}
            </TableBody>
          </Table>
        </Scrollbar>

        <TablePaginationCustom
          page={table.page}
          count={transactionsMeta.total}
          rowsPerPage={table.rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
