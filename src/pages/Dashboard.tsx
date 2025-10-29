import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import ReceptionistDashboard from '@/components/dashboards/ReceptionistDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return userProfile.role === 'doctor' ? <DoctorDashboard /> : <ReceptionistDashboard />;
};

export default Dashboard;
