import type { ICategory } from 'src/types/category';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  row: ICategory;
  selected: boolean;
  onSelectRow: () => void;
  onViewRow: () => void;
};

export function CategoryTableRow({ row, selected, onSelectRow, onViewRow }: Props) {
  const statusColor =
    (row.status === 'active' && 'success') || (row.status === 'inactive' && 'error') || 'warning';

  return (
    <TableRow hover selected={selected} sx={{ cursor: 'pointer' }} onClick={onViewRow}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={(e) => {
            e.stopPropagation();
            onSelectRow();
          }}
        />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={row.name}
          src={row.cover || undefined}
          variant="rounded"
          sx={{ width: 48, height: 48, mr: 2 }}
        >
          {row.name.charAt(0).toUpperCase()}
        </Avatar>

        <Box>
          <Box sx={{ fontWeight: 'medium' }}>{row.name}</Box>
          <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            {row.description?.slice(0, 50)}
            {row.description && row.description.length > 50 && '...'}
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Label variant="soft" color={statusColor}>
          {row.status}
        </Label>
      </TableCell>

      <TableCell>
        {row.parent_id ? (
          <Chip label={`Parent: ${row.parent_id}`} size="small" variant="outlined" />
        ) : (
          <Chip label="Root Category" size="small" color="primary" variant="outlined" />
        )}
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="View Details">
          <IconButton
            color="inherit"
            onClick={(e) => {
              e.stopPropagation();
              onViewRow();
            }}
          >
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
