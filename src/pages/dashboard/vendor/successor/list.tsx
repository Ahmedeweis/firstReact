import { Helmet } from 'react-helmet-async';

import { VendorSuccessorListView } from 'src/sections/vendor/successor/view';

// ----------------------------------------------------------------------

export default function VendorSuccessorListPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Successor List</title>
            </Helmet>

            <VendorSuccessorListView />
        </>
    );
}
