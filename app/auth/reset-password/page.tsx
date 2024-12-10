'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Logic to send password reset email goes here
      // For example, you might call an API endpoint
      toast({
        title: 'Success',
        description: 'A password reset link has been sent to your email.',
      });
      router.push('/auth'); // Redirect to auth page
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while sending the reset link.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-6 pb-4 bg-gray-700">
          <h1 className="text-3xl font-bold text-blue-400">Reset Password</h1>
          <p className="text-gray-300 mb-4">Enter your email to receive a password reset link.</p>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              <Mail className="inline-block mr-2 mb-1" size={20} />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
