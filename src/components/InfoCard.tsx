
import React from 'react';
import { Info } from 'lucide-react';
import { IconComponent } from '@/types';

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  iconColor?: string;
  bgColor?: string;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon = <Info />,
  iconColor = "text-app-blue",
  bgColor = "bg-app-blue/10",
  className = "",
}) => {
  return (
    <div 
      className={`rounded-lg text-card-foreground ${bgColor} backdrop-blur-md animate-on-load opacity-0 hover:bg-app-blue/15 transition-all duration-300 shadow-sm relative overflow-hidden group ${className}`}
    >
      {/* Enhanced glass border effect */}
      <div className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none transition-all duration-300 group-hover:border-white/20"></div>
      
      {/* Enhanced glass reflective top border */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/0 via-white/30 to-white/0 rounded-t-lg"></div>
      
      {/* Enhanced glass reflective left/right borders */}
      <div className="absolute left-0 inset-y-0 w-[1px] bg-gradient-to-b from-white/15 via-white/8 to-white/0"></div>
      <div className="absolute right-0 inset-y-0 w-[1px] bg-gradient-to-b from-white/15 via-white/8 to-white/0"></div>
      
      <div className="space-y-1.5 p-6 flex flex-row items-start gap-3 pb-2 relative overflow-hidden">
        {/* Enhanced glow effect */}
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
        <div className={`${iconColor} mt-0.5 z-10 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="z-10">
          <h3 className="font-semibold tracking-tight text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
