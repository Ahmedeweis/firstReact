import useSWR from 'swr';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';

import { useAuthContext } from 'src/auth/hooks';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { endpoints, fetcher } from 'src/utils/axios';

import { AppWelcome } from 'src/sections/overview/app/app-welcome';
import { AppWidgetSummary } from 'src/sections/overview/app/app-widget-summary';
import { AppNewInvoice } from 'src/sections/overview/app/app-new-invoice';
import { AppAreaInstalled } from 'src/sections/overview/app/app-area-installed';

// ----------------------------------------------------------------------

export function OverviewVendorView() {
    const { user } = useAuthContext();
    const theme = useTheme();
    const { t } = useTranslate();

    // 1. Fetch Products (Total count, matching the logic of Product List view which fetches all)
    // The user mentioned "list products is 2" and saw "Inactive" and "Pending" products.
    // So we should fetch all products without the 'is_published' filter to match the "Product List" count.
    const { data: productsData } = useSWR(
        [endpoints.vendor.product.list, { params: { notPaginated: true } }],
        fetcher
    );

    // 2. Fetch Total Orders (Completed)
    const { data: completedOrdersData } = useSWR(
        [endpoints.vendor.order.list, { params: { status: 'completed', notPaginated: true } }],
        fetcher
    );

    // 3. Fetch All Orders (for Revenue calculation)
    const { data: allOrdersData } = useSWR(
        [endpoints.vendor.order.list, { params: { notPaginated: true } }],
        fetcher
    );

    // 4. Fetch Recent Orders (Invoices)
    const { data: recentOrdersData } = useSWR(
        [endpoints.vendor.order.list, { params: { per_page: 5 } }],
        fetcher
    );

    // 5. Fetch Referral Tree for Total Clients (Members)
    const { data: referralTreeData } = useSWR(endpoints.vendor.referral.tree, fetcher);


    // Calculate Total Products (Total available in list)
    const totalActiveProducts = productsData?.data?.length || 0;

    // Calculate Total Orders
    const totalOrders = completedOrdersData?.meta?.total || completedOrdersData?.data?.length || 0;

    // Calculate Total Revenue
    const totalRevenue = allOrdersData?.data?.reduce((acc: number, order: any) => acc + Number(order.total_price || 0), 0) || 0;

    // Calculate Total Clients (Members from Referral Tree)
    // Logic adapted from vendor-referral-tree-view.tsx
    const calculateTotalMembers = (data: any) => {
        if (!data) return 0;
        const { level1, level2, level3 } = data?.data || data || {};
        return (level1?.length || 0) + (level2?.length || 0) + (level3?.length || 0);
    };

    const totalClients = calculateTotalMembers(referralTreeData);


    // Map Recent Orders to Invoice Table Format
    const recentInvoices = recentOrdersData?.data?.map((order: any) => ({
        id: order.id,
        invoiceNumber: order.code || `#${order.id}`,
        category: 'Order',
        price: Number(order.total_price || 0),
        status: order.status || 'pending',
    })) || [];


    return (
        <DashboardContent maxWidth="xl">
            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    <AppWelcome
                        title={`Welcome back 👋 \n ${user?.name || user?.displayName}`}
                        description="Here's what's happening with your store today. Check your latest status and updates."
                        action={
                            <button style={{ backgroundColor: theme.palette.primary.main, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                                Go Now
                            </button>
                        }
                    />
                </Grid>

                <Grid xs={12} md={4}>
                    <AppWidgetSummary
                        title="Total Products"
                        percent={0}
                        total={totalActiveProducts}
                        chart={{
                            series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                        }}
                    />
                </Grid>

                <Grid xs={12} md={4}>
                    <AppWidgetSummary
                        title="Total Orders"
                        percent={0}
                        total={totalOrders}
                        chart={{
                            colors: [theme.palette.info.light, theme.palette.info.main],
                            series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
                        }}
                    />
                </Grid>

                <Grid xs={12} md={4}>
                    <AppWidgetSummary
                        title="Total Revenue"
                        percent={0}
                        total={totalRevenue}
                        chart={{
                            colors: [theme.palette.warning.light, theme.palette.warning.main],
                            series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
                        }}
                    />
                </Grid>

                <Grid xs={12} md={4}>
                    <AppWidgetSummary
                        title="Total Clients (Members)"
                        percent={0}
                        total={totalClients} // count from referral tree
                        chart={{
                            colors: [theme.palette.error.light, theme.palette.error.main],
                            series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                    {/* Sales Performance Widget removed as per user request (mock data) */}
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <AppNewInvoice
                        title="Recent Invoices"
                        tableData={recentInvoices}
                        headLabel={[
                            { id: 'id', label: 'Order ID' },
                            { id: 'category', label: 'Type' },
                            { id: 'price', label: 'Price' },
                            { id: 'status', label: 'Status' },
                            { id: '' },
                        ]}
                    />
                </Grid>
            </Grid>
        </DashboardContent>
    );
}
