import React from 'react';

interface NavItemProps {
  name: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ name, icon, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 py-2 w-full font-semibold transition-colors duration-200 focus:outline-none focus:text-spotify-text theme-transition ${
        active
          ? 'text-spotify-text'
          : 'text-spotify-muted hover:text-spotify-text'
      }`}
      role="link"
      aria-current={active ? 'page' : undefined}
    >
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="text-sm font-bold tracking-wide select-none">{name}</span>
    </button>
  );
};
