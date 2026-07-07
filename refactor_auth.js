const fs = require('fs');
const path = require('path');

const writeComponent = (relativePath, content) => {
  const fullPath = path.join(__dirname, 'frontend/src', relativePath);
  fs.writeFileSync(fullPath, content.trim());
};

writeComponent('pages/auth/Login.jsx', `
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuth from '../../context/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { ShieldAlert, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const user = await login(data.email, data.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'organizer') navigate('/organizer');
      else if (!user.onboardingComplete) navigate('/onboarding');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 mb-2">
            <ShieldAlert className="h-6 w-6 text-zinc-100" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>
            
            <Button type="submit" className="w-full mt-6" isLoading={loading}>
              Sign In
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="justify-center border-t border-zinc-800 pt-6">
          <p className="text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-zinc-100 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
`);

writeComponent('pages/auth/Signup.jsx', `
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const pwd = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', data);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center py-8">
          <CardContent className="flex flex-col items-center">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl mb-2">Account Created!</CardTitle>
            <CardDescription>Redirecting you to login...</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 mb-2">
            <ShieldAlert className="h-6 w-6 text-zinc-100" />
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register('firstName', { required: 'Required' })}
                />
                {errors.firstName && <p className="text-xs text-red-400">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register('lastName', { required: 'Required' })}
                />
                {errors.lastName && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Required' })}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Required', minLength: { value: 6, message: 'Minimum 6 chars' } })}
              />
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', { 
                  required: 'Required',
                  validate: val => val === pwd || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>
            
            <Button type="submit" className="w-full mt-6" isLoading={loading}>
              Create Account
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="justify-center border-t border-zinc-800 pt-6">
          <p className="text-sm text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-zinc-100 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
`);

writeComponent('pages/auth/Onboarding.jsx', `
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import api from '../../utils/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, Laptop, Palette, Megaphone, TerminalSquare } from 'lucide-react';

const INTERESTS = [
  { id: 'tech', label: 'Technology', icon: Laptop },
  { id: 'arts', label: 'Arts & Culture', icon: Palette },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'coding', label: 'Hackathons', icon: TerminalSquare }
];

const Onboarding = () => {
  const { user, login } = useAuth(); // login is also used to refresh user context
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    participantType: 'iiit',
    interests: []
  });

  const toggleInterest = (id) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id) 
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      await api.post('/auth/onboarding', formData);
      // Force refresh user data to get onboardingComplete = true
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="py-8 border-b border-zinc-800">
          <CardTitle className="text-3xl font-bold">Welcome, {user?.firstName}!</CardTitle>
          <CardDescription>Let's personalize your Felicity experience.</CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="flex justify-center items-center gap-4 mb-10">
            <div className={\`flex h-10 w-10 items-center justify-center rounded-full border-2 \${step >= 1 ? 'border-zinc-100 bg-zinc-100 text-zinc-900' : 'border-zinc-800 text-zinc-500'}\`}>1</div>
            <div className={\`h-1 w-16 rounded-full \${step >= 2 ? 'bg-zinc-100' : 'bg-zinc-800'}\`}></div>
            <div className={\`flex h-10 w-10 items-center justify-center rounded-full border-2 \${step >= 2 ? 'border-zinc-100 bg-zinc-100 text-zinc-900' : 'border-zinc-800 text-zinc-500'}\`}>2</div>
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-semibold">Are you an internal student?</h3>
              <div className="flex justify-center gap-4">
                <Button 
                  variant={formData.participantType === 'iiit' ? 'primary' : 'outline'}
                  size="lg"
                  className="w-40"
                  onClick={() => setFormData({...formData, participantType: 'iiit'})}
                >
                  IIIT Student
                </Button>
                <Button 
                  variant={formData.participantType === 'external' ? 'primary' : 'outline'}
                  size="lg"
                  className="w-40"
                  onClick={() => setFormData({...formData, participantType: 'external'})}
                >
                  External
                </Button>
              </div>
              <div className="flex justify-end mt-8">
                <Button onClick={() => setStep(2)}>Continue</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-semibold">What are you interested in?</h3>
              <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
                {INTERESTS.map(interest => {
                  const Icon = interest.icon;
                  const isSelected = formData.interests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={\`flex items-center gap-2 px-4 py-2 rounded-full border transition-all \${isSelected ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'}\`}
                    >
                      <Icon className="h-4 w-4" />
                      {interest.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={completeOnboarding} isLoading={loading}>Complete Setup</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
`);

console.log('Authentication flow refactored.');
