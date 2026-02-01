import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    rowInPage,
    TableNoData,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';

import { VendorOrderTableRow } from '../vendor-order-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'orderNumber', label: 'Order', width: 88 },
    { id: 'customer', label: 'Customer' },
    { id: 'date', label: 'Date', width: 140 },
    { id: 'items', label: 'Items', width: 120, align: 'center' },
    { id: 'price', label: 'Price', width: 140 },
    { id: 'status', label: 'Status', width: 110 },
    { id: '', width: 88 },
];

export function VendorOrderListView() {
    const table = useTable({ defaultOrderBy: 'orderNumber' });

    const router = useRouter();

    const confirm = useBoolean();

    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                // Using the vendor endpoint
                const response = await axiosInstance.get(endpoints.vendor.order.list);
                if (response.data && Array.isArray(response.data.data)) {
                    // We might need to transform data here if it differs from admin
                    setTableData(response.data.data);
                } else {
                    // Mock data if API is empty or fails for now
                    setTableData([
                        { id: '1', orderNumber: '#1001', createdAt: new Date(), status: 'pending', total: 150, customer: { name: 'John Doe' }, items: [{ quantity: 2 }] }
                    ]);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setTableData([
                    { id: '1', orderNumber: '#1001', createdAt: new Date(), status: 'pending', total: 150, customer: { name: 'John Doe' }, items: [{ quantity: 2 }] }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
    });

    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

    const notFound = !dataFiltered.length;

    const handleViewRow = useCallback(
        (id: string) => {
            router.push(paths.dashboard.vendor.order.details(id));
        },
        [router]
    );

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Order List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Order', href: paths.dashboard.vendor.order.root },
                    { name: 'List' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
                <Box sx={{ position: 'relative' }}>
                    <TableSelectedAction
                        dense={table.dense}
                        numSelected={table.selected.length}
                        rowCount={dataFiltered.length}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                dataFiltered.map((row) => row.id)
                            )
                        }
                        action={
                            <Tooltip title="Delete">
                                <IconButton color="primary" onClick={confirm.onTrue}>
                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                </IconButton>
                            </Tooltip>
                        }
                    />

                    <Scrollbar sx={{ minHeight: 444 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 444 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
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
                                            dataFiltered.map((row) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row) => (
                                            <VendorOrderTableRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onViewRow={() => handleViewRow(row.id)}
                                            />
                                        ))}

                                    <TableEmptyRows
                                        height={table.dense ? 56 : 56 + 20}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                                    />

                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        )}
                    </Scrollbar>
                </Box>

                <TablePaginationCustom
                    page={table.page}
                    dense={table.dense}
                    count={dataFiltered.length}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    onChangeDense={table.onChangeDense}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Card>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete <strong> {table.selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            confirm.onFalse();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </DashboardContent>
    );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }: any) {
    const stabilizedThis = inputData.map((el: any, index: any) => [el, index]);

    stabilizedThis.sort((a: any, b: any) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el: any) => el[0]);

    return inputData;
}
