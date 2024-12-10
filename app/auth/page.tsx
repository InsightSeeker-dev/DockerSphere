'use client';

import React, { useState, useEffect } from 'react';
import { Lock, User, Mail, Container } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LoadingSpinner = dynamic(() => import('@/components/LoadingSpinner'), { ssr: false });

const AuthPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.error) {
          toast({
            title: 'Error',
            description: 'Invalid credentials',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Success',
          description: 'Welcome back!',
        });

        router.push('/dashboard');
        router.refresh();
      } else {
        // Register new user
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        toast({
          title: 'Success',
          description: 'Account created successfully! Please login.',
        });
        setIsLogin(true);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-950 bg-gray-50 flex items-center justify-center p-4" suppressHydrationWarning>
      <div className="w-full max-w-md dark:bg-gray-900 bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-6 pb-4 dark:bg-gray-800 bg-gray-100">
          <div className="flex items-center justify-center mb-4">
            <Container className="mr-3 dark:text-blue-400 text-blue-600" size={48} />
            <h1 className="text-3xl font-bold dark:text-blue-400 text-blue-600">DockerFlow</h1>
          </div>
          <div className="flex border-b dark:border-gray-700 border-gray-300 mb-6">
            <button 
              type="button"
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-3 text-lg font-semibold ${isLogin ? 'dark:text-blue-400 text-blue-600 dark:border-blue-400 border-blue-600 border-b-2' : 'dark:text-gray-400 text-gray-600'}`}
            >
              Login
            </button>
            <button 
              type="button"
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-3 text-lg font-semibold ${!isLogin ? 'dark:text-blue-400 text-blue-600 dark:border-blue-400 border-blue-600 border-b-2' : 'dark:text-gray-400 text-gray-600'}`}
            >
              Register
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8">
          {!isLogin && (
            <div className="mb-4">
              <label className="block dark:text-gray-300 text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                <User className="inline-block mr-2 mb-1" size={20} />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 dark:bg-gray-800 bg-gray-50 dark:text-gray-200 text-gray-900 dark:border-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Choose a username"
                required={!isLogin}
                disabled={isLoading}
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block dark:text-gray-300 text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              <Mail className="inline-block mr-2 mb-1" size={20} />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 dark:bg-gray-800 bg-gray-50 dark:text-gray-200 text-gray-900 dark:border-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block dark:text-gray-300 text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              <Lock className="inline-block mr-2 mb-1" size={20} />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 dark:bg-gray-800 bg-gray-50 dark:text-gray-200 text-gray-900 dark:border-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:text-white text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && mounted && (
                <span className="flex items-center justify-center">
                  <LoadingSpinner />
                  Processing...
                </span>
              )}
              {!isLoading && (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>
          {isLogin && (
            <div className="text-center mt-4">
              <Link href="/auth/reset-password" className="text-sm dark:text-blue-400 text-blue-600 hover:dark:text-blue-300 hover:text-blue-500 transition duration-300">
                Forgot Password?
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
