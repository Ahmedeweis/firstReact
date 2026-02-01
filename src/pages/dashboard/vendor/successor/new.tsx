import { Helmet } from 'react-helmet-async';

import { VendorSuccessorCreateView } from 'src/sections/vendor/successor/view';

// ----------------------------------------------------------------------

export default function VendorSuccessorCreatePage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: New Successor</title>
            </Helmet>

            <VendorSuccessorCreateView />
        </>
    );
}
