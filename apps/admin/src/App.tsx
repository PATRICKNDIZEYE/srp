import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import Dashboard from './pages/Dashboard';

import Settings from './pages/Settings';

import Error404 from './pages/Error/404';
import Landing from './pages/Landing/index';

import ProtectedAdminRoute from './components/ProtectedAdminRoute';

import Chat from './pages/Chat';
import Documents from './pages/Documents';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NGOManagement from './pages/NGOManagement/NGOManagement';

import WorkPlanManagement from './pages/Admin/WorkPlanManagement';
import ReportManagement from './pages/Admin/ReportManagement';
import AdminUserManagement from './pages/Admin/UserManagement';
import RoleSelection from './pages/Authentication/RoleSelection';
import FarmerRegistration from './pages/Authentication/FarmerRegistration';
import ManagementSignIn from './pages/Authentication/ManagementSignIn';
import POCSignIn from './pages/Authentication/POCSignIn';
import TransportSignIn from './pages/Authentication/TransportSignIn';
import ProductionSignIn from './pages/Authentication/ProductionSignIn';
import POCDashboard from './pages/Dashboards/POCDashboard';
import TransportDashboard from './pages/Dashboards/TransportDashboard';
import ProductionDashboard from './pages/Production/ProductionDashboard';
import ManagementDashboard from './pages/Dashboards/ManagementDashboard';
import DiarySignIn from './pages/Authentication/DiarySignIn';
import DiaryDashboard from './pages/Dashboards/DiaryDashboard';
import DashboardLayout from './layouts/DashboardLayout';
import FarmerDashboard from './pages/Dashboards/FarmerDashboard';
import MilkSubmissionPage from './pages/Farmer/MilkSubmissionPage';
import PaymentsPage from './pages/Farmer/PaymentsPage';
import LoanPortalPage from './pages/Farmer/LoanPortalPage';
import FarmerManagement from './pages/POC/FarmerManagement';
import MilkSubmissions from './pages/POC/MilkSubmissions';
import DeliveryManagement from './pages/POC/DeliveryManagement';
import AssignedDeliveries from './pages/Transport/AssignedDeliveries';
import DiaryOperations from './pages/Diary/DiaryOperations';
import MilkReceiving from './pages/Management/MilkReceiving';
import SalesHistory from './components/Diary/SalesHistory';
import AdminFinancialReports from './components/Diary/FinancialReports';
import ProductionDeliveries from './pages/Production/ProductionDeliveries';
import ProductionSales from './pages/Production/ProductionSales';
import ManagementUserManagement from './pages/Management/UserManagement';
import ManagementFinancialReports from './pages/Management/FinancialReports';
import OperationsManagement from './pages/Management/OperationsManagement';
import SystemSettings from './pages/Management/SystemSettings';
import AnalyticsDashboard from './pages/Management/AnalyticsDashboard';
import DailyManagement from './pages/POC/DailyManagement';
import TransportDailyManagement from './pages/Transport/DailyManagement';
// import Productionline from './pages/';
import { UserProvider } from './context/UserContext';
import ProtectedFarmerRoute from './components/ProtectedFarmerRoute';
import FarmerLayout from './layouts/FarmerLayout';
import LoginPage from './pages/Authentication/FarmerRegistration';
import RegisterPage from './pages/Auth/RegisterPage';
import AccountInactivePage from './components/ErrorPages/AccountInactivePage';
import ProtectedManagementRoute from './components/ProtectedManagementRoute';
import AssignedTransportations from './pages/Transport/AssignedTransportation';
import ProductionManagement from './pages/Transport/ProductionManagement';
import ProductionDailyManagement from './pages/Production/DailyManagement';
import ProductionDeliveryManagement from './pages/Production/DeliveryManagement';
import ProtectedProductionRoute from './components/ProtectedProductionRoute';
import ProtectedTransportRoute from './components/ProtectedTransportRoute';
import ProtectedDiaryRoute from './components/ProtectedDiaryRoute';
import ProtectedPOCRoute from './components/ProtectedPOCRoute';
import Reports from './pages/POC/Reports';
import ManagementSalesHistory from './components/Management/SalesHistory';
import InguzanyoPage from './pages/POC/Inguzanyo';
import RequestMilkPage from './pages/Management/RequestMilkPage';

// Import the new FarmerManagement component
import ManagementFarmerManagement from './pages/Management/FarmerManagement';

// Import the new MilkSubmissions component
import ManagementMilkSubmissions from './pages/Management/MilkSubmissions';

import ManagementInguzanyoPage from './pages/Management/Inguzanyo';

// Import the new SubmissionsSummary component
import ManagementSubmissionsSummary from './pages/Management/SubmissionsSummary';

// Import the new components
import ManagementAssignedDeliveries from './pages/Management/AssignedDeliveries';
import ManagementAssignedTransportations from './pages/Management/AssignedTransportation';
import ManagementDailyManagement from './pages/Management/DailyManagement';
import ManagementProductionManagement from './pages/Management/ProductionManagement';
import ProductionDelivery from './pages/Management/ProductionDelivery';

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<RoleSelection />} />
        <Route path="/farmer/register" element={<FarmerRegistration />} />
        <Route path="/poc/signin" element={<POCSignIn />} />
        <Route path="/transport/signin" element={<TransportSignIn />} />
        <Route path="/production/signin" element={<ProductionSignIn />} />
        <Route path="/management/signin" element={<ManagementSignIn />} />
        <Route path="/diary/signin" element={<DiarySignIn />} />

        {/* Farmer Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/farmer" element={<FarmerLayout />}>
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="submit-milk" element={<MilkSubmissionPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="loan" element={<LoanPortalPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* POC Routes */}
        <Route element={<DashboardLayout role="poc" />}>
          <Route path="/poc/dashboard" element={<POCDashboard />} />
          <Route path="/poc/farmers" element={<FarmerManagement />} />
          <Route path="/poc/submissions" element={<MilkSubmissions />} />
          <Route path="/poc/deliveries" element={<DeliveryManagement />} />
          <Route path="/poc/reports" element={<Reports />} />
          <Route path="/poc/settings" element={<Settings />} />
          <Route path="/poc/milk-submissions/:farmerId" element={<MilkSubmissions />} />
          <Route path="/poc/inguzanyo/:farmerId" element={<InguzanyoPage />} />
        </Route>

        {/* Transport Routes */}
        <Route element={<DashboardLayout role="transport" />}>
          <Route path="/transport/dashboard" element={<TransportDashboard />} />
          <Route path="/transport/deliveries" element={<AssignedDeliveries />} />
          <Route path="/transport/daily-management/:deliveryId" element={<TransportDailyManagement />} />
          <Route path="/transport/assigned-transportations" element={<AssignedTransportations />} />
          <Route path="/transport/production-management/:deliveryId" element={<ProductionManagement />} />
          <Route path="/transport/settings" element={<Settings />} />
        </Route>

        {/* Production Routes */}
        <Route element={<DashboardLayout role="production" />}>
          <Route path="/production/dashboard" element={<ProductionDashboard />} />
          <Route path="/production/deliveries" element={<ProductionDeliveries />} />
          <Route path="/production/sales" element={<ProductionSales />} />
          <Route path="/production/settings" element={<Settings />} />
          <Route path="/production/daily-management/:deliveryId" element={<ProductionDailyManagement />} />
          <Route path="/production/delivery-management" element={<ProductionDeliveryManagement />} />
        </Route>

        {/* Management Routes */}
        <Route element={<DashboardLayout role="management" />}>
          <Route path="/management/dashboard" element={<ManagementDashboard />} />
          <Route path="/management/users" element={<ManagementUserManagement />} />
          <Route path="/management/finance" element={<ManagementFinancialReports />} />
          <Route path="/management/operations" element={<OperationsManagement />} />
          <Route path="/management/analytics" element={<AnalyticsDashboard />} />
          <Route path="/management/sales-history" element={<ManagementSalesHistory />} />
          <Route path="/management/sales-history/:salesHistoryId" element={<ManagementSalesHistory />} />
          <Route path="/management/settings" element={<SystemSettings />} />
          <Route path="/management/farmer-management/:pocId" element={<ManagementFarmerManagement />} />
          <Route path="/management/farmer-submission/:farmerId" element={<ManagementMilkSubmissions />} />
          <Route path="/management/inguzanyo/:farmerId" element={<ManagementInguzanyoPage />} />
          <Route path="/management/submissions-summary/:pocId" element={<ManagementSubmissionsSummary />} />
          <Route path="/management/assigned-deliveries/:transportId" element={<ManagementAssignedDeliveries />} />
          <Route path="/management/assigned-transportations/:transportId" element={<ManagementAssignedTransportations />} />
          <Route path="/management/daily-management/:transportId" element={<ManagementDailyManagement />} />
          <Route path="/management/production-management/:transportId" element={<ManagementProductionManagement />} />
          <Route path="/management/receive-milk/:entityId" element={<MilkReceiving />} />
          <Route path="/management/milk-requests/:entityId" element={<RequestMilkPage />} />
          <Route path="/management/production-delivery/:id" element={<ProductionDelivery />} />
        </Route>

        {/* Diary Routes */}
        <Route element={<DashboardLayout role="diary" />}>
          <Route path="/diary/dashboard" element={<DiaryDashboard />} />
          <Route path="/diary/operations" element={<DiaryOperations />} />
          <Route path="/diary/receiving" element={<MilkReceiving />} />
          <Route path="/diary/sales" element={<SalesHistory dateRange={{ start: '', end: '' }} />} />
          <Route path="/diary/finances" element={<AdminFinancialReports period="daily" />} />
          <Route path="/diary/settings" element={<Settings />} />
          <Route path="/diary/requests" element={<RequestMilkPage />} />
        </Route>

        {/* Error Pages */}
        <Route path="/account-inactive" element={<AccountInactivePage />} />

        {/* Error Routes */}
        <Route path="*" element={<Error404 />} />
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </UserProvider>
  );
}

export default App;
