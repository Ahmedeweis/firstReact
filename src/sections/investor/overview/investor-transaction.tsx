import type { Transaction } from 'src/types/investor/overview';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';

import { fDate, fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetInvestorOverview } from 'src/actions/investor/overview';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { LoadingScreen } from 'src/components/loading-screen';

import { TransactionStatus } from 'src/types/investor/overview';

// ----------------------------------------------------------------------

export function InvestorTransaction() {
  const { recentTransactions, isLoading } = useGetInvestorOverview();
  const { t, i18n } = useTranslate();

  const isArabic = i18n.language === 'ar';

  const headLabel = [
    { id: 'id', label: t('investor.dashboard.dashboardOverview.transaction.transactionId') },
    { id: 'created_at', label: t('investor.dashboard.dashboardOverview.transaction.createAt') },
    { id: 'amount', label: t('investor.dashboard.dashboardOverview.transaction.amount') },
    { id: 'status', label: t('investor.dashboard.dashboardOverview.transaction.status') },
    { id: 'type', label: t('investor.dashboard.dashboardOverview.transaction.type') },
  ];

  return (
    <Card>
      <CardHeader
        title={t('investor.dashboard.dashboardOverview.transaction.title')}
        sx={{ mb: 3 }}
      />

      <Scrollbar sx={{ minHeight: 402 }}>
        <Table sx={{ minWidth: 680 }}>
          <TableHeadCustom headLabel={headLabel} />

          <TableBody>
            {isLoading && (
              <LoadingScreen
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 20,
                  mx: 20,
                }}
              />
            )}
            {recentTransactions.length ? (
              recentTransactions.map((row) => <RowItem key={row.id} row={row} />)
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  p: 3,
                  color: 'text.secondary',
                  alignItems: 'center',
                }}
              >
                {t('investor.dashboard.dashboardOverview.transaction.noTransactions')}
              </Box>
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={
            <Iconify
              icon={isArabic ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'}
              width={16}
              height={16}
            />
          }
          href={paths.dashboard.investor.transactions}
        >
          {t('investor.dashboard.dashboardOverview.transaction.viewAll')}
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowItemProps = {
  row: Transaction;
};

function RowItem({ row }: RowItemProps) {
  const { t } = useTranslate();

  return (
    <TableRow>
      <TableCell>{row.id}</TableCell>

      <TableCell sx={{ display: 'flex', flexDirection: 'column' }}>
        {fDate(row.created_at)}
        <Box sx={{ color: 'text.secondary', fontSize: 12 }}>{fTime(row.created_at)}</Box>
      </TableCell>

      <TableCell>{row.amount}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === TransactionStatus.Pending && 'warning') ||
            (row.status === TransactionStatus.Failed && 'error') ||
            'success'
          }
        >
          <Box component="span" sx={{ fontSize: 12 }}>
            {t(`investor.dashboard.dashboardOverview.transaction.statusValues.${row.status}`)}
          </Box>
        </Label>
      </TableCell>

      <TableCell>
        <Box component="span" sx={{ fontSize: 12 }}>
          {t(`investor.dashboard.dashboardOverview.transaction.typeValues.${row.type}`)}
        </Box>
      </TableCell>
    </TableRow>
  );
}
