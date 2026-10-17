import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Rocket,
  Terminal,
  Radio,
  FileCheck,
  MessageSquare,
  Globe,
  User,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { apiRequest, getAuthToken, saveSession } from '../api/client';

export default function Auth({ onLoginSuccess, onNavigateToLanding, initialMessage = '' }) {
  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Form states
  const [workEmail, setWorkEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up fields
  const [academyName, setAcademyName] = useState('');
  const [desiredSubdomain, setDesiredSubdomain] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminTier, setAdminTier] = useState('director');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [scaleTier, setScaleTier] = useState('tier1');
  const [attestation, setAttestation] = useState(false);

  // Status feedback toast
  const [statusToast, setStatusToast] = useState({
    show: Boolean(initialMessage),
    message: initialMessage,
    isSuccess: false,
    isLoading: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDomainQuickFill = (domain) => {
    const atIndex = workEmail.indexOf('@');
    if (atIndex !== -1) {
      setWorkEmail(workEmail.substring(0, atIndex) + domain);
    } else {
      setWorkEmail(workEmail + domain);
    }
  };

  const handleAcademyNameChange = (val) => {
    setAcademyName(val);
    const clean = val.toLowerCase().replace(/[^a-z0-9]/g, '');
    setDesiredSubdomain(clean.substring(0, 15));
  };

  const showToast = (message, isSuccess = false, isLoading = false) => {
    setStatusToast({ show: true, message, isSuccess, isLoading });
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showToast('Signing in...', false, true);

    try {
      const result = await apiRequest('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: workEmail.trim(),
          password,
        }),
      });
      const token = getAuthToken(result);

      if (!token) {
        throw new Error('Sign-in succeeded but the server did not return an access token.');
      }

      localStorage.setItem('access_token', token);
      const user = await apiRequest('/api/auth/me');
      saveSession(token, user);
      onLoginSuccess(user, 'Signed in successfully.');
    } catch (error) {
      showToast(error.message || 'Sign-in failed.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showToast('Creating your institute account...', false, true);

    try {
      const result = await apiRequest('/api/auth/signup/admin', {
        method: 'POST',
        body: JSON.stringify({
          email: adminEmail.trim(),
          password: signupPassword,
          full_name: adminName.trim(),
          phone: adminPhone.trim(),
          institute_name: academyName.trim(),
          institute_address: null,
          institute_phone: null,
          institute_email: adminEmail.trim(),
        }),
      });
      const token = getAuthToken(result);

      if (token) {
        localStorage.setItem('access_token', token);
        const user = await apiRequest('/api/auth/me');
        saveSession(token, user);
        onLoginSuccess(user, 'Institute account created successfully.');
      } else {
        showToast('Account created. Sign in to continue.', true);
        setAuthMode('signin');
        setWorkEmail(adminEmail);
      }
    } catch (error) {
      showToast(error.message || 'Registration failed.', false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-900 min-h-screen flex flex-col antialiased selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden">
      
      {/* INJECTED STYLES FOR SMOOTH ANIMATIONS & BLOBS */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes toastSlide {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-fade-in-up { animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-toast { animation: toastSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        /* Custom scrollbar for webkit */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {}
      {/* 1. TOP HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
        <div className="h-[72px] w-full px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={onNavigateToLanding}
              className="flex items-center gap-2 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                C
              </div>
              <span className="font-bold text-lg text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-300">
                Coach Spear
              </span>
              <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-mono rounded font-bold uppercase transition-all duration-300 border border-indigo-100">
                Platform
              </span>
            </button>
            <div className="hidden md:flex items-center gap-2 text-slate-500 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <span>Secure learning operations</span>
            </div>
          </div>

          {}
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
              <button
                onClick={() => setAuthMode('signin')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-300 font-semibold ${
                  authMode === 'signin'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-300 font-semibold ${
                  authMode === 'signup'
                    ? 'bg-white text-[#4b41e1] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                Institutional Access
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all duration-200 text-xs font-semibold"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>EN</span>
              </button>
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-indigo-100 border border-slate-200 hover:border-indigo-300 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center text-slate-600 hover:text-indigo-600 shadow-sm cursor-pointer">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {}
      {/* 2. MAIN CONTAINER */}
      <main className="w-full pt-[72px] flex-1 relative z-10 flex flex-col justify-center min-h-screen">
        
        {/* VIBRANT ANIMATED BACKGROUND BLOBS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-300/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 flex-1 flex items-center relative z-10">
          <div className="flex justify-center w-full">
            
            {}
            {/* Dual-Mode Auth Workspace */}
            <div className="w-full max-w-[560px] flex flex-col gap-6 animate-fade-in-up">
              
              {/* Glassmorphic Form Container */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(79,70,229,0.1)] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/60 before:to-transparent before:pointer-events-none">
                
                {/* Form Header & Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 relative z-10">
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`p-1.5 rounded-lg shadow-sm border ${authMode === 'signin' ? 'bg-indigo-100 text-indigo-600 border-indigo-200/50' : 'bg-[#eff4ff] text-[#4b41e1] border-[#e5eeff]'}`}>
                        {authMode === 'signin' ? <Lock className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
                      </span>
                      <span className={`${authMode === 'signin' ? 'text-indigo-600' : 'text-[#4b41e1]'} text-xs uppercase tracking-wider font-bold`}>
                        {authMode === 'signin' ? 'Secure Access' : 'Enterprise Setup'}
                      </span>
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 transition-all duration-300">
                      {authMode === 'signin' ? 'Welcome back' : 'Create Academy'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                      {authMode === 'signin' ? 'Enter your credentials to access your workspace.' : 'Provision a new sovereign workspace for your team.'}
                    </p>
                  </div>

                  {}
                  {/* Silky Mode Switcher */}
                  <div className="inline-flex p-1.5 bg-slate-100/80 rounded-xl relative self-start sm:self-auto shadow-inner border border-slate-200/50 backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className={`relative z-10 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ease-out flex-1 sm:flex-none text-center ${
                        authMode === 'signin'
                          ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50 scale-100'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 scale-95'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={`relative z-10 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ease-out flex-1 sm:flex-none text-center ${
                        authMode === 'signup'
                          ? 'bg-white text-[#4b41e1] shadow-sm ring-1 ring-slate-200/50 scale-100'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 scale-95'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                {/* ANIMATED FORM CONTAINER (Uses key to re-trigger animations on switch) */}
                <div key={authMode} className="animate-fade-in-up relative z-10" style={{ animationDelay: '0.15s' }}>
                  
                  {}
                  {/* MODE 1: SIGN IN */}
                  {authMode === 'signin' ? (
                    <div className="flex flex-col space-y-6">
                      <form className="space-y-5" onSubmit={handleSignInSubmit}>
                        
                        {/* Work Email */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700">Work Email</label>
                            <div className="hidden sm:flex items-center gap-1.5">
                              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Quick fill:</span>
                              <button
                                type="button"
                                onClick={() => handleDomainQuickFill('@techsummittrainers.com')}
                                className="px-2 py-1 rounded bg-indigo-50/80 text-indigo-600 font-mono text-[10px] hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all duration-200 border border-indigo-100/50"
                              >
                                @techsummit...
                              </button>
                            </div>
                          </div>
                          <div className="relative flex items-center group">
                            <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 absolute left-3 pointer-events-none transition-colors duration-300" />
                            <input
                              className="w-full bg-white/50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm text-slate-900 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 placeholder:text-slate-400 shadow-sm"
                              type="email"
                              value={workEmail}
                              onChange={(e) => setWorkEmail(e.target.value)}
                              placeholder="name@organization.edu"
                              required
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700">Password</label>
                            <a href="#reset" className="text-indigo-600 hover:text-indigo-700 hover:underline text-xs font-semibold transition-colors duration-200">
                              Forgot password?
                            </a>
                          </div>
                          <div className="relative flex items-center group">
                            <Key className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 absolute left-3 pointer-events-none transition-colors duration-300" />
                            <input
                              className="w-full bg-white/50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm font-mono text-slate-900 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300 placeholder:text-slate-400 shadow-sm"
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••••••••••"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-200"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Primary Sign In Button */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full flex items-center justify-center gap-2 py-3.5 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(79,70,229,0.6)] text-sm font-bold group disabled:opacity-75 disabled:pointer-events-none cursor-pointer overflow-hidden relative"
                        >
                          {/* Button shine effect */}
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                          
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Authenticating...</span>
                            </>
                          ) : (
                            <>
                              <span>Sign in to Workspace</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* MODE 2: CREATE ACADEMY (SIGN UP) */
                    <div className="flex flex-col space-y-6">
                      
                      {/* Promotional Banner (Restored to original colors) */}
                      <div className="bg-gradient-to-r from-[#eff4ff] to-white rounded-xl p-3.5 flex items-center justify-between border border-[#e5eeff] shadow-sm transform transition-all hover:scale-[1.01]">
                        <div className="flex items-center gap-2.5">
                          <div className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4b41e1] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4b41e1]"></span>
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            14-Day Enterprise Sandbox
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[#4b41e1] bg-[#e2dfff] px-2 py-1 rounded font-bold shadow-sm border border-[#e5eeff]">
                          NO CARD REQUIRED
                        </span>
                      </div>

                      <form className="space-y-5" onSubmit={handleSignUpSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2 group">
                            <label className="text-xs font-bold text-slate-700 group-focus-within:text-[#4b41e1] transition-colors">Academy Name</label>
                            <input
                              className="w-full bg-white/50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-[#4b41e1] focus:ring-4 focus:ring-[#4b41e1]/10 focus:outline-none transition-all duration-300 placeholder:text-slate-400 shadow-sm"
                              placeholder="e.g. Apex Tech"
                              value={academyName}
                              onChange={(e) => handleAcademyNameChange(e.target.value)}
                              required
                              type="text"
                            />
                          </div>
                          <div className="space-y-2 group">
                            <label className="text-xs font-bold text-slate-700 group-focus-within:text-[#4b41e1] transition-colors">Workspace Domain</label>
                            <div className="flex items-center bg-white/50 border border-slate-200 rounded-xl p-1 hover:border-slate-300 hover:bg-white focus-within:bg-white focus-within:border-[#4b41e1] focus-within:ring-4 focus-within:ring-[#4b41e1]/10 transition-all duration-300 shadow-sm">
                              <input
                                className="w-full bg-transparent pl-2.5 py-2 font-mono text-sm text-slate-900 focus:outline-none placeholder:text-slate-300"
                                placeholder="apex"
                                value={desiredSubdomain}
                                onChange={(e) => setDesiredSubdomain(e.target.value)}
                                required
                                type="text"
                              />
                              <span className="text-slate-400 font-mono text-xs pr-3 select-none bg-slate-50 py-1 px-2 rounded-lg border border-slate-100">.coachsphere.ai</span>
                            </div>
                          </div>
                        </div>

                        {}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2 group">
                            <label className="text-xs font-bold text-slate-700 group-focus-within:text-[#4b41e1] transition-colors">Admin Name</label>
                            <input
                              className="w-full bg-white/50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-[#4b41e1] focus:ring-4 focus:ring-[#4b41e1]/10 focus:outline-none transition-all duration-300 placeholder:text-slate-400 shadow-sm"
                              placeholder="Full Name"
                              value={adminName}
                              onChange={(e) => setAdminName(e.target.value)}
                              required
                              type="text"
                            />
                          </div>
                          <div className="space-y-2 group">
                            <label className="text-xs font-bold text-slate-700 group-focus-within:text-[#4b41e1] transition-colors">Role / Tier</label>
                            <select
                              value={adminTier}
                              onChange={(e) => setAdminTier(e.target.value)}
                              className="w-full bg-white/50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-[#4b41e1] focus:ring-4 focus:ring-[#4b41e1]/10 focus:outline-none transition-all duration-300 shadow-sm cursor-pointer appearance-none"
                            >
                              <option value="director">Director / Managing Trustee</option>
                              <option value="dean">Academic Dean</option>
                              <option value="coo">Chief Operations Officer</option>
                              <option value="head_trainer">Lead Trainer</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2 group">
                            <label className="text-xs font-bold text-slate-700 group-focus-within:text-[#4b41e1] transition-colors">Work Email</label>
                            <input
                              className="w-full bg-white/50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-[#4b41e1] focus:ring-4 focus:ring-[#4b41e1]/10 focus:outline-none transition-all duration-300 placeholder:text-slate-400 shadow-sm"
                              placeholder="admin@academy.edu"
                              value={adminEmail}
                              onChange={(e) => setAdminEmail(e.target.value)}
                              required
                              type="email"
                            />
                          </div>
                          <div className="space-y-2 group">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-slate-700 group-focus-within:text-[#4b41e1] transition-colors">Phone Number</label>
                            </div>
                            <input
                              className="w-full bg-white/50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-[#4b41e1] focus:ring-4 focus:ring-[#4b41e1]/10 focus:outline-none transition-all duration-300 placeholder:text-slate-400 shadow-sm"
                              placeholder="+1 (555) 000-0000"
                              value={adminPhone}
                              onChange={(e) => setAdminPhone(e.target.value)}
                              required
                              type="tel"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 group">
                          <label className="text-xs font-bold text-slate-700 group-focus-within:text-[#4b41e1] transition-colors">Secure Password</label>
                          <div className="relative flex items-center">
                             <Key className="w-5 h-5 text-slate-400 group-focus-within:text-[#4b41e1] absolute left-3 pointer-events-none transition-colors duration-300" />
                            <input
                              className="w-full bg-white/50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 font-mono text-sm text-slate-900 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-[#4b41e1] focus:ring-4 focus:ring-[#4b41e1]/10 focus:outline-none transition-all duration-300 shadow-sm"
                              type="password"
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              placeholder="Min 8 characters"
                              minLength={8}
                              required
                            />
                          </div>
                        </div>

                        {}
                        {/* Scale Tier Radio Cards */}
                        <div className="space-y-3 pt-2">
                          <label className="text-xs font-bold text-slate-700">
                            Expected User Scale (Active Students)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { id: 'tier1', range: '1 - 500', desc: 'Single Campus' },
                              { id: 'tier2', range: '500 - 3.5k', desc: 'Multi-Branch' },
                              { id: 'tier3', range: '3,500+', desc: 'Enterprise' }
                            ].map((t) => (
                              <label
                                key={t.id}
                                className={`flex flex-col p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                                  scaleTier === t.id
                                    ? 'bg-gradient-to-br from-[#eff4ff] to-white border-[#4b41e1] shadow-md ring-2 ring-[#4b41e1]/20'
                                    : 'bg-white border-slate-100 hover:border-[#4b41e1]/50 shadow-sm'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="scale_tier"
                                  value={t.id}
                                  checked={scaleTier === t.id}
                                  onChange={() => setScaleTier(t.id)}
                                  className="sr-only"
                                />
                                <span className={`font-bold text-sm transition-colors duration-300 ${scaleTier === t.id ? 'text-[#4b41e1]' : 'text-slate-800'}`}>{t.range}</span>
                                <span className="text-[11px] text-slate-500 mt-1">{t.desc}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Security Attestation */}
                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 transition-all duration-300 hover:bg-slate-50">
                          <label className="flex items-start gap-3 cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={attestation}
                              onChange={(e) => setAttestation(e.target.checked)}
                              required
                              className="mt-0.5 w-4 h-4 rounded text-[#4b41e1] border-slate-300 focus:ring-[#4b41e1] accent-[#4b41e1] cursor-pointer transition-transform duration-200"
                            />
                            <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                              I attest authority to bind this institution. I agree to the{' '}
                              <a href="#terms" className="text-[#4b41e1] font-semibold hover:underline">Terms of Service</a> and{' '}
                              <a href="#privacy" className="text-[#4b41e1] font-semibold hover:underline">Privacy Policy</a>.
                            </span>
                          </label>
                        </div>

                        {}
                        {/* Provision Submit */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl bg-[#4b41e1] text-white hover:bg-[#645efb] active:scale-[0.98] focus:ring-4 focus:ring-[#4b41e1]/20 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(75,65,225,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(75,65,225,0.6)] text-sm font-bold group disabled:opacity-75 disabled:pointer-events-none cursor-pointer relative overflow-hidden"
                        >
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin text-white" />
                              <span>Provisioning Workspace...</span>
                            </>
                          ) : (
                            <>
                              <Rocket className="w-5 h-5 text-indigo-100 group-hover:text-white transition-colors duration-300" />
                              <span>Create Academy Workspace</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {}
                {/* Live Dynamic Status Toast */}
                {statusToast.show && (
                  <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between animate-toast shadow-lg shadow-slate-200/50">
                    <div className="flex items-center gap-3 text-sm text-slate-800 font-medium">
                      {statusToast.isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#4b41e1]" />
                      ) : statusToast.isSuccess ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-500" />
                      )}
                      <span>{statusToast.message}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {}
      {/* 3. FOOTER */}
      <footer className="w-full bg-white/50 backdrop-blur-md border-t border-slate-200/60 relative z-20">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg text-emerald-600 font-semibold hover:scale-105 transition-transform duration-200 cursor-default shadow-sm">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg font-semibold text-slate-700 hover:scale-105 transition-transform duration-200 cursor-default shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SOC2 Type II</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <span>© 2026 Coach Sphere Platform</span>
            <div className="flex items-center gap-4">
              <a href="#security" className="hover:text-[#4b41e1] transition-colors duration-200 font-medium">Security</a>
              <a href="#privacy" className="hover:text-[#4b41e1] transition-colors duration-200 font-medium">Privacy</a>
              <a href="#terms" className="hover:text-[#4b41e1] transition-colors duration-200 font-medium">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}