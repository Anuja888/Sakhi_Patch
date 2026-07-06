import React, { useState } from 'react';
import { ShieldCheck, LogIn } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => void;
  onDemo: () => void;
  onSignup?: (
    name: string,
    age: number,
    averageCycleLength: number,
    lastPeriodDate: number,
    language: 'en' | 'hi' | 'te'
  ) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onDemo, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupAge, setSignupAge] = useState('');
  const [signupCycleLength, setSignupCycleLength] = useState('28');
  
  // Initialize last period date to 14 days ago (in YYYY-MM-DD format for date input)
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [signupLastPeriodDate, setSignupLastPeriodDate] = useState(fourteenDaysAgo);
  const [signupLanguage, setSignupLanguage] = useState<'en' | 'hi' | 'te'>('en');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter both email and password.');
      return;
    }

    setError('');
    onLogin(email.trim(), password);
  };

  const handleSignupSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const ageNum = parseInt(signupAge, 10);
    const cycleLengthNum = parseInt(signupCycleLength, 10);
    const lastPeriodTimestamp = new Date(signupLastPeriodDate).getTime();

    if (!signupName.trim() || !ageNum || ageNum < 12 || ageNum > 60) {
      setError('Please enter a valid name and age (12-60).');
      return;
    }
    if (!cycleLengthNum || cycleLengthNum < 21 || cycleLengthNum > 45) {
      setError('Please enter a valid average cycle length (21-45 days).');
      return;
    }
    if (isNaN(lastPeriodTimestamp) || lastPeriodTimestamp > Date.now()) {
      setError('Please enter a valid past date for your last period.');
      return;
    }

    setError('');
    onSignup?.(signupName.trim(), ageNum, cycleLengthNum, lastPeriodTimestamp, signupLanguage);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,107,157,0.16),_transparent_35%),linear-gradient(135deg,#fff8fb_0%,#f7fffd_100%)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Left Card - Branding */}
        <div className="rounded-[32px] border border-white/70 bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-pink-100 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary self-start">
            <ShieldCheck size={16} /> Secure wellness dashboard
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-heading font-bold text-[#1f2937] leading-tight">
            Saheli Patch for modern cycle tracking.
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-8">
            Log in to view cycle insights, temperature trends, and sync your tracking device.
          </p>
        </div>

        {/* Right Card - Form */}
        <div className="rounded-[32px] border border-white/70 bg-[#fffdfd] p-8 md:p-10 shadow-2xl shadow-slate-200">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck size={18} />
            <span className="text-sm font-semibold">Saheli Patch</span>
          </div>
          <h2 className="mt-4 text-3xl font-heading font-bold text-[#1f2937]">
            {showSignup ? 'Create Your Account' : 'Sign In to Your Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {showSignup 
              ? 'Configure your tracking baseline to receive accurate cycle and temperature analysis.' 
              : 'Access your cycle insights and health tracking dashboard.'}
          </p>

          <form className="mt-6 space-y-4" onSubmit={showSignup ? handleSignupSubmit : handleSubmit}>
            {!showSignup ? (
              <>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                  <input
                    type="email"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none ring-0 focus:border-primary"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Password
                  <input
                    type="password"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none ring-0 focus:border-primary"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                  />
                </label>

                {error ? <p className="text-sm text-danger">{error}</p> : null}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                >
                  <LogIn size={18} /> Sign in
                </button>

                <button
                  type="button"
                  onClick={onDemo}
                  className="w-full mt-3 py-3 border border-secondary/20 bg-secondary/5 text-secondary rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/10 transition-transform hover:-translate-y-0.5"
                >
                  Try Demo Mode (Explore with Mock Data)
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSignup(true);
                        setError('');
                      }}
                      className="font-bold text-primary hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                  <input
                    type="text"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none ring-0 focus:border-primary"
                    value={signupName}
                    onChange={(event) => setSignupName(event.target.value)}
                    placeholder="Your name"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                    <input
                      type="number"
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none ring-0 focus:border-primary"
                      value={signupAge}
                      onChange={(event) => setSignupAge(event.target.value)}
                      placeholder="25"
                      min="12"
                      max="60"
                    />
                  </label>

                  <label className="block text-sm font-medium text-gray-700">
                    Cycle Length (Days)
                    <input
                      type="number"
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none ring-0 focus:border-primary"
                      value={signupCycleLength}
                      onChange={(event) => setSignupCycleLength(event.target.value)}
                      placeholder="28"
                      min="21"
                      max="45"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Period Start Date
                    <input
                      type="date"
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none ring-0 focus:border-primary text-gray-700 font-medium"
                      value={signupLastPeriodDate}
                      onChange={(event) => setSignupLastPeriodDate(event.target.value)}
                    />
                  </label>

                  <label className="block text-sm font-medium text-gray-700">
                    Preferred Language
                    <select
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none ring-0 focus:border-primary text-gray-700 font-medium"
                      value={signupLanguage}
                      onChange={(event) => setSignupLanguage(event.target.value as 'en' | 'hi' | 'te')}
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi (हिन्दी)</option>
                      <option value="te">Telugu (తెలుగు)</option>
                    </select>
                  </label>
                </div>

                {error ? <p className="text-sm text-danger mt-2">{error}</p> : null}

                <button
                  type="submit"
                  className="w-full mt-4 py-3 rounded-2xl bg-primary font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                >
                  Create Account
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSignup(false);
                        setError('');
                      }}
                      className="font-bold text-primary hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
