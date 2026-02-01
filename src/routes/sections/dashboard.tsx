import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));

// Investor
const InvestorTransactionsPage = lazy(() => import('src/pages/dashboard/investor/transactions'));
const InvestorContactUsPage = lazy(() => import('src/pages/dashboard/investor/contact-us'));
const InvestorProfitRequestPage = lazy(
  () => import('src/pages/dashboard/investor/profit-requests')
);
const InvestorPaymentPage = lazy(() => import('src/pages/dashboard/investor/payment'));

// Order
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// Product
const ProductShopPage = lazy(() => import('src/pages/dashboard/product/shop'));
const ProductCartPage = lazy(() => import('src/pages/dashboard/product/cart'));
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
// Invoice
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));

// Vendor
const VendorProductListPage = lazy(() => import('src/pages/dashboard/vendor/product/list'));
const VendorProductCreatePage = lazy(() => import('src/pages/dashboard/vendor/product/new'));
const VendorProductEditPage = lazy(() => import('src/pages/dashboard/vendor/product/edit'));
const VendorOrderListPage = lazy(() => import('src/pages/dashboard/vendor/order/list'));
const VendorOrderDetailsPage = lazy(() => import('src/pages/dashboard/vendor/order/details'));
const VendorSuccessorListPage = lazy(() => import('src/pages/dashboard/vendor/successor/list'));
const VendorSuccessorCreatePage = lazy(() => import('src/pages/dashboard/vendor/successor/new'));
const VendorSuccessorEditPage = lazy(() => import('src/pages/dashboard/vendor/successor/edit'));
const VendorReferralTreePage = lazy(() => import('src/pages/dashboard/vendor/referral/tree'));
const VendorProfilePage = lazy(() => import('src/pages/dashboard/vendor/profile'));
const VendorListPage = lazy(() => import('src/pages/dashboard/vendor/list'));

// Category
const CategoryListPage = lazy(() => import('src/pages/dashboard/category/list'));
// Client
const ClientPaymentMethodsPage = lazy(() => import('src/pages/dashboard/client/payment'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'investor/transactions',
        element: <InvestorTransactionsPage />,
      },
      {
        path: 'investor/contact-us',
        element: <InvestorContactUsPage />,
      },
      {
        path: 'investor/profit-requests',
        element: <InvestorProfitRequestPage />,
      },
      {
        path: 'investor/payments',
        element: <InvestorPaymentPage />,
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'vendor',
        children: [
          { element: <VendorListPage />, index: true },
          { path: 'list', element: <VendorListPage /> },
          { path: 'list', element: <VendorListPage /> },
          {
            path: 'product',
            children: [
              { element: <VendorProductListPage />, index: true },
              { path: 'new', element: <VendorProductCreatePage /> },
              { path: ':id/edit', element: <VendorProductEditPage /> },
            ],
          },
          {
            path: 'order',
            children: [
              { element: <VendorOrderListPage />, index: true },
              { path: ':id', element: <VendorOrderDetailsPage /> },
            ],
          },
          {
            path: 'successor',
            children: [
              { element: <VendorSuccessorListPage />, index: true },
              { path: 'new', element: <VendorSuccessorCreatePage /> },
              { path: ':id/edit', element: <VendorSuccessorEditPage /> },
            ],
          },
          {
            path: 'referral',
            children: [
              { element: <VendorReferralTreePage />, index: true },
            ],
          },
        ],
      },
      {
        path: 'category',
        children: [
          { element: <CategoryListPage />, index: true },
          { path: 'list', element: <CategoryListPage /> },
        ],
      },
      {
        path: 'client',
        children: [
          {
            path: 'payment-methods',
            element: <ClientPaymentMethodsPage />,
          },
        ],
      },
      {
        path: 'product',
        children: [
          { path: 'shop', element: <ProductShopPage /> },
          { path: 'cart', element: <ProductCartPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
    ],
  },
];
