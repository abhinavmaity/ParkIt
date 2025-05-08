
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, EyeIcon, EyeOffIcon, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail, validatePassword, validateName, validatePhone } from '@/utils/validation';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate each field
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.name,
        phone: formData.phone
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({
        form: error.message || 'Failed to register. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
      
      <FormField
        label="Full Name"
        name="name"
        icon={<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        delay={0.1}
      />
      
      <FormField
        label="Email"
        name="email"
        type="email"
        icon={<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
        placeholder="you@university.edu"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        delay={0.2}
      />
      
      <FormField
        label="Phone Number"
        name="phone"
        icon={<Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
        placeholder="+91 98765 43210"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        delay={0.3}
      />
      
      <PasswordField
        label="Password"
        name="password"
        value={formData.password}
        showPassword={showPassword}
        toggleVisibility={togglePasswordVisibility}
        onChange={handleChange}
        error={errors.password}
        delay={0.4}
      />
      
      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type={showPassword ? "text" : "password"}
        icon={<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        delay={0.5}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="pt-2"
      >
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </motion.div>
    </form>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  icon?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  delay: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  icon,
  onChange,
  error,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="space-y-2"
    >
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {icon}
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`${icon ? "pl-10" : ""} ${error ? "border-destructive" : ""}`}
          value={value}
          onChange={onChange}
        />
      </div>
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </motion.div>
  );
};

interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  showPassword: boolean;
  toggleVisibility: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  delay: number;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  name,
  value,
  showPassword,
  toggleVisibility,
  onChange,
  error,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="space-y-2"
    >
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          className={`pl-10 pr-10 ${error ? "border-destructive" : ""}`}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
          onClick={toggleVisibility}
        >
          {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
        </button>
      </div>
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </motion.div>
  );
};

export default RegistrationForm;
