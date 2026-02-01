import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  user: icon('ic-user'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  kanban: icon('ic-kanban'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  category: icon('ic-category'),
  shipment: icon('ic-shipment'),
  branches: icon('ic-branches'),
  orders: icon('ic-orders'),
  bills: icon('ic-bills'),
  products: icon('ic-products'),
  money: icon('ic-banking'),
};

// ----------------------------------------------------------------------

// export const navData = [
//   /**
//    * Overview
//    */
//   {
//     subheader: 'Overview',
//     items: [{ title: 'App', path: paths.dashboard.root, icon: ICONS.dashboard }],
//   },
//   /**
//    * Management
//    */

//   {
//     subheader: 'Management',
//     items: [
//       {
//         title: 'sidebar.vendors-management',
//         path: paths.dashboard.vendorsManagement.root,
//         icon: ICONS.user,
//         children: [
//           { title: 'Profile', path: paths.dashboard.vendorsManagement.root },
//           { title: 'Cards', path: paths.dashboard.vendorsManagement.cards },
//           { title: 'List', path: paths.dashboard.vendorsManagement.list },
//           { title: 'Create', path: paths.dashboard.vendorsManagement.new },
//           { title: 'Edit', path: paths.dashboard.vendorsManagement.demo.edit },
//           { title: 'Account', path: paths.dashboard.vendorsManagement.account },
//         ],
//       },
//       {
//         title: 'sidebar.clients-management',
//         path: paths.dashboard.clientsManagement.root,
//         icon: ICONS.analytics,
//         children: [
//           { title: 'Profile', path: paths.dashboard.clientsManagement.root },
//           { title: 'Cards', path: paths.dashboard.clientsManagement.cards },
//           { title: 'List', path: paths.dashboard.clientsManagement.list },
//           { title: 'Create', path: paths.dashboard.clientsManagement.new },
//           { title: 'Edit', path: paths.dashboard.clientsManagement.demo.edit },
//           { title: 'Account', path: paths.dashboard.clientsManagement.account },
//         ],
//       },
//       {
//         title: 'sidebar.products',
//         path: paths.dashboard.product.root,
//         icon: ICONS.product,
//         children: [
//           { title: 'sidebar.products-List', path: paths.dashboard.product.root },
//           { title: 'sidebar.products-Details', path: paths.dashboard.product.demo.details },
//           { title: 'sidebar.products-Create', path: paths.dashboard.product.new },
//           { title: 'sidebar.products-Edit', path: paths.dashboard.product.demo.edit },
//         ],
//       },
//       { title: 'sidebar.categorize', path: paths.dashboard.root, icon: ICONS.category },
//       { title: 'sidebar.bills', path: paths.dashboard.invoice.root, icon: ICONS.bills },
//       {
//         title: 'sidebar.orders',
//         path: paths.dashboard.order.root,
//         icon: ICONS.orders,
//         children: [
//           { title: 'List', path: paths.dashboard.order.root },
//           { title: 'Details', path: paths.dashboard.order.demo.details },
//         ],
//       },
//       {
//         title: 'sidebar.shipment',
//         path: paths.dashboard.shipment.root,
//         icon: ICONS.shipment,
//         children: [
//           { title: 'List', path: paths.dashboard.shipment.root },
//           { title: 'Details', path: paths.dashboard.shipment.demo.details },
//         ],
//       },
//       { title: 'sidebar.branches', path: paths.dashboard.root, icon: ICONS.branches },
//     ],
//   },
// ];

export const navVendorData = [
  {
    items: [
      { title: 'vendor.sidebar.overview', path: paths.dashboard.root, icon: ICONS.dashboard },
      {
        title: 'vendor.sidebar.products',
        path: paths.dashboard.vendor.product.root,
        icon: ICONS.product,
        children: [
          { title: 'vendor.sidebar.list', path: paths.dashboard.vendor.product.root },
          { title: 'vendor.sidebar.create', path: paths.dashboard.vendor.product.new },
        ],
      },
      {
        title: 'vendor.sidebar.orders',
        path: paths.dashboard.vendor.order.root,
        icon: ICONS.order,
      },
      {
        title: 'vendor.sidebar.successors',
        path: paths.dashboard.vendor.successor.root,
        icon: ICONS.user,
        children: [
          { title: 'vendor.sidebar.list', path: paths.dashboard.vendor.successor.root },
          { title: 'vendor.sidebar.new', path: paths.dashboard.vendor.successor.new },
        ],
      },
      {
        title: 'vendor.sidebar.referral',
        path: paths.dashboard.vendor.referral.root,
        icon: ICONS.analytics,
      },

    ],
  },
];
export const navClientData = [
  {
    items: [
      { title: 'client.sidebar.overview', path: paths.dashboard.root, icon: ICONS.dashboard },
      {
        title: 'client.sidebar.products',
        path: paths.dashboard.product.shop,
        icon: ICONS.products,
      },
      { title: 'client.sidebar.orders', path: paths.dashboard.order.root, icon: ICONS.orders },
      {
        title: 'client.sidebar.paymentMethods',
        path: paths.dashboard.client.paymentMethods,
        icon: ICONS.money,
      },
    ],
  },
];
export const navInvestorData = [
  {
    items: [
      { title: 'investor.sidebar.overview', path: paths.dashboard.root, icon: ICONS.dashboard },
      {
        title: 'investor.sidebar.transactions',
        path: paths.dashboard.investor.transactions,
        icon: ICONS.invoice,
      },
      {
        title: 'investor.sidebar.payments',
        path: paths.dashboard.investor.payments,
        icon: ICONS.money,
      },
      {
        title: 'investor.sidebar.profitRequest',
        path: paths.dashboard.investor.profitRequest,
        icon: ICONS.external,
      },
      {
        title: 'investor.sidebar.contactUs',
        path: paths.dashboard.investor.contactUs,
        icon: ICONS.user,
      },
    ],
  },
];
