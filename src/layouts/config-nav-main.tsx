
import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  return [
    { title: t('common.home'), path: '/', icon: <Iconify width={22} icon="solar:home-2-bold-duotone" /> },
    {
      title: t('auth.signUpVendorTitle'),
      path: paths.auth.SignUpVendor,
      icon: <Iconify width={22} icon="solar:dashboard-bold-duotone" />,
    },
    {
      title: t('auth.signUpClientTitle'),
      path: paths.auth.SignUpClient,
      icon: <Iconify width={22} icon="solar:dashboard-bold-duotone" />,
    },
    {
      title: t('auth.signUpInvestorTitle'),
      path: paths.auth.SignUpInvestor,
      icon: <Iconify width={22} icon="solar:dashboard-bold-duotone" />,
    },
  ];
}
