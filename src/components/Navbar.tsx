import React from 'react';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Menu className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">DockerFlow</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <UserIcon className="h-6 w-6 text-gray-600" />
            </button>
            <button className="ml-2 p-2 rounded-full hover:bg-gray-100">
              <LogOut className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}