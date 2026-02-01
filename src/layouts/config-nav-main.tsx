
import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData = [
  { title: 'Home', path: '/', icon: <Iconify width={22} icon="solar:home-2-bold-duotone" /> },
  {
    title: 'Sign up as a vendor',
    path: paths.auth.SignUpVendor,
    icon: <Iconify width={22} icon="solar:dashboard-bold-duotone" />,
  },
  {
    title: 'Sign up as a client',
    path: paths.auth.SignUpClient,
    icon: <Iconify width={22} icon="solar:dashboard-bold-duotone" />,
  },
  {
    title: 'Sign up as a investor',
    path: paths.auth.SignUpInvestor,
    icon: <Iconify width={22} icon="solar:dashboard-bold-duotone" />,
  },
  // {
  //   title: 'Pages',
  //   path: '/pages',
  //   icon: <Iconify width={22} icon="solar:file-bold-duotone" />,
  //   children: [
  //     {
  //       subheader: 'Other',
  //       items: [
  //         { title: 'About us', path: paths.about },
  //         { title: 'Contact us', path: paths.contact },
  //         { title: 'Maintenance', path: paths.maintenance },
  //       ],
  //     },
  //     // {
  //     //   subheader: 'Error',
  //     //   items: [
  //     //     { title: 'Page 403', path: paths.page403 },
  //     //     { title: 'Page 404', path: paths.page404 },
  //     //     { title: 'Page 500', path: paths.page500 },
  //     //   ],
  //     // },
  //     { subheader: 'Dashboard', items: [{ title: 'Dashboard', path: CONFIG.auth.redirectPath }] },
  //   ],
  // },
];
