import { Helmet } from 'react-helmet-async';

import { VendorProductCreateView } from 'src/sections/vendor/product/view';

// ----------------------------------------------------------------------

export default function VendorProductCreatePage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Create a new product</title>
            </Helmet>

            <VendorProductCreateView />
        </>
    );
}
