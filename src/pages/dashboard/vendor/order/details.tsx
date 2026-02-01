import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { VendorOrderDetailsView } from 'src/sections/vendor/order/view';

// ----------------------------------------------------------------------

export default function VendorOrderDetailsPage() {
    const params = useParams();

    const { id } = params;

    return (
        <>
            <Helmet>
                <title> Dashboard: Order Details</title>
            </Helmet>

            <VendorOrderDetailsView id={`${id}`} />
        </>
    );
}
