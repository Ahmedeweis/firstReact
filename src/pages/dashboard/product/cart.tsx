import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductCartView } from 'src/sections/product/view/product-cart-view';

// ----------------------------------------------------------------------

const metadata = { title: `Shopping Cart | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <ProductCartView />
    </>
  );
}

