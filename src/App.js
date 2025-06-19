
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Layout from './Componets/Layout';
import MemberForm from './Componets/MemberForm';
import MemberTable from './Componets/ShowMemberData';
import PaymentForm from './Componets/PaymentSummary';
import ReceiptTable from './Componets/ReceptTable';
import Dashboard from './Componets/Desboard';
import LoginForm from './Componets/LoginForms';
import YearlySummary from './Componets/YearlySummary';
import Addpayment from './Componets/addPaymentForm';
import AnnualPayment from './Componets/AnnualPaymentRecord';
import Editform from './Componets/EditForm';
import Paymentreceipt from './Componets/PaymentRecipt';
import YearlyList from './Componets/yearlypaymentList';
import CreateUserForm from './Componets/CreateUsersForm';
import ForgotPassword from './Componets/ForgotPassword';
import VerifyOTP from './Componets/VerifyOTP';
import ResetPassword from './Componets/RestPassword';
import UserManagementTable from './Componets/UserManagementTable';

function AppWrapper() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  // Clear session on hard refresh
  useEffect(() => {
    if (performance.navigation.type === 1) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
    }
  }, []);

  const publicRoutes = ['/', '/forgot-password', '/verify-otp', '/reset-password'];
  if (!isLoggedIn && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route element={isLoggedIn ? <Layout /> : <Navigate to="/" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/member-table" element={<MemberTable />} />
        <Route path="/payment-form" element={<PaymentForm />} />
        <Route path="/receipt-table" element={<ReceiptTable />} />
        <Route path="/Yearly-Summary" element={<YearlySummary />} />
        <Route path="/Annual-payment" element={<AnnualPayment />} />
        <Route path="/Payment-Receipt" element={<Paymentreceipt />} />
        <Route path="/Yearl-List" element={<YearlyList />} />

        {/* Admin-Only Routes */}
        {isAdmin ? (
          <>
            <Route path="/member-form" element={<MemberForm />} />
            <Route path="/Add-payment" element={<Addpayment />} />
            <Route path="/Edite-Form" element={<Editform />} />
            <Route path="/create-user" element={<CreateUserForm />} />
            <Route path="/user-management" element={<UserManagementTable />} />
          </>
        ) : (
          <>
            <Route path="/member-form" element={<div>Access Denied</div>} />
            <Route path="/Add-payment" element={<div>Access Denied</div>} />
            <Route path="/Edite-Form" element={<div>Access Denied</div>} />
            <Route path="/create-user" element={<div>Access Denied</div>} />
            <Route path="/user-management" element={<div>Access Denied</div>} />
          </>
        )}
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
