
import React from 'react';
import { Bell, LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 px-5 py-4 backdrop-blur lg:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <div className="h-4 w-4 rounded-full bg-white opacity-90" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-[#333]">Saheli Patch</h1>
            <p className="text-xs text-gray-500">Web dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary">
            <Bell size={20} />
          </button>
          {onLogout ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
