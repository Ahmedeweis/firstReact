import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useGetPaymentMethods } from 'src/actions/investor';

import { PaymentView } from 'src/sections/investor/payment/view';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------


export default function Page() {
  const { user } = useAuthContext();
  const { paymentMethods } = useGetPaymentMethods();
  console.log(paymentMethods);
  return (
    <RoleBasedGuard currentRole={user?.type} acceptRoles={['investor']} hasContent>
      <Helmet>
        <title>{`Payment - ${CONFIG.site.name}`} </title>
      </Helmet>

      <PaymentView />
    </RoleBasedGuard>
  );
}
