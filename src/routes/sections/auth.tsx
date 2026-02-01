import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthCenteredLayout } from 'src/layouts/auth-centered';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';


// ----------------------------------------------------------------------

/** **************************************
 * Centered layout
 *************************************** */
const CenteredLayout = {
  SignInPage: lazy(() => import('src/pages/auth/sign-in')),
  SignUpVendorPage: lazy(() => import('src/pages/auth/vendor/sign-up')),
  SignUpClientPage: lazy(() => import('src/pages/auth/client/sign-up')),
  SignUpInvestorPage: lazy(() => import('src/pages/auth/investor/sign-up')),
  VerifyPage: lazy(() => import('src/pages/auth/verify')),
  ResetPasswordPage: lazy(() => import('src/pages/auth/reset-password')),
  UpdatePasswordPage: lazy(() => import('src/pages/auth/update-password')),
};

const authCentered = {
  path: '',
  element: (
    <GuestGuard>

      <AuthCenteredLayout>
        <Outlet />
      </AuthCenteredLayout>
    </GuestGuard>
  ),
  children: [
    { path: 'sign-in', element: <CenteredLayout.SignInPage /> },
    { path: 'vendor/sign-up', element: <CenteredLayout.SignUpVendorPage /> },
    { path: 'client/sign-up', element: <CenteredLayout.SignUpClientPage /> },
    { path: 'investor/sign-up', element: <CenteredLayout.SignUpInvestorPage /> },
    { path: 'verify', element: <CenteredLayout.VerifyPage /> },
    { path: 'reset-password', element: <CenteredLayout.ResetPasswordPage /> },
    { path: 'update-password', element: <CenteredLayout.UpdatePasswordPage /> },
  ],
};
// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [ authCentered],
  },
];
