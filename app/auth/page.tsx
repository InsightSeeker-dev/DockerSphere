'use client';
import { Lock, User, Mail, Container, AlertCircle, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const DockerFlowAuth = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    submit?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!isLogin && !formData.username) {
      newErrors.username = 'Username is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      if (isLogin) {
        // Login
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        router.push('/dashboard');
      } else {
        // Register
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        // Automatically log in after successful registration
        await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        router.push('/dashboard');
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const inputVariants = {
    rest: { 
      scale: 1,
      borderColor: "rgba(75, 85, 99, 0.6)"
    },
    focus: { 
      scale: 1.01,
      borderColor: "#3b82f6",
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800"
      >
        <div className="p-8">
          <motion.div 
            className="flex items-center justify-center mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Container className="text-blue-500 mr-3" size={40} />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              DockerFlow
            </h1>
          </motion.div>

          <div className="flex mb-8 bg-gray-800/30 rounded-lg p-1">
            {['Login', 'Register'].map((type) => (
              <button
                key={type}
                onClick={() => setIsLogin(type === 'Login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  (isLogin && type === 'Login') || (!isLogin && type === 'Register')
                    ? 'text-white bg-blue-500/20 text-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {!isLogin && (
                <div>
                  <label className="block text-gray-200 text-sm font-medium mb-2" htmlFor="username">
                    <User className="inline-block mr-2 mb-1" size={16} />
                    Username
                  </label>
                  <motion.input
                    variants={inputVariants}
                    initial="rest"
                    whileFocus="focus"
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-gray-900/50 text-gray-100 rounded-lg border ${
                      errors.username ? 'border-red-500/50' : 'border-gray-700'
                    } focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200`}
                    placeholder="Choose a username"
                  />
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-xs text-red-400/90 flex items-center"
                    >
                      <AlertCircle size={12} className="mr-1" />
                      {errors.username}
                    </motion.p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2" htmlFor="email">
                  <Mail className="inline-block mr-2 mb-1" size={16} />
                  Email
                </label>
                <motion.input
                  variants={inputVariants}
                  initial="rest"
                  whileFocus="focus"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-gray-900/50 text-gray-100 rounded-lg border ${
                    errors.email ? 'border-red-500/50' : 'border-gray-700'
                  } focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-xs text-red-400/90 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" />
                    {errors.email}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-gray-200 text-sm font-medium mb-2" htmlFor="password">
                  <Lock className="inline-block mr-2 mb-1" size={16} />
                  Password
                </label>
                <div className="relative">
                  <motion.input
                    variants={inputVariants}
                    initial="rest"
                    whileFocus="focus"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-gray-900/50 text-gray-100 rounded-lg border ${
                      errors.password ? 'border-red-500/50' : 'border-gray-700'
                    } focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-xs text-red-400/90 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" />
                    {errors.password}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full mt-6 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg 
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700'} 
                  transition-all duration-200 shadow-lg shadow-blue-500/20`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </motion.button>

              {isLogin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-4"
                >
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    Forgot Password?
                  </a>
                </motion.div>
              )}

              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400/90 text-sm"
                >
                  {errors.submit}
                </motion.div>
              )}
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default DockerFlowAuth;