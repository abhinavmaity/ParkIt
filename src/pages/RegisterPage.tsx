
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import Logo from '@/components/common/Logo';
import RegistrationForm from '@/components/auth/RegistrationForm';

const RegisterPage = () => {
  return (
    <MainLayout showNav={false}>
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-card rounded-xl border border-border shadow-sm p-8"
        >
          <div className="text-center mb-8">
            <Logo />
            <h1 className="text-2xl font-bold tracking-tight mb-2">Create an Account</h1>
            <p className="text-muted-foreground">Join ParkIt to reserve your campus parking</p>
          </div>

          <RegistrationForm />

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
