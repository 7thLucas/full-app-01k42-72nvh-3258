import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();

  // Redirect to dashboard on load
  React.useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🏪</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventory Manager</h1>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
