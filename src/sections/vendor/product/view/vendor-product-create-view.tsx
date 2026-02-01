import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { VendorProductNewEditForm } from '../vendor-product-new-edit-form';

// ----------------------------------------------------------------------

export function VendorProductCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Create a new product"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Product', href: paths.dashboard.vendor.product.root },
                    { name: 'New product' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <VendorProductNewEditForm />
        </DashboardContent>
    );
}
