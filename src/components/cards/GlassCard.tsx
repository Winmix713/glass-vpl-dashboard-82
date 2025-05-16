
import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
  title?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  parallax?: boolean;
  gradientBorder?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  title, 
  icon: Icon,
  iconColor = 'text-app-blue', 
  children, 
  action,
  className = '',
  fullHeight = false,
  parallax = false,
  gradientBorder = false
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Handle parallax effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!parallax) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const moveX = (x - centerX) / 25;
    const moveY = (y - centerY) / 25;
    
    setPosition({ x: moveX, y: moveY });
  };
  
  const handleMouseLeave = () => {
    if (parallax) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const borderClass = gradientBorder 
    ? 'border-transparent bg-gradient-to-br p-[1px] from-white/20 via-white/10 to-white/20'
    : 'border border-white/10';

  return (
    <div 
      className={`text-card-foreground relative overflow-hidden backdrop-blur-xl ${borderClass} shadow-lg transition-all duration-300 hover:shadow-xl rounded-lg ${fullHeight ? 'h-full flex flex-col' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Enhanced background effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-matt-50/10 to-matt-50/5 pointer-events-none"></div>
      
      <div 
        className="relative p-6 flex flex-col gap-4 flex-1 z-10 bg-matt-50/90 backdrop-blur-md rounded-lg"
        style={parallax ? {
          transform: `translateX(${position.x}px) translateY(${position.y}px)`,
          transition: 'transform 0.1s ease-out',
        } : {}}
      >
        {title && (
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">{title}</h2>
            {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
          </div>
        )}
        
        <div className={`${fullHeight ? 'flex-1' : ''}`}>
          {children}
        </div>
        
        {action && (
          <div className="mt-auto pt-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlassCard;
