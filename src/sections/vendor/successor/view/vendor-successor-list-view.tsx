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
import { RouterLink } from 'src/routes/components';

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

import { VendorSuccessorTableRow } from '../vendor-successor-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Name' },
    { id: 'phone', label: 'Phone' },
    { id: 'proof', label: 'Proof ID' },
    { id: '', width: 88 },
];

export function VendorSuccessorListView() {
    const table = useTable();

    const router = useRouter();

    const confirm = useBoolean();

    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuccessors = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(endpoints.vendor.successor.list);
                if (response.data && response.data.data) {
                    // API returns a single object, so we wrap it in an array to display in the table
                    const data = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                    setTableData(data);
                } else {
                    setTableData([]);
                }
            } catch (error: any) {
                console.error('Error fetching successors:', error);
                // If 404, it means no successor exists yet
                if (error?.status === 404 || error?.response?.status === 404) {
                    setTableData([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSuccessors();
    }, []);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
    });

    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

    const notFound = !dataFiltered.length;

    const handleDeleteRow = useCallback(
        async (id: string) => {
            try {
                await axiosInstance.delete(endpoints.vendor.successor.delete(''));
                const deleteRow = tableData.filter((row) => row.id !== id);
                setTableData(deleteRow);
                table.onUpdatePageDeleteRow(dataInPage.length);
            } catch (error) {
                console.error('Error deleting successor:', error);
            }
        },
        [dataInPage.length, table, tableData]
    );

    const handleDeleteRows = useCallback(() => {
        // Implement bulk delete API call here
        const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
        setTableData(deleteRows);
        table.onUpdatePageDeleteRows({
            totalRowsInPage: dataInPage.length,
            totalRowsFiltered: dataFiltered.length,
        });
    }, [dataFiltered.length, dataInPage.length, table, tableData]);

    const handleEditRow = useCallback((id: string) => {
        router.push(paths.dashboard.vendor.successor.edit(id));
    }, [router]);

    return (
        <>
            <DashboardContent>
                <CustomBreadcrumbs
                    heading="Successor List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Successor', href: paths.dashboard.vendor.successor.root },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.vendor.successor.new}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            New Successor
                        </Button>
                    }
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
                                                <VendorSuccessorTableRow
                                                    key={row.id}
                                                    row={row}
                                                    selected={table.selected.includes(row.id)}
                                                    onSelectRow={() => table.onSelectRow(row.id)}
                                                    onDeleteRow={() => handleDeleteRow(row.id)}
                                                    onEditRow={() => handleEditRow(row.id)}
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
            </DashboardContent>

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
                            handleDeleteRows();
                            confirm.onFalse();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
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
