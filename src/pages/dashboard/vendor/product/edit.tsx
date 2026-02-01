import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { VendorProductEditView } from 'src/sections/vendor/product/view';

// ----------------------------------------------------------------------

export default function VendorProductEditPage() {
    const params = useParams();

    const { id } = params;

    return (
        <>
            <Helmet>
                <title> Dashboard: Product Edit</title>
            </Helmet>

            <VendorProductEditView id={`${id}`} />
        </>
    );
}
