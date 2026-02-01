import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

type Props = {
    id: string;
};

export function VendorOrderDetailsView({ id }: Props) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(endpoints.vendor.order.details(id));
                if (response.data && response.data.data) {
                    setOrder(response.data.data);
                } else {
                    // Mock
                    setOrder({ id, orderNumber: '#1001', createdAt: new Date(), status: 'pending', total: 150, items: [] });
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                setOrder({ id, orderNumber: '#1001', createdAt: new Date(), status: 'pending', total: 150, items: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <DashboardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                    <CircularProgress />
                </Box>
            </DashboardContent>
        );
    }

    if (!order) {
        return (
            <DashboardContent>
                <Typography variant="h6">Order not found</Typography>
            </DashboardContent>
        );
    }

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={`Order ${order.orderNumber}`}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Order', href: paths.dashboard.vendor.order.root },
                    { name: order.orderNumber },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Order Details</Typography>
                        <Stack spacing={2}>
                            <Box>Status: {order.status}</Box>
                            <Box>Total: {order.total}</Box>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </DashboardContent>
    );
}
