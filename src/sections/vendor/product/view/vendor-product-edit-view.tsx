import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { VendorProductNewEditForm } from '../vendor-product-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
    id: string;
};

export function VendorProductEditView({ id }: Props) {
    // Mock current product data
    const currentProduct = {
        id,
        name: 'Sample Product',
        description: 'Sample Description',
        code: 'CODE123',
        sku: 'SKU123',
        quantity: 10,
        price: 100,
        category: 'electronics',
        tags: ['Tag1'],
    };

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Edit Product"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Product', href: paths.dashboard.vendor.product.root },
                    { name: currentProduct?.name },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <VendorProductNewEditForm currentProduct={currentProduct} />
        </DashboardContent>
    );
}
