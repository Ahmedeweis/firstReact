import { Helmet } from 'react-helmet-async';

import { VendorReferralTreeView } from 'src/sections/vendor/referral/view';

// ----------------------------------------------------------------------

export default function VendorReferralTreePage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Referral Tree</title>
            </Helmet>

            <VendorReferralTreeView />
        </>
    );
}
