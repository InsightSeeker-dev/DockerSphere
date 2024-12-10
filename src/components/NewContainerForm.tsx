import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { containers } from '../services/api';
import type { Container } from '../types';

interface NewContainerFormProps {
  onSuccess: (container: Container) => void;
}

export default function NewContainerForm({ onSuccess }: NewContainerFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    dockerfile: '',
    customUrl: '',
    ports: [''],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const container = await containers.create({
        ...formData,
        ports: formData.ports.filter(p => p !== ''),
      });
      onSuccess(container);
      setIsOpen(false);
      setFormData({ name: '', image: '', dockerfile: '', customUrl: '', ports: [''] });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create container');
    } finally {
      setLoading(false);
    }
  };

  const addPort = () => {
    setFormData({ ...formData, ports: [...formData.ports, ''] });
  };

  const updatePort = (index: number, value: string) => {
    const newPorts = [...formData.ports];
    newPorts[index] = value;
    setFormData({ ...formData, ports: newPorts });
  };

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Container
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Launch New Container</h2>
          
          {error && (
            <div className="mb-4 bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Container Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Docker Image</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., nginx:latest"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ports</label>
              {formData.ports.map((port, index) => (
                <div key={index} className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={port}
                    onChange={(e) => updatePort(index, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="80:80"
                  />
                  {index === formData.ports.length - 1 && (
                    <button
                      type="button"
                      onClick={addPort}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      Add Port
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Custom URL</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  http://
                </span>
                <input
                  type="text"
                  value={formData.customUrl}
                  onChange={(e) => setFormData({ ...formData, customUrl: e.target.value })}
                  className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="myapp.domain.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dockerfile Content</label>
              <textarea
                value={formData.dockerfile}
                onChange={(e) => setFormData({ ...formData, dockerfile: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="FROM node:16&#10;WORKDIR /app&#10;COPY . .&#10;RUN npm install&#10;CMD ['npm', 'start']"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Container'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}