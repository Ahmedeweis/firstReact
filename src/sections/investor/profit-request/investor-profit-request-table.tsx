import type { InvestorProfitRequest } from 'src/types/investor/profit-requests';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';

import { fDate, fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetInvestorProfitRequests } from 'src/actions/investor/profit-request';

import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { TableNoData, TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

export function InvestorProfitRequestTable() {
  const { profitRequests, profitRequestsLoading } = useGetInvestorProfitRequests();
  const { t } = useTranslate();

  const headLabel = [
    { id: 'id', label: 'ID' },
    { id: 'amount', label: t('investor.dashboard.profitRequestPage.profitRequestTable.amount') },
    { id: 'message', label: t('investor.dashboard.profitRequestPage.profitRequestTable.message') },
    {
      id: 'created_at',
      label: t('investor.dashboard.profitRequestPage.profitRequestTable.createdAt'),
    },
  ];

  return (
    <Card>
      <CardHeader
        title={t('investor.dashboard.profitRequestPage.profitRequestTable.title')}
        sx={{ mb: 3 }}
      />

      <Scrollbar>
        <Table sx={{ minWidth: 800 }}>
          <TableHeadCustom headLabel={headLabel} rowCount={profitRequests.length} />

          <TableBody>
            {profitRequestsLoading ? (
              <TableRow>
                <TableCell colSpan={headLabel.length} align="center">
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
            ) : profitRequests.length ? (
              profitRequests.map((row: InvestorProfitRequest) => <RowItem key={row.id} row={row} />)
            ) : (
              <TableNoData notFound />
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowItemProps = {
  row: InvestorProfitRequest;
};

function RowItem({ row }: RowItemProps) {
  return (
    <TableRow>
      <TableCell>{row.id}</TableCell>

      <TableCell>
        <Box component="span" sx={{ fontWeight: 600 }}>
          {row.amount}
        </Box>
      </TableCell>

      <TableCell>{row.message}</TableCell>

      <TableCell sx={{ display: 'flex', flexDirection: 'column' }}>
        {fDate(row.created_at)}
        <Box sx={{ color: 'text.secondary', fontSize: 12 }}>{fTime(row.created_at)}</Box>
      </TableCell>
    </TableRow>
  );
}
