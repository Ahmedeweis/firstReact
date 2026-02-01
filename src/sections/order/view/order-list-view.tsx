import type { IOrderItem, IOrderTableFilters } from 'src/types/order';
import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';
import { varAlpha } from 'src/theme/styles';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';
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
import { OrderTableRow } from '../order-table-row';
import { OrderShipDialog } from '../order-ship-dialog';
import { OrderTableToolbar } from '../order-table-toolbar';
import { OrderPaymentDialog } from '../order-payment-dialog';
import { OrderTableFiltersResult } from '../order-table-filters-result';
// ----------------------------------------------------------------------
// Note: STATUS_OPTIONS will be translated in the component
const STATUS_OPTIONS_KEYS = [{ value: 'all', key: 'all' }, ...ORDER_STATUS_OPTIONS.map(opt => ({ value: opt.value, key: opt.value }))];
// Note: TABLE_HEAD will be translated in the component
const TABLE_HEAD_KEYS = [
  { id: 'orderNumber', key: 'orderNumber', width: 88 },
  { id: 'name', key: 'customer' },
  { id: 'createdAt', key: 'date', width: 140 },
  {
    id: 'totalQuantity',
    key: 'items',
    width: 120,
    align: 'center',
  },
  { id: 'totalAmount', key: 'price', width: 140 },
  { id: 'status', key: 'status', width: 110 },
  { id: '', width: 88 },
];
// ----------------------------------------------------------------------
// Helper to get product media URL
const getProductCover = (product: any) => {
  const media = product?.media?.[0]?.file_url;
  if (media && media.trim() !== '') {
    return media.startsWith('http')
      ? media
      : `https://retail-international-network-api.smartleadtech.com/${media}`;
  }
  return '/assets/placeholder.svg';
};
// Transform API data to match the expected format
const transformOrderData = (apiOrder: any): IOrderItem => ({
  id: apiOrder.id.toString(),
  orderNumber: `#${apiOrder.id.toString().padStart(6, '0')}`,
  status: apiOrder.status,
  totalAmount: parseFloat(apiOrder.total),
  subtotal: parseFloat(apiOrder.total),
  totalQuantity: apiOrder.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
  taxes: 0,
  shipping: 0,
  discount: 0,
  createdAt: apiOrder.created_at,
  customer: {
    id: apiOrder.client.id.toString(),
    name: apiOrder.client.name,
    email: apiOrder.client.email,
    avatarUrl: '',
    ipAddress: '',
  },
  items: apiOrder.items.map((item: any) => ({
    id: item.id.toString(),
    name: item.product.name,
    sku: item.product.sku,
    price: parseFloat(item.price),
    quantity: item.quantity,
    coverUrl: getProductCover(item.product),
  })),
  payment: {
    cardType: apiOrder.payment_method,
    cardNumber: '',
  },
  delivery: {
    shipBy: apiOrder.shipping_method,
    speedy: '',
    trackingNumber: apiOrder.shipment?.tracking_number || '',
  },
  shippingAddress: {
    fullAddress: `${apiOrder.shipping_address.address}, ${apiOrder.shipping_address.city}, ${apiOrder.shipping_address.state}, ${apiOrder.shipping_address.country} ${apiOrder.shipping_address.zip}`,
    phoneNumber: '',
  },
  history: {
    orderTime: apiOrder.created_at,
    paymentTime: apiOrder.created_at,
    deliveryTime: apiOrder.created_at,
    completionTime: apiOrder.created_at,
    timeline: [],
  },
});
export function OrderListView() {
  const { t } = useTranslate();
  const table = useTable({ defaultOrderBy: 'orderNumber' });
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shipDialogOpen, setShipDialogOpen] = useState(false);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrderItem | null>(null);
  const [isShipping, setIsShipping] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const filters = useSetState<IOrderTableFilters>({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });
  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(endpoints.order.list);
        if (response.data.success && Array.isArray(response.data.data)) {
          const transformedData = response.data.data.map(transformOrderData);
          setTableData(transformedData);
        } else {
          toast.error(t('order.list.failedToLoad'));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error(t('order.list.failedToLoad'));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });
  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      toast.success(t('order.list.deleteSuccess'));
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );
  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    toast.success(t('order.list.deleteSuccess'));
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);
  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );
  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );
  const handleShipRow = useCallback((order: IOrderItem) => {
    setSelectedOrder(order);
    setShipDialogOpen(true);
  }, []);
  const handleCloseShipDialog = useCallback(() => {
    setShipDialogOpen(false);
    setSelectedOrder(null);
  }, []);
  const handleShipOrder = useCallback(
    async (shippingMethod: string) => {
      if (!selectedOrder) return;
      try {
        setIsShipping(true);
        const response = await axiosInstance.post(
          endpoints.order.ship(selectedOrder.id),
          { shipping_method: shippingMethod },
          {
            headers: {
              'Accept-Language': localStorage.getItem('i18nextLng'),
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('jwt_access_token')}`,
            },
          }
        );
        if (response.data.success) {
          toast.success(t('order.list.orderShippedSuccessfully'));
          // Update the order in the table
          const updatedOrder = transformOrderData(response.data.data);
          setTableData((prev) =>
            prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
          );
          handleCloseShipDialog();
        }
      } catch (error: any) {
        console.error('Error shipping order:', error);
        toast.error(error?.msg || t('order.list.failedToShip'));
      } finally {
        setIsShipping(false);
      }
    },
    [selectedOrder, handleCloseShipDialog]
  );
  const handlePayRow = useCallback((order: IOrderItem) => {
    setSelectedOrder(order);
    setPayDialogOpen(true);
  }, []);
  const handleClosePayDialog = useCallback(() => {
    setPayDialogOpen(false);
    setSelectedOrder(null);
  }, []);
  const handlePayOrder = useCallback(
    async (paymentMethod: string) => {
      if (!selectedOrder) return;
      try {
        setIsPaying(true);
        const response = await axiosInstance.post(
          endpoints.order.pay(selectedOrder.id),
          { payment_method: paymentMethod },
          {
            headers: {
              'Accept-Language': localStorage.getItem('i18nextLng'),
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('jwt_access_token')}`,
            },
          }
        );
        if (response.data.success) {
          toast.success(t('order.list.orderPaidSuccessfully'));
          // Update the order in the table
          const updatedOrder = transformOrderData(response.data.data);
          setTableData((prev) =>
            prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
          );
          handleClosePayDialog();
        }
      } catch (error: any) {
        console.error('Error paying order:', error);
        toast.error(error?.msg || t('order.list.failedToPay'));
      } finally {
        setIsPaying(false);
      }
    },
    [selectedOrder, handleClosePayDialog]
  );
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={t('order.list.heading')}
          links={[
            { name: t('order.list.dashboard'), href: paths.dashboard.root },
            { name: t('order.list.orderLabel'), href: paths.dashboard.order.root },
            { name: t('order.list.listLabel') },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS_KEYS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.key === 'all' ? t('order.list.all') : ORDER_STATUS_OPTIONS.find(opt => opt.value === tab.value)?.label || tab.value}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'completed' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'cancelled' && 'error') ||
                      'default'
                    }
                  >
                    {['completed', 'pending', 'cancelled', 'refunded'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <OrderTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />
          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 444,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD_KEYS.map(head => ({
                      ...head,
                      label: head.key ? t(`order.list.tableHead.${head.key}`) : ''
                    }))}
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
                        <OrderTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onPayRow={() => handlePayRow(row)}
                          onShipRow={() => handleShipRow(row)}
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
        title={t('order.list.delete')}
        content={
          <>
            {t('order.list.deleteConfirm')} <strong> {table.selected.length} </strong> {t('order.list.itemsLabel')}
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
            {t('order.list.delete')}
          </Button>
        }
      />
      <OrderPaymentDialog
        open={payDialogOpen}
        order={selectedOrder}
        onClose={handleClosePayDialog}
        onPay={handlePayOrder}
        isPaying={isPaying}
      />
      <OrderShipDialog
        open={shipDialogOpen}
        order={selectedOrder}
        onClose={handleCloseShipDialog}
        onShip={handleShipOrder}
        isShipping={isShipping}
      />
    </>
  );
}
// ----------------------------------------------------------------------
type ApplyFilterProps = {
  dateError: boolean;
  inputData: IOrderItem[];
  filters: IOrderTableFilters;
  comparator: (a: any, b: any) => number;
};
function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { status, name, startDate, endDate } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.orderNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }
  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.createdAt, startDate, endDate));
    }
  }
  return inputData;
}
