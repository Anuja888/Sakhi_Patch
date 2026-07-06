import React, { useState } from 'react';
import { ShieldCheck, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => void;
  onDemo: () => void;
  onSignup?: (name: string, age: number) => void;
}

const demoCredentials = [
  { label: 'Demo viewer', email: 'demo@saheli.com', password: 'demo123', mode: 'demo' },
  { label: 'Care team', email: 'care@saheli.com', password: 'care123', mode: 'care' },
];

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onDemo, onSignup }) => {
  const [email, setEmail] = useState('demo@saheli.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupAge, setSignupAge] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter both email and password.');
      return;
    }

    const credential = demoCredentials.find(
      (c) => c.email === email.trim().toLowerCase() && c.password === password
    );

    if (!credential) {
      setError('Use demo@saheli.com / demo123 or care@saheli.com / care123.');
      return;
    }

    setError('');
    
    if (credential.mode === 'care' && onDemo) {
      // Store care team data for demo mode with care data
      window.localStorage.setItem('saheli_care_team', 'true');
    }
    onLogin(email.trim(), password);
  };

  const handleDemoClick = () => {
    window.localStorage.removeItem('saheli_care_team');
    onDemo();
  };

  const handleSignupSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const ageNum = parseInt(signupAge, 10);
    if (!signupName.trim() || !ageNum || ageNum < 12 || ageNum > 60) {
      setError('Please enter a valid name and age (12-60).');
      return;
    }
    onSignup?.(signupName.trim(), ageNum);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,107,157,0.16),_transparent_35%),linear-gradient(135deg,#fff8fb_0%,#f7fffd_100%)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/70 bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-pink-100">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            <ShieldCheck size={16} /> Secure wellness dashboard
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-heading font-bold text-[#1f2937]">
            Saheli Patch for modern cycle tracking.
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-8">
            Log in to view cycle insights, temperature trends, and device sync updates, or jump into a guided demo experience.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {demoCredentials.map((credential) => (
              <div key={credential.email} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-800">{credential.label}</p>
                <p className="mt-1 text-xs text-gray-500">{credential.email}</p>
                <p className="text-xs text-gray-500">Password: {credential.password}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-[#fffdfd] p-8 md:p-10 shadow-2xl shadow-slate-200">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={18} />
            <span className="text-sm font-semibold">Demo-ready website experience</span>
          </div>
          <h2 className="mt-4 text-3xl font-heading font-bold text-[#1f2937]">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Use the demo credentials below or explore the experience instantly.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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

             {!showSignup ? (
               <>
                 <button
                   type="submit"
                   className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                 >
                   <LogIn size={18} /> Sign in
                 </button>

                 <div className="flex gap-3 mt-4">
                   <button
                     type="button"
                     onClick={handleDemoClick}
                     className="flex-1 items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 font-semibold text-primary"
                   >
                     Demo View
                   </button>
                   <button
                     type="button"
                     onClick={() => setShowSignup(true)}
                     className="flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-600"
                   >
                     <UserPlus size={18} /> Sign Up
                   </button>
                 </div>
               </>
             ) : (
               <>
                 <label className="block text-sm font-medium text-gray-700 mt-4">
                   Full Name
                   <input
                     type="text"
                     className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none ring-0 focus:border-primary"
                     value={signupName}
                     onChange={(event) => setSignupName(event.target.value)}
                     placeholder="Your name"
                   />
                 </label>

                 <label className="block text-sm font-medium text-gray-700 mt-4">
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

                 <div className="flex gap-3 mt-4">
                   <button
                     type="button"
                     onClick={() => setShowSignup(false)}
                     className="flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-600"
                   >
                     Back
                   </button>
                   <button
                     type="button"
                     onClick={handleSignupSubmit}
                     className="flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-white"
                   >
                     Create Account
                   </button>
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
