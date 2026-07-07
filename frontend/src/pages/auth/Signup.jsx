import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuth from '../../context/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { ShieldAlert, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    defaultValues: { participantType: 'iiit' }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user } = useAuth();
  
  if (user && !isSuccess) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'organizer') return <Navigate to="/organizer" replace />;
    return <Navigate to="/participant" replace />;
  }

  const pwd = watch('password');
  const pType = watch('participantType');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await authRegister(data);
      setIsSuccess(true);
      setTimeout(() => navigate('/participant'), 2500);
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
            <CardDescription>Redirecting you to your dashboard...</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 items-center text-center">
          <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.08] mb-2 hover:bg-white/[0.05] transition-colors">
            <ShieldAlert className="h-6 w-6 text-white" />
          </Link>
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
            
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wider text-slate-400 font-medium">I am a...</Label>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center py-3.5 px-4 rounded-xl border cursor-pointer transition-all ${
                  pType === 'iiit' 
                    ? 'border-white bg-white/5 text-white' 
                    : 'border-white/10 bg-transparent text-slate-400 hover:bg-white/[0.02]'
                }`}>
                  <input type="radio" value="iiit" className="hidden" {...register('participantType')} />
                  <span className="text-sm font-semibold">IIIT Student</span>
                </label>
                <label className={`flex-1 flex items-center justify-center py-3.5 px-4 rounded-xl border cursor-pointer transition-all ${
                  pType === 'non-iiit' 
                    ? 'border-white bg-white/5 text-white' 
                    : 'border-white/10 bg-transparent text-slate-400 hover:bg-white/[0.02]'
                }`}>
                  <input type="radio" value="non-iiit" className="hidden" {...register('participantType')} />
                  <span className="text-sm font-semibold">External Student</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Required',
                  validate: (val) => {
                    if (pType === 'iiit') {
                      const validDomains = ['@students.iiit.ac.in', '@iiit.ac.in', '@research.iiit.ac.in'];
                      return validDomains.some(d => val.endsWith(d)) || 'IIIT students must use an IIIT email address';
                    }
                    return true;
                  }
                })}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pr-10"
                  {...register('password', { required: 'Required', minLength: { value: 6, message: 'Minimum 6 chars' } })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="pr-10"
                  {...register('confirmPassword', { 
                    required: 'Required',
                    validate: val => val === pwd || 'Passwords do not match'
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>
            
            <Button type="submit" className="w-full mt-6" isLoading={loading}>
              Create Account
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="justify-center pt-2">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;