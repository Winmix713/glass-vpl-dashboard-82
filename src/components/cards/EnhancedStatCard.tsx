
import React, { useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    isPositive?: boolean;
    text: string;
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: number[];
  className?: string;
  animationDelay?: number;
}

const EnhancedStatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  iconColor = "text-app-blue",
  iconBgColor = "bg-app-blue/10",
  trend = [],
  className = '',
  animationDelay = 0
}) => {
  const valueRef = useRef<HTMLSpanElement>(null);
  
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
      
      // Delay animation based on card position
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, animationDelay * 150);
    }
  }, [value, animationDelay]);

  // Calculate trend graph if provided
  const renderTrendGraph = () => {
    if (!trend.length) return null;
    
    const min = Math.min(...trend);
    const max = Math.max(...trend);
    const range = max - min || 1;
    
    return (
      <div className="absolute bottom-4 right-4 h-10 flex items-end gap-[2px] opacity-30">
        {trend.map((point, i) => {
          const height = ((point - min) / range) * 100;
          const isLast = i === trend.length - 1;
          
          return (
            <div 
              key={i} 
              className={`w-1 rounded-t-sm ${isLast ? 'bg-app-blue' : 'bg-gray-400'}`} 
              style={{ 
                height: `${Math.max(10, height)}%`,
                transition: 'height 1s ease-out'
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className={`rounded-lg border text-card-foreground glass-card glass-card-hover transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden ${className}`}
      style={{ animationDelay: `${animationDelay * 150}ms` }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span 
              ref={valueRef}
              className="text-3xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent"
            >
              {typeof value === 'number' ? '0' : value}
            </span>
          </div>
          <div className={`h-12 w-12 rounded-lg ${iconBgColor} flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        {change && (
          <div className="mt-4 flex items-center text-sm">
            <span className={change.isPositive ? "text-app-green font-medium" : "text-app-red font-medium"}>
              {change.value}
            </span>
            <span className="text-muted-foreground ml-1">{change.text}</span>
          </div>
        )}
        
        {renderTrendGraph()}
      </div>
    </div>
  );
};

export default EnhancedStatCard;
