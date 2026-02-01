import { Helmet } from 'react-helmet-async';

import { VendorOrderListView } from 'src/sections/vendor/order/view';

// ----------------------------------------------------------------------

export default function VendorOrderListPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Vendor Order List</title>
            </Helmet>

            <VendorOrderListView />
        </>
    );
}
