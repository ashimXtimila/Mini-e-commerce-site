import React from 'react';
import { useAuth } from '../../context/AuthContext';
const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <div>Please log in to view this page.</div>;
  }
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Summary cards can be added here */}
    </div>
  );
};
export default Dashboard;