
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    positive?: boolean;
    text: string;
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  color 
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-app-blue/10',
      text: 'text-app-blue'
    },
    green: {
      bg: 'bg-app-green/10',
      text: 'text-app-green'
    },
    purple: {
      bg: 'bg-app-purple/10',
      text: 'text-app-purple'
    },
    amber: {
      bg: 'bg-app-amber/10',
      text: 'text-app-amber'
    }
  };

  return (
    <div className="rounded-lg border text-card-foreground glass-card glass-card-hover">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span className="text-3xl font-bold text-white">{value}</span>
          </div>
          <div className={`h-12 w-12 rounded-lg ${colorMap[color].bg} flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${colorMap[color].text}`} />
          </div>
        </div>
        {change && (
          <div className="mt-4 flex items-center text-sm">
            <span className={change.positive ? "text-app-green font-medium" : "text-app-red font-medium"}>
              {change.value}
            </span>
            <span className="text-muted-foreground ml-1">{change.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
