import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { VendorProfileGeneral } from '../vendor-profile-general';

// ----------------------------------------------------------------------

const TABS = [
    { value: 'general', label: 'General', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
];

// ----------------------------------------------------------------------

export function VendorProfileView() {
    const [currentTab, setCurrentTab] = useState('general');

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Account"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Vendor', href: paths.dashboard.vendor.root },
                    { name: 'Profile' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Tabs
                value={currentTab}
                onChange={handleChangeTab}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            >
                {TABS.map((tab) => (
                    <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
                ))}
            </Tabs>

            {currentTab === 'general' && <VendorProfileGeneral />}
        </DashboardContent>
    );
}
