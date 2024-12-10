import React from 'react';
import { Play, Square, Trash2, ExternalLink } from 'lucide-react';
import type { Container } from '../types';

interface ContainerCardProps {
  container: Container;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ContainerCard({ container, onStart, onStop, onDelete }: ContainerCardProps) {
  const statusColor = {
    running: 'bg-green-100 text-green-800',
    stopped: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800',
  }[container.status];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{container.name}</h3>
          <p className="text-sm text-gray-500">{container.image}</p>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
          {container.status}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <ExternalLink className="h-4 w-4 mr-2" />
          <a href={container.url} target="_blank" rel="noopener noreferrer" 
             className="text-indigo-600 hover:text-indigo-800">
            {container.url}
          </a>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Created: {new Date(container.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {container.status === 'stopped' ? (
          <button
            onClick={() => onStart(container.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
          >
            <Play className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => onStop(container.id)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
          >
            <Square className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={() => onDelete(container.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}