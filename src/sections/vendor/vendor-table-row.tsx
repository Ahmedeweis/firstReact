import type { IVendor } from 'src/types/vendor';

import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type Props = {
  row: IVendor;
};

export function VendorTableRow({ row }: Props) {
  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={row.name} src={row.avatar || undefined} sx={{ mr: 2 }} />
        {row.name}
      </TableCell>

      <TableCell>{row.id}</TableCell>
    </TableRow>
  );
}
