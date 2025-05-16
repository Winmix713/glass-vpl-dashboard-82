
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Layout title="404 Not Found">
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="max-w-md text-center px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-app-blue/10 mb-6">
            <span className="text-4xl font-bold text-app-blue">404</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ring-offset-background focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-app-blue hover:bg-app-blue/80 text-white h-10 py-2 px-4"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
