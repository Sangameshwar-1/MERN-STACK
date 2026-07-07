import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Shield, Zap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import useAuth from '../../context/useAuth';

const LandingPage = () => {
  const { user } = useAuth();
  
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'organizer') return <Navigate to="/organizer" replace />;
    return <Navigate to="/participant" replace />;
  }
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32">
        <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
          Felicity 2.0 is now live
        </div>
        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-100 mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
          The ultimate platform for <br className="hidden md:block" />
          <span className="text-zinc-500">managing campus events.</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Streamline event registration, manage participants, and deliver unforgettable experiences with our enterprise-grade platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-7 duration-1000">
          <Link to="/signup">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/participant/events">
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
              Browse Events
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-zinc-900 bg-zinc-950/50 px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 mb-4">Everything you need to succeed</h2>
            <p className="text-zinc-400">Purpose-built tools for organizers and participants alike.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
              <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-zinc-300" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">Event Discovery</h3>
              <p className="text-zinc-400">Easily browse, filter, and discover upcoming events tailored to your interests and skills.</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
              <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-zinc-300" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">Seamless Registration</h3>
              <p className="text-zinc-400">One-click registration for standard events, and intuitive team building for hackathons.</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
              <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-zinc-300" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">Secure Ticketing</h3>
              <p className="text-zinc-400">Automated QR code generation and instant validation at the venue gates.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
