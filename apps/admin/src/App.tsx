import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import ProjectForm from './pages/ProjectForm';
import Settings from './pages/Settings';
import NGORegistrationForm from './pages/NGORegistration/NGORegistrationForm';
import Error404 from './pages/Error/404';
import Landing from './pages/Landing';
import SignIn from './pages/Authentication/SignIn';
import AdminSignIn from './pages/Authentication/SignIn';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

import Chat from './pages/Chat';
import Documents from './pages/Documents';
import WorkPlanList from './pages/WorkPlan/WorkPlanList';
import CreateWorkPlan from './pages/WorkPlan/CreateWorkPlan';
import WorkPlanDetails from './pages/WorkPlan/WorkPlanDetails';
import Reports from './pages/Reports/Reports';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditWorkPlan from './pages/WorkPlan/EditWorkPlan';
import NGOManagement from './pages/NGOManagement/NGOManagement';
import NGOApproved from "./pages/Messages";
import WorkPlanManagement from './pages/Admin/WorkPlanManagement';
import ReportManagement from './pages/Admin/ReportManagement';
import UserManagement from './pages/Admin/UserManagement';


function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path='/login' element={<SignIn />} />
        <Route path="/admin/signin" element={<AdminSignIn />} />


        {/* Protected Admin Routes */}
        <Route
          element={
            <ProtectedAdminRoute>
              <DefaultLayout />
            </ProtectedAdminRoute>
          }
        >
          {/* All admin routes should start with /admin */}

          <Route path="/admin/ngos" element={<NGOManagement />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/work-plans" element={<WorkPlanManagement />} />
          <Route path="/admin/reports" element={<ReportManagement />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chat" element={<Chat />} />
          <Route path="/admin/documents" element={<Documents />} />
        </Route>

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
    </>
  );
}

export default App;
