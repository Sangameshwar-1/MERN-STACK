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
      window.location.href = '/'; 
      window.location.hash = '#/participant';
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-xl text-center rounded-2xl border border-white/10 bg-[#09090b]">
        <CardHeader className="py-8 border-b border-white/5">
          <CardTitle className="text-2xl font-semibold text-white">Welcome, {user?.firstName}!</CardTitle>
          <CardDescription className="text-slate-400 mt-1 text-sm">Let's customize your experience.</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8">
          {/* Step Indicator */}
          <div className="flex justify-center items-center gap-3 mb-8">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold border ${
              step >= 1 ? 'border-white bg-white text-black font-bold' : 'border-white/10 text-slate-500 bg-transparent'
            }`}>1</div>
            <div className={`h-0.5 w-12 rounded ${step >= 2 ? 'bg-white' : 'bg-white/10'}`}></div>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold border ${
              step >= 2 ? 'border-white bg-white text-black font-bold' : 'border-white/10 text-slate-500 bg-transparent'
            }`}>2</div>
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-base font-semibold text-white">Are you an internal student?</h3>
              <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto">
                <Button 
                  variant={formData.participantType === 'iiit' ? 'primary' : 'outline'}
                  className="flex-1 rounded-xl py-3"
                  onClick={() => setFormData({...formData, participantType: 'iiit'})}
                >
                  IIIT Student
                </Button>
                <Button 
                  variant={formData.participantType === 'external' ? 'primary' : 'outline'}
                  className="flex-1 rounded-xl py-3"
                  onClick={() => setFormData({...formData, participantType: 'external'})}
                >
                  External
                </Button>
              </div>
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button 
                  onClick={() => setStep(2)} 
                  className="bg-white hover:bg-slate-200 text-black font-semibold py-2 px-4 rounded-lg text-sm transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-base font-semibold text-white">Select your interests</h3>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {INTERESTS.map(interest => {
                  const Icon = interest.icon;
                  const isSelected = formData.interests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                        isSelected 
                          ? 'bg-white text-black border-white' 
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {interest.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <button 
                  onClick={() => setStep(1)} 
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={completeOnboarding} 
                  disabled={loading}
                  className="bg-white hover:bg-slate-200 text-black font-semibold py-2 px-4 rounded-lg text-sm transition-all"
                >
                  {loading ? 'Completing...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;