
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  LayoutDashboard, 
  Users, 
  BarChart2, 
  Layers, 
  BarChart, 
  Shield, 
  Settings,
  ChevronRight
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  badge?: {
    text: string;
    color: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  };
  chevron?: boolean;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon, 
  label, 
  sublabel, 
  badge, 
  chevron = false,
  isActive 
}) => {
  return (
    <Link 
      to={to} 
      className={`nav-item group ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
    >
      <span className="flex items-center justify-center w-6 h-6 mr-3 transition-transform group-hover:scale-110">
        {icon}
      </span>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
      </div>
      {badge && (
        <span className={`badge badge-${badge.color}`}>
          {badge.text}
        </span>
      )}
      {chevron && (
        <ChevronRight className="ml-2 text-gray-500 h-4 w-4 transition-all group-hover:transform group-hover:translate-x-1" />
      )}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar on mobile when a link is clicked
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Make sidebar externally controllable via an event
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggle-sidebar', handleToggle);
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggle);
    };
  }, []);

  const sidebarClass = `
    w-[240px] h-full bg-matt flex flex-col pt-4 fixed inset-y-0 left-0 z-50 
    transform transition-all duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:z-auto border-r border-matt-200 backdrop-blur-sm
    bg-gradient-to-b from-matt to-matt-50/90
  `;

  const navItems = [
    { 
      to: "/", 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      label: "Dashboard", 
      sublabel: "Overview & Analytics", 
      isActive: location.pathname === "/" 
    },
    { 
      to: "/teams", 
      icon: <Users className="h-5 w-5" />, 
      label: "Teams", 
      sublabel: "Team Management", 
      chevron: true, 
      isActive: location.pathname === "/teams" 
    },
    { 
      to: "/matches", 
      icon: <Trophy className="h-5 w-5" />, 
      label: "Matches", 
      sublabel: "Match Schedules", 
      chevron: true, 
      isActive: location.pathname === "/matches" 
    },
    { 
      to: "/analysis", 
      icon: <BarChart2 className="h-5 w-5" />, 
      label: "Analysis", 
      sublabel: "Performance Analytics", 
      badge: { text: "NEW", color: "blue" }, 
      isActive: location.pathname === "/analysis" 
    },
    { 
      to: "/patterns", 
      icon: <Layers className="h-5 w-5" />, 
      label: "Patterns", 
      sublabel: "Game Patterns", 
      chevron: true, 
      isActive: location.pathname === "/patterns" 
    },
    { 
      to: "/statistics", 
      icon: <BarChart className="h-5 w-5" />, 
      label: "Statistics", 
      sublabel: "Advanced Statistics", 
      badge: { text: "BETA", color: "blue" }, 
      isActive: location.pathname === "/statistics" 
    },
    { 
      to: "/league-management", 
      icon: <Shield className="h-5 w-5" />, 
      label: "League Management", 
      sublabel: "League Operations", 
      chevron: true, 
      isActive: location.pathname === "/league-management" 
    },
    { 
      to: "/settings", 
      icon: <Settings className="h-5 w-5" />, 
      label: "Settings", 
      sublabel: "System Settings", 
      chevron: true, 
      isActive: location.pathname === "/settings" 
    },
  ];

  const Logo = () => (
    <div className="px-4 mb-6">
      <Link to="/" className="flex items-center gap-1.5 group">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-app-blue to-app-blue/70 flex items-center justify-center shadow-md shadow-app-blue/20 group-hover:shadow-app-blue/30 group-hover:from-app-blue/90 group-hover:to-app-blue/60 transition-all duration-300">
          <Trophy className="text-white h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">WINMIX</span>
          <span className="text-[8px] -mt-0.5 text-app-blue">TIPSTER</span>
        </div>
      </Link>
    </div>
  );

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ease-in-out backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={sidebarClass}>
        <div className="absolute inset-0 bg-matt-100/5 backdrop-blur-sm pointer-events-none"></div>
        <div className="relative z-10">
          <Logo />
          
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-none">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                to={item.to}
                icon={item.icon}
                label={item.label}
                sublabel={item.sublabel}
                badge={item.badge}
                chevron={item.chevron}
                isActive={item.isActive}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
