import useSWR from 'swr';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { VendorSuccessorNewEditForm } from '../vendor-successor-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
    id: string;
};

export function VendorSuccessorEditView({ id }: Props) {
    const { data: currentSuccessor } = useSWR(endpoints.vendor.successor.details(id), fetcher);

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Edit Successor"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Successor', href: paths.dashboard.vendor.successor.root },
                    { name: 'Edit' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <VendorSuccessorNewEditForm currentSuccessor={currentSuccessor?.data} />
        </DashboardContent>
    );
}
