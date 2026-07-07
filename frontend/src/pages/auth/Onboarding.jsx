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
      window.location.href = '/participant';
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
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step >= 1 ? 'border-zinc-100 bg-zinc-100 text-zinc-900' : 'border-zinc-800 text-zinc-500'}`}>1</div>
            <div className={`h-1 w-16 rounded-full ${step >= 2 ? 'bg-zinc-100' : 'bg-zinc-800'}`}></div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step >= 2 ? 'border-zinc-100 bg-zinc-100 text-zinc-900' : 'border-zinc-800 text-zinc-500'}`}>2</div>
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isSelected ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'}`}
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