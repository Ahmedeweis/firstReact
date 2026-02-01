import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
    row: any; // Replace with IVendorProductItem type
    selected: boolean;
    onSelectRow: VoidFunction;
    onDeleteRow: VoidFunction;
    onEditRow: VoidFunction;
};

export function VendorProductTableRow({ row, selected, onSelectRow, onDeleteRow, onEditRow }: Props) {
    const { name, regular_price, sale_price, images } = row;

    const confirm = useBoolean();

    const popover = usePopover();

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={name} src={images?.[0]?.url || ''} variant="rounded" sx={{ width: 64, height: 64, mr: 2 }} />

                    <ListItemText
                        primary={
                            <Link noWrap color="inherit" variant="subtitle2" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                                {name}
                            </Link>
                        }
                    />
                </TableCell>

                <TableCell>{row.sku}</TableCell>

                <TableCell>{row.category?.name}</TableCell>

                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (row.category?.status === 'active' && 'success') ||
                            (row.category?.status === 'inactive' && 'error') ||
                            'default'
                        }
                    >
                        {row.category?.status}
                    </Label>
                </TableCell>

                <TableCell>{row.stock}</TableCell>

                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (row.stock_status === 'instock' && 'success') ||
                            (row.stock_status === 'in_stock' && 'success') ||
                            (row.stock_status === 'low_stock' && 'warning') ||
                            (row.stock_status === 'outofstock' && 'error') ||
                            (row.stock_status === 'out_of_stock' && 'error') ||
                            'default'
                        }
                    >
                        {row.stock_status === 'in_stock' ? 'In Stock' : row.stock_status === 'out_of_stock' ? 'Out of Stock' : row.stock_status}
                    </Label>
                </TableCell>

                <TableCell>
                    <Box component="div" sx={{ typography: 'body2', color: 'text.secondary' }}>
                        <Box component="span" sx={{ textDecoration: sale_price ? 'line-through' : 'none', mr: 1 }}>
                            {regular_price}
                        </Box>
                        {sale_price && (
                            <Box component="span" sx={{ color: 'error.main' }}>
                                {sale_price}
                            </Box>
                        )}
                    </Box>
                </TableCell>



                <TableCell align="right">
                    <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                <MenuItem
                    onClick={() => {
                        popover.onClose();
                        // View logic - maybe reuse edit or details
                        onEditRow();
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    View
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        onEditRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
