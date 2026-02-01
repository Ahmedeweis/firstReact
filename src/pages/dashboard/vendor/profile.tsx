import { Helmet } from 'react-helmet-async';

import { VendorProfileView } from 'src/sections/vendor/profile/view';

// ----------------------------------------------------------------------

export default function VendorProfilePage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Vendor Profile</title>
            </Helmet>

            <VendorProfileView />
        </>
    );
}
