
import React, { useState } from 'react';
import { Heart, Shield, Activity, BarChart, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  onComplete: (profile: UserProfile) => void;
  onDemo: () => void;
}

export const OnboardingPage: React.FC<Props> = ({ onComplete, onDemo }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    lastPeriod: '',
    cycleLength: 28,
  });

  const handleFinish = () => {
    onComplete({
      lastPeriodStart: new Date(formData.lastPeriod),
      avgCycleLength: formData.cycleLength,
      hasDevice: true,
      onboardingComplete: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500">
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 animate-bounce">
                  <Heart size={40} fill="currentColor" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Saheli Patch</h1>
                <p className="text-gray-500">Your smart companion for menstrual health and ovulation tracking.</p>
              </div>
              <div className="space-y-4">
                <FeatureItem icon={Activity} title="Auto Tracking" desc="Syncs seamlessly with your device" />
                <FeatureItem icon={BarChart} title="Deep Insights" desc="Detects ovulation using medical grade logic" />
                <FeatureItem icon={Shield} title="Private & Local" desc="Your data stays on your device" />
              </div>
              <div className="space-y-3 pt-4">
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-pink-500 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all flex items-center justify-center gap-2"
                >
                  Get Started <ChevronRight size={20} />
                </button>
                <button 
                  onClick={onDemo}
                  className="w-full bg-white border-2 border-pink-100 text-pink-500 font-semibold py-4 rounded-2xl hover:bg-pink-50 transition-all"
                >
                  Try Demo
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Setup your profile</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Last period start date</label>
                  <input 
                    type="date" 
                    className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-pink-500 outline-none transition-all"
                    value={formData.lastPeriod}
                    onChange={(e) => setFormData({...formData, lastPeriod: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Average cycle length ({formData.cycleLength} days)</label>
                  <input 
                    type="range" min="21" max="35" 
                    className="w-full accent-pink-500 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                    value={formData.cycleLength}
                    onChange={(e) => setFormData({...formData, cycleLength: parseInt(e.target.value)})}
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>21 days</span>
                    <span>35 days</span>
                  </div>
                </div>
              </div>
              <button 
                disabled={!formData.lastPeriod}
                onClick={handleFinish}
                className="w-full bg-pink-500 disabled:bg-pink-200 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all"
              >
                Complete Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title, desc }: any) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
    <div className="mt-1 p-2 bg-white rounded-xl text-pink-500 shadow-sm"><Icon size={20} /></div>
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  </div>
);
