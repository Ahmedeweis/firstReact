import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

// import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
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

import { VendorOrderTableRow } from '../vendor-order-table-row';

// ----------------------------------------------------------------------


export function VendorOrderListView() {
    const { t } = useTranslate();
    const table = useTable({ defaultOrderBy: 'orderNumber' });

    const TABLE_HEAD = [
        { id: 'orderNumber', label: t('order.list.tableHead.orderNumber'), width: 88 },
        { id: 'customer', label: t('order.list.tableHead.customer') },
        { id: 'date', label: t('order.list.tableHead.date'), width: 140 },
        { id: 'items', label: t('order.list.tableHead.items'), width: 120, align: 'center' },
        { id: 'price', label: t('order.list.tableHead.price'), width: 140 },
        { id: 'status', label: t('order.list.tableHead.status'), width: 110 },
        { id: '', width: 88 },
    ];

    const router = useRouter();

    const confirm = useBoolean();

    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for display purposes
        const mockData = [
            {
                id: '1',
                orderNumber: '#ORD-1234',
                createdAt: new Date('2023-11-20T10:30:00'),
                status: 'completed',
                totalAmount: 250.00,
                customer: {
                    name: 'Ahmed Mohamed',
                    email: 'ahmed@example.com',
                    avatarUrl: null
                },
                items: [
                    { name: 'Product A', quantity: 2, price: 50 },
                    { name: 'Product B', quantity: 1, price: 150 }
                ],
                totalQuantity: 3
            },
            {
                id: '2',
                orderNumber: '#ORD-5678',
                createdAt: new Date('2023-11-21T14:15:00'),
                status: 'pending',
                totalAmount: 120.50,
                customer: {
                    name: 'Sarah Johnson',
                    email: 'sarah@example.com',
                    avatarUrl: null
                },
                items: [
                    { name: 'Product C', quantity: 1, price: 120.50 }
                ],
                totalQuantity: 1
            },
            {
                id: '3',
                orderNumber: '#ORD-9012',
                createdAt: new Date('2023-11-22T09:00:00'),
                status: 'cancelled',
                totalAmount: 45.00,
                customer: {
                    name: 'Khaled Ali',
                    email: 'khaled@example.com',
                    avatarUrl: null
                },
                items: [
                    { name: 'Product D', quantity: 3, price: 15 }
                ],
                totalQuantity: 3
            },
            {
                id: '4',
                orderNumber: '#ORD-3456',
                createdAt: new Date('2023-11-23T16:45:00'),
                status: 'processing',
                totalAmount: 340.00,
                customer: {
                    name: 'Layla Hassan',
                    email: 'layla@example.com',
                    avatarUrl: null
                },
                items: [
                    { name: 'Product E', quantity: 2, price: 170 }
                ],
                totalQuantity: 2
            }
        ];

        setTableData(mockData);
        setLoading(false);
    }, []);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
    });

    // const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

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
                heading={t('order.list.title')}
                links={[
                    { name: t('order.breadcrumbs.dashboard'), href: paths.dashboard.root },
                    { name: t('order.breadcrumbs.order'), href: paths.dashboard.vendor.order.root },
                    { name: t('order.breadcrumbs.list') },
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
                                dataFiltered.map((row: any) => row.id)
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
                                            dataFiltered.map((row: any) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row: any) => (
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
