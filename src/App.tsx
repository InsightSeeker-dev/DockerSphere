import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ContainerCard from './components/ContainerCard';
import NewContainerForm from './components/NewContainerForm';
import AuthForm from './components/AuthForm';
import { containers } from './services/api';
import type { Container, AuthState } from './types';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [containerList, setContainerList] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Validate token and set user data
      setAuthState({ user: null, isAuthenticated: true });
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setAuthState({ user: null, isAuthenticated: true });
  };

  const handleStart = async (id: string) => {
    try {
      await containers.start(id);
      // Refresh container list
      // TODO: Add getContainers API call
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start container');
    }
  };

  const handleStop = async (id: string) => {
    try {
      await containers.stop(id);
      // Refresh container list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to stop container');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await containers.delete(id);
      setContainerList(containerList.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete container');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Container Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your Docker containers with ease. Launch, stop, and monitor your containers from one place.
          </p>
        </div>

        <NewContainerForm onSuccess={(container) => setContainerList([...containerList, container])} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {containerList.map((container) => (
            <ContainerCard
              key={container.id}
              container={container}
              onStart={handleStart}
              onStop={handleStop}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;