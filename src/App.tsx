import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet
} from "react-router-dom";

import LoginComponent from './routables/auth/login/Login';
import AuthComponent from './routables/auth/Auth';
import { FC, ReactElement, useEffect, useState } from "react";
import AuthSvc from './services/authentication.service';
import CustomersComponent from "./routables/customers/Customers";
import { User } from "./models/user.model";
import ActiveOrders from "./routables/customers/active-orders/ActiveOrders";
import RegisterComponent from "./routables/auth/register/Register";
import DeliveryPartnersComponent from "./routables/delivery-partners/DeliveryPartners";
import DeliveryPartnersActiveOrdersComponent from "./routables/delivery-partners/active-orders/ActiveOrders";

const App: FC = (): ReactElement => {

  const [user, setUser] = useState({});

  useEffect(() => {
    
    const $user = AuthSvc.observeUser().subscribe(
      u => {
        setUser(u);
      }
    );

    return () => {
      $user.unsubscribe();
    };
  }, []);

  const AuthRoute = () => {
    return (
      <AuthComponent />
    );
  }
  
  const LoginRoute = () => {
    return (
      <LoginComponent />
    );
  }
  
  const RegisterRoute = () => {
    return (
      <RegisterComponent />
    );
  }
  
  const CustomersRoute = () => {
    return (
      <CustomersComponent user={user as User} />
    );
  }

  const ActiveCustomerOrdersRoute = () => {
    return (
      <ActiveOrders user={user as User} />
    );
  };
  
  const PartnersRoute = () => {
    return (
      <DeliveryPartnersComponent user={user as User} />
    );
  };

  const ActiveDeliveryPartnerOrdersRoute = () => {
    return (
      <DeliveryPartnersActiveOrdersComponent user={user as User} />
    );
  };

  const ProtectedRoute = ({props, children}) => {
    if (!props.user || props.user.account?.type !== props.requiredType) {
      return <Navigate to={props.redirectPath} replace />
    }
    return children ? children : <Outlet />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route path="login" element={<LoginRoute />} />
          <Route path="register" element={<RegisterRoute />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Route>

        <Route path="/customers" element={<CustomersRoute />}>
          <Route path="active-orders" element={<ActiveCustomerOrdersRoute />} />
          <Route path="/customers" element={<Navigate to="active-orders" />} />
        </Route>

        <Route path="/partners" element={<PartnersRoute />}>
        <Route path="active-orders" element={<ActiveDeliveryPartnerOrdersRoute />} />
        <Route path="/partners" element={<Navigate to="active-orders" />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;