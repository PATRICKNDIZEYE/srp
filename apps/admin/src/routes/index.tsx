import NGOManagement from '../pages/NGOManagement/NGOManagement';
import WorkPlanManagement from '../pages/Admin/WorkPlanManagement';

// Add to your routes array
{
  path: '/ngo-management',
  element: <NGOManagement />,
  // Add appropriate auth protection
}

// Add this route for admin work plan management
{
  path: '/admin/work-plans',
  element: <WorkPlanManagement />,
} 