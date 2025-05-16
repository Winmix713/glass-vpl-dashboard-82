
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  title, 
  icon: Icon,
  iconColor = 'text-app-blue', 
  children, 
  action,
  className = '',
  fullHeight = false
}) => {
  return (
    <div className={`rounded-lg border text-card-foreground relative overflow-hidden backdrop-blur-xl bg-matt-50/30 border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl ${fullHeight ? 'h-full flex flex-col' : ''} ${className}`}>
      {/* Enhanced background effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-matt-50/10 to-matt-50/5 pointer-events-none"></div>
      
      <div className="relative p-6 flex flex-col gap-4 flex-1 z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">{title}</h2>
          {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
        </div>
        
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
