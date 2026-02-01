import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { VendorSuccessorEditView } from 'src/sections/vendor/successor/view';

// ----------------------------------------------------------------------

export default function VendorSuccessorEditPage() {
    const params = useParams();

    const { id } = params;

    return (
        <>
            <Helmet>
                <title> Dashboard: Successor Edit</title>
            </Helmet>

            <VendorSuccessorEditView id={`${id}`} />
        </>
    );
}
