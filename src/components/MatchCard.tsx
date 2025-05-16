
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
    <div className="border border-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-matt-100/30 transition-colors relative overflow-hidden">
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      
      <div className="flex items-center justify-between mb-1 relative z-10">
        <span className="text-xs text-muted-foreground">{date} {time}</span>
        <span className="badge badge-blue">{league}</span>
      </div>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-matt-200 px-1.5 py-0.5 rounded border border-white/5">
            {homeTeam.abbreviation}
          </span>
          <span className="text-sm font-medium">{homeTeam.name}</span>
        </div>
        <span className="text-xs font-medium">vs</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{awayTeam.name}</span>
          <span className="text-xs font-medium bg-matt-200 px-1.5 py-0.5 rounded border border-white/5">
            {awayTeam.abbreviation}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
