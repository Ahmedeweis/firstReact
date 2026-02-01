import type { Transaction } from 'src/types/investor/transactions';

import { Typography } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fDate, fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
  row: Transaction;
};

export function TransactionTableRow({ row }: Props) {
  const { t } = useTranslate();
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2" noWrap>
          #{row.id}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2">{fDate(row.created_at)}</Typography>
        <Typography variant="caption" color="text.secondary">
          {fTime(row.created_at)}
        </Typography>
      </TableCell>

      <TableCell>{row.amount}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'pending' && 'warning') ||
            (row.status === 'failed' && 'error') ||
            'success'
          }
        >
          {t(`investor.dashboard.transactionsPage.transactionTable.statusValues.${row.status}`)}
        </Label>
      </TableCell>

      <TableCell>
        <Label color="default">
          {t(`investor.dashboard.transactionsPage.transactionTable.typeValues.${row.type}`)}
        </Label>
      </TableCell>
    </TableRow>
  );
}
