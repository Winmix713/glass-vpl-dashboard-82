
import React, { useEffect, useRef } from 'react';
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
  color: 'blue' | 'green' | 'purple' | 'amber' | 'red';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  color,
  className = ''
}) => {
  const valueRef = useRef<HTMLSpanElement>(null);
  
  const colorMap = {
    blue: {
      bg: 'bg-app-blue/10',
      text: 'text-app-blue',
      border: 'border-app-blue/20'
    },
    green: {
      bg: 'bg-app-green/10',
      text: 'text-app-green',
      border: 'border-app-green/20'
    },
    purple: {
      bg: 'bg-app-purple/10',
      text: 'text-app-purple',
      border: 'border-app-purple/20'
    },
    amber: {
      bg: 'bg-app-amber/10',
      text: 'text-app-amber',
      border: 'border-app-amber/20'
    },
    red: {
      bg: 'bg-app-red/10',
      text: 'text-app-red',
      border: 'border-app-red/20'
    }
  };

  // Counting animation effect
  useEffect(() => {
    if (valueRef.current && typeof value === 'number') {
      const endValue = value;
      const duration = 1500;
      const startTime = Date.now();
      
      const animate = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentValue = Math.floor(progress * endValue);
        
        if (valueRef.current) {
          valueRef.current.textContent = currentValue.toString();
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else if (valueRef.current) {
          valueRef.current.textContent = endValue.toString();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value]);

  return (
    <div className={`rounded-lg border text-card-foreground glass-card glass-card-hover transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${colorMap[color].border} ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span 
              ref={valueRef}
              className="text-3xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent"
            >
              {value}
            </span>
          </div>
          <div className={`h-12 w-12 rounded-lg ${colorMap[color].bg} flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
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
