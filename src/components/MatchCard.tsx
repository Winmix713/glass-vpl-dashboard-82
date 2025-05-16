
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
    <div className="border border-matt-200 rounded-lg p-3 hover:bg-matt-100/30 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{date} {time}</span>
        <span className="badge badge-blue">{league}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-matt-200 px-1.5 py-0.5 rounded">
            {homeTeam.abbreviation}
          </span>
          <span className="text-sm font-medium">{homeTeam.name}</span>
        </div>
        <span className="text-xs font-medium">vs</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{awayTeam.name}</span>
          <span className="text-xs font-medium bg-matt-200 px-1.5 py-0.5 rounded">
            {awayTeam.abbreviation}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
