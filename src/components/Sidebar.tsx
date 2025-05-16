
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
  ChevronRight,
  X,
  User,
  LogOut
} from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon, 
  label, 
  sublabel, 
  badge, 
  chevron = false,
  isActive,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      to={to} 
      className={`nav-item group relative transition-all duration-300 overflow-hidden backdrop-blur-sm border border-transparent
      ${isActive 
        ? 'nav-item-active before:shadow-[0_0_10px_rgba(59,130,246,0.5)] border-white/10 bg-gradient-to-r from-matt-100/80 to-matt-100/30' 
        : 'nav-item-inactive hover:border-white/5 hover:bg-matt-100/20'}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass reflective top border effect */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/0 via-white/30 to-white/0"></div>
      
      {/* Glass reflective side borders */}
      <div className="absolute left-0 inset-y-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-white/0"></div>
      <div className="absolute right-0 inset-y-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-white/0"></div>
      
      {/* Active indicator glow */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-app-blue shadow-[0_0_10px_rgba(59,130,246,0.7)] rounded-r-md"></div>
      )}
      
      {/* Background hover effect */}
      <div className={`absolute inset-0 bg-white/0 transition-opacity duration-300 ${isHovered ? 'opacity-5' : 'opacity-0'}`}></div>
      
      <span className={`flex items-center justify-center w-6 h-6 mr-3 transition-transform group-hover:scale-110 z-10 ${isActive ? 'text-app-blue' : 'text-gray-400'}`}>
        {icon}
      </span>
      
      <div className="flex-1 z-10">
        <div className="text-sm font-medium">{label}</div>
        {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
      </div>
      
      {badge && (
        <span className={`badge badge-${badge.color} z-10 shadow-sm backdrop-blur-md border border-white/10`}>
          {badge.text}
        </span>
      )}
      
      {chevron && (
        <ChevronRight 
          className={`ml-2 text-gray-500 h-4 w-4 transition-all z-10 
          ${isHovered ? 'transform translate-x-1' : ''}`} 
        />
      )}
    </Link>
  );
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen = true, 
  onClose 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar on mobile when a link is clicked
  useEffect(() => {
    if (isMobile && onClose) {
      onClose();
    }
  }, [location.pathname, isMobile, onClose]);

  const sidebarClass = `
    w-[240px] h-full flex flex-col pt-4 fixed inset-y-0 left-0 z-50 
    transform transition-all duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:z-auto 
    border-r border-white/5 backdrop-blur-md
    bg-gradient-to-b from-matt to-matt-50/90
    shadow-[0_0_15px_rgba(0,0,0,0.2)]
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
      badge: { text: "NEW", color: "blue" as const }, 
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
      badge: { text: "BETA", color: "blue" as const }, 
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
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-app-blue to-app-blue/70 flex items-center justify-center shadow-md shadow-app-blue/20 group-hover:shadow-app-blue/30 group-hover:from-app-blue/90 group-hover:to-app-blue/60 transition-all duration-300 relative overflow-hidden">
          {/* Glass top highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/0 via-white/40 to-white/0"></div>
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
          onClick={onClose}
        />
      )}
      
      <aside className={sidebarClass}>
        <div className="absolute inset-0 bg-matt-100/5 backdrop-blur-sm pointer-events-none"></div>
        
        {/* Glass reflective top border effect */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/0 via-white/20 to-white/0"></div>
        
        {/* Glass reflective side border */}
        <div className="absolute right-0 inset-y-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-white/0"></div>
        
        {/* Mobile close button */}
        {isMobile && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-matt-100/50 text-gray-400 hover:text-white hover:bg-matt-200/50 transition-all border border-white/10"
          >
            <X size={18} />
          </button>
        )}
        
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
          
          {/* User profile section with glass style */}
          <div className="p-4 mt-4">
            <div className="rounded-lg p-3 backdrop-blur-sm border border-white/10 bg-gradient-to-br from-matt-100/30 to-matt-100/10 shadow-inner relative overflow-hidden">
              {/* Glass reflective top border effect */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/0 via-white/20 to-white/0"></div>
              
              {/* Profile content */}
              <div className="flex items-center gap-3 relative z-10">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-matt-200 to-matt-300 flex items-center justify-center shadow-md border border-white/10">
                  <User className="h-5 w-5 text-white/80" />
                </div>
                
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">John Doe</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
                
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-matt-200/30 transition-colors border border-white/5">
                        <LogOut className="h-4 w-4 text-gray-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Log out</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
