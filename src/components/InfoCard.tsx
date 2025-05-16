
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
      className={`rounded-lg border text-card-foreground ${bgColor} border-white/10 backdrop-blur-md animate-on-load opacity-0 hover:bg-app-blue/15 transition-all duration-300 shadow-sm ${className}`}
    >
      <div className="space-y-1.5 p-6 flex flex-row items-start gap-3 pb-2 relative overflow-hidden">
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
        <div className={`${iconColor} mt-0.5 z-10`}>
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
