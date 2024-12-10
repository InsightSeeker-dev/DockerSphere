'use client';

import { getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container } from '@/types/docker';
import { SystemStats } from '@/types/system';
import { DockerImage } from '@/types/docker';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { 
  Plus, 
  Server, 
  Settings, 
  LayoutGrid, 
  Terminal, 
  Activity, 
  Database,
  Cpu,
  HardDrive,
  Globe,
  BarChart2,
  Layers,
  RefreshCw
} from 'lucide-react';

interface StorageImage {
  id: string;
  name: string;
  size: number;
  createdAt: Date;
  dockerImageTag: string;
  dockerImageId: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [containers, setContainers] = useState<Container[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [images, setImages] = useState<DockerImage[]>([]);
  const [storageImages, setStorageImages] = useState<StorageImage[]>([]);
  const [storageUsage, setStorageUsage] = useState<{ used: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchContainers = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      const response = await fetch('/api/containers', {
        headers: {
          'Authorization': `Bearer ${session.user.id}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch containers');
      const data = await response.json();
      setContainers(data.containers || []);
    } catch (error) {
      console.error('Failed to fetch containers:', error);
      toast.error('Failed to fetch containers');
    }
  };

  const fetchStats = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      const response = await fetch('/api/stats', {
        headers: {
          'Authorization': `Bearer ${session.user.id}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to fetch system stats');
    }
  };

  const fetchImages = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      const response = await fetch('/api/images', {
        headers: {
          'Authorization': `Bearer ${session.user.id}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Failed to fetch images:', error);
      toast.error('Failed to fetch images');
    }
  };

  const fetchStorageImages = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      const response = await fetch('/api/storage/images', {
        headers: {
          'Authorization': `Bearer ${session.user.id}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch storage images');
      const data = await response.json();
      setStorageImages(data.images || []);
    } catch (error) {
      console.error('Failed to fetch storage images:', error);
      toast.error('Failed to fetch storage images');
    }
  };

  const fetchStorageUsage = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      const response = await fetch('/api/storage/usage', {
        headers: {
          'Authorization': `Bearer ${session.user.id}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch storage usage');
      const data = await response.json();
      setStorageUsage(data);
    } catch (error) {
      console.error('Failed to fetch storage usage:', error);
      toast.error('Failed to fetch storage usage');
    }
  };

  const handleContainerAction = async (containerId: string, action: 'start' | 'stop' | 'remove') => {
    try {
      setActionLoading(containerId);
      const response = await fetch('/api/containers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, containerId }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      toast.success(`Container ${action}ed successfully`);
      await fetchContainers();
      await fetchStats();
    } catch (error) {
      console.error('Container action error:', error);
      toast.error(`Failed to ${action} container`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveImage = async (image: DockerImage) => {
    try {
      const response = await fetch('/api/storage/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: image.id }),
      });
      
      if (!response.ok) throw new Error('Failed to save image');
      
      toast.success('Image saved successfully');
      await fetchStorageImages();
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch('/api/storage/images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }),
      });
      
      if (!response.ok) throw new Error('Failed to delete image');
      
      toast.success('Image deleted successfully');
      await fetchStorageImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleCreateContainer = async (imageName: string, isPersonal: boolean) => {
    try {
      const response = await fetch('/api/containers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: imageName, isPersonal }),
      });
      
      if (!response.ok) throw new Error('Failed to create container');
      
      toast.success('Container created successfully');
      await fetchContainers();
    } catch (error) {
      console.error('Error creating container:', error);
      toast.error('Failed to create container');
    }
  };

  const renderResourceWidget = (icon: JSX.Element, title: string, value: number, total: number | null, color: string) => (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center">
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-white mr-2">
            {value}{total ? `/${total}` : ''}
          </span>
          {total && (
            <span className="text-sm text-gray-500">
              {((value / total) * 100).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {renderResourceWidget(
        <Cpu className="text-white" size={24} />, 
        'CPU Usage', 
        stats ? parseFloat(stats.cpuUsage.toFixed(1)) : 0, 
        100, 
        'bg-blue-600/30'
      )}
      {renderResourceWidget(
        <HardDrive className="text-white" size={24} />, 
        'Disk Usage', 
        storageUsage ? storageUsage.used : 0, 
        storageUsage ? storageUsage.total : 0, 
        'bg-green-600/30'
      )}
      {renderResourceWidget(
        <Database className="text-white" size={24} />, 
        'Memory', 
        stats ? stats.memoryUsage.used : 0, 
        stats ? stats.memoryUsage.total : 0, 
        'bg-purple-600/30'
      )}
      {renderResourceWidget(
        <Layers className="text-white" size={24} />, 
        'Containers', 
        stats ? stats.containersRunning : 0, 
        stats ? stats.containers : 0, 
        'bg-red-600/30'
      )}
    </div>
  );

  const renderContainersList = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-blue-400 mr-4">My Containers</h2>
          <button 
            onClick={fetchContainers}
            className={`text-gray-400 hover:text-white`}
          >
            <RefreshCw size={20} />
          </button>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
          <Plus className="mr-2" size={20} /> New Container
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Image</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ports</th>
              <th className="p-3">Resources</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {containers.map(container => (
              <tr 
                key={container.Id} 
                className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <td className="p-3 font-medium">{container.Names[0].slice(1)}</td>
                <td className="p-3 text-gray-400">{container.Image}</td>
                <td className="p-3">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-bold 
                    ${container.State === 'running' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'}
                  `}>
                    {container.State}
                  </span>
                </td>
                <td className="p-3">
                  {container.Ports.map(port => (
                    <span 
                      key={`${port.PrivatePort}-${port.PublicPort}`}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded mr-2 text-xs"
                    >
                      {port.PrivatePort}
                    </span>
                  ))}
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <Cpu size={16} className="mr-2 text-gray-400" />
                    <span>0%</span>
                    <Database size={16} className="ml-4 mr-2 text-gray-400" />
                    <span>0 MB</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-500 hover:text-blue-600 transition-colors"
                      title="Terminal"
                    >
                      <Terminal size={20} />
                    </button>
                    <button 
                      className="text-green-500 hover:text-green-600 transition-colors"
                      title="Start/Stop"
                    >
                      <Activity size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  useEffect(() => {
    if (session) {
      fetchContainers();
      fetchStats();
      fetchImages();
      fetchStorageImages();
      fetchStorageUsage();
      const interval = setInterval(() => {
        fetchContainers();
        fetchStats();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 p-6 fixed left-0 top-0 h-full">
          <div className="flex items-center mb-10">
            <img src="/path/to/container-icon.svg" alt="Container Icon" className="mr-3" style={{ width: '40px', height: '40px' }} />
            <h1 className="text-2xl font-bold text-blue-400">DockerFlow</h1>
          </div>
          <nav>
            <ul className="space-y-2">
              {[
                { 
                  icon: <LayoutGrid size={20} />, 
                  label: 'Dashboard', 
                  key: 'dashboard' 
                },
                { 
                  icon: <Server size={20} />, 
                  label: 'Containers', 
                  key: 'containers' 
                },
                { 
                  icon: <BarChart2 size={20} />, 
                  label: 'Analytics', 
                  key: 'analytics' 
                },
                { 
                  icon: <Settings size={20} />, 
                  label: 'Settings', 
                  key: 'settings' 
                }
              ].map(item => (
                <li 
                  key={item.key}
                  className={`
                    py-2 px-4 rounded cursor-pointer flex items-center 
                    ${activeTab === item.key 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-700 text-gray-400'}
                    transition-colors
                  `}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-10">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-white mb-6">
                Dashboard Overview
              </h1>
              {renderDashboard()}
            </div>
          )}
          {activeTab === 'containers' && renderContainersList()}
        </div>
      </div>
    </div>
  );
}