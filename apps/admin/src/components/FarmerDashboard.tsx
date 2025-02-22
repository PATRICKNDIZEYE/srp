import { useUserContext } from '../context/UserContext';

const FarmerDashboard: React.FC = () => {
  const { token } = useUserContext();

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(`/api/milk-submissions/farmer/1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // existing code to handle response...
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // existing error handling...
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // existing component code...
}; 