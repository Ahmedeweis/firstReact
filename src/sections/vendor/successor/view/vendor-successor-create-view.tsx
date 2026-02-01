import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { VendorSuccessorNewEditForm } from '../vendor-successor-new-edit-form';

// ----------------------------------------------------------------------

export function VendorSuccessorCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Add New Successor"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Successor', href: paths.dashboard.vendor.successor.root },
                    { name: 'New' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <VendorSuccessorNewEditForm />
        </DashboardContent>
    );
}
