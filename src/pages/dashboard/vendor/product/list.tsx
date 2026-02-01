import { Helmet } from 'react-helmet-async';

import { VendorProductListView } from 'src/sections/vendor/product/view';

// ----------------------------------------------------------------------

export default function VendorProductListPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Vendor Product List</title>
            </Helmet>

            <VendorProductListView />
        </>
    );
}
