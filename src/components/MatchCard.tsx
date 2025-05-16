
import React from 'react';

interface MatchCardProps {
  date: string;
  time: string;
  league: string;
  homeTeam: {
    name: string;
    abbreviation: string;
  };
  awayTeam: {
    name: string;
    abbreviation: string;
  };
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  date,
  time,
  league,
  homeTeam,
  awayTeam
}) => {
  return (
    <div className="backdrop-blur-sm rounded-lg p-3 hover:bg-matt-100/30 transition-colors relative overflow-hidden">
      {/* Glass border effect */}
      <div className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none"></div>
      
      {/* Glass reflective top border */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-t-lg"></div>
      
      {/* Glass reflective left/right borders */}
      <div className="absolute left-0 inset-y-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-white/0"></div>
      <div className="absolute right-0 inset-y-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-white/0"></div>
      
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      
      <div className="flex items-center justify-between mb-1 relative z-10">
        <span className="text-xs text-muted-foreground">{date} {time}</span>
        <span className="badge badge-blue shadow-sm border border-white/10 backdrop-blur-sm">{league}</span>
      </div>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-matt-200/50 px-1.5 py-0.5 rounded border border-white/5 backdrop-blur-sm">
            {homeTeam.abbreviation}
          </span>
          <span className="text-sm font-medium">{homeTeam.name}</span>
        </div>
        <span className="text-xs font-medium">vs</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{awayTeam.name}</span>
          <span className="text-xs font-medium bg-matt-200/50 px-1.5 py-0.5 rounded border border-white/5 backdrop-blur-sm">
            {awayTeam.abbreviation}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
