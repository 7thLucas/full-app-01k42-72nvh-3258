import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();

  // Redirect to StokCerdas dashboard on load
  React.useEffect(() => {
    navigate('/stok-cerdas');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🏪</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">StokCerdas</h1>
        <p className="text-gray-600 mb-2">Kelola Inventori Restoran dengan Mudah dan Efisien</p>
        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
