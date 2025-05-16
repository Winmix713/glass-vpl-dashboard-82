
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PanelLeft, 
  Bell, 
  LayoutDashboard, 
  Users, 
  Trophy, 
  BarChart2, 
  Layers, 
  BarChart, 
  Shield, 
  Settings 
} from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { path: '/', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { path: '/teams', icon: <Users className="w-4 h-4" />, label: 'Teams' },
    { path: '/matches', icon: <Trophy className="w-4 h-4" />, label: 'Matches' },
    { path: '/analysis', icon: <BarChart2 className="w-4 h-4" />, label: 'Analysis' },
    { path: '/patterns', icon: <Layers className="w-4 h-4" />, label: 'Patterns' },
    { path: '/statistics', icon: <BarChart className="w-4 h-4" />, label: 'Statistics' },
    { path: '/league-management', icon: <Shield className="w-4 h-4" />, label: 'League' },
    { path: '/settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
  ];

  const triggerSidebarToggle = () => {
    window.dispatchEvent(new Event('toggle-sidebar'));
  };

  return (
    <header className={`sticky top-0 z-30 h-16 backdrop-blur-xl flex items-center justify-between px-4 transition-all duration-300 ${
      scrolled ? 'bg-matt/80 shadow-lg' : 'bg-matt border-b border-matt-200'
    }`}>
      <div className="flex items-center gap-4">
        <button
          className="inline-flex items-center justify-center h-8 w-8 lg:hidden hover:bg-matt-100 rounded-md transition-all duration-200 hover:text-white"
          onClick={triggerSidebarToggle}
        >
          <PanelLeft className="h-5 w-5 text-gray-300" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>
        <div className="md:block">
          <h1 className="text-lg font-semibold text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{title}</h1>
        </div>
      </div>

      <nav className="hidden md:flex items-center space-x-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-matt-100 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-matt-100/50'}
              `}
            >
              {item.icon}
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <button className="inline-flex items-center justify-center h-10 w-10 relative hover:bg-matt-100 rounded-full transition-all duration-200 group">
          <Bell className="h-5 w-5 text-gray-400 group-hover:text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-app-blue rounded-full group-hover:animate-pulse" />
        </button>
      </div>
    </header>
  );
};

export default Header;
