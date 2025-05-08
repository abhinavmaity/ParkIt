
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { AlertCircle, Car, EyeIcon, EyeOffIcon, Mail, Lock, User, Shield, Settings } from 'lucide-react';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { validateEmail, validatePassword } from '@/utils/validation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const [errors, setErrors] = useState<{email?: string; password?: string; form?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, user, loading } = useAuth();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous form error
    setErrors(prev => ({ ...prev, form: undefined }));
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signIn(email, password, loginType);
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({
        ...errors,
        form: error.message || 'Failed to sign in. Please check your credentials.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <MainLayout showNav={false}>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner className="h-12 w-12" />
        </div>
      </MainLayout>
    );
  }

  if (user) {
    return <Navigate to="/parking" />;
  }

  return (
    <MainLayout showNav={false}>
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-card rounded-xl border border-border shadow-sm p-8"
        >
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center justify-center mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-10 h-10 bg-primary rounded-md flex items-center justify-center"
              >
                <Car className="text-primary-foreground" size={20} />
              </motion.div>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your ParkIt account</p>
          </div>

          <Tabs
            defaultValue="user"
            className="w-full mb-6"
            value={loginType}
            onValueChange={setLoginType}
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <User size={16} />
                <span className="hidden sm:inline">User</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield size={16} />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings size={16} />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Login as a regular user to book parking spots
              </p>
            </TabsContent>
            
            <TabsContent value="security" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Security personnel login for scanning and verification
              </p>
            </TabsContent>
            
            <TabsContent value="admin" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Admin login for managing the parking system
              </p>
            </TabsContent>
          </Tabs>

          {errors.form && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.form}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@university.edu"
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  value={email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                  value={password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password}</p>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? "Signing in..." : `Sign in as ${loginType === 'user' ? 'User' : loginType === 'security' ? 'Security' : 'Admin'}`}
              </Button>
            </motion.div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
