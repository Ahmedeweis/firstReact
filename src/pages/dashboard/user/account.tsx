import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { AccountView } from 'src/sections/account/view';

// ----------------------------------------------------------------------



export default function Page() {

  const { t } = useTranslate();
  return (
    <>
      <Helmet>
        <title>{`${t('accountPage.profile')} - ${CONFIG.site.name}`} </title>
      </Helmet>

      <AccountView />
    </>
  );
}
