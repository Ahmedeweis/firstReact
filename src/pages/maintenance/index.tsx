import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';


// ----------------------------------------------------------------------

const metadata = { title: `Maintenance - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {/* <MaintenanceView /> */}
      Maintenance page is under construction. Please check back later.
    </>
  );
}
