
import React from 'react';
import { Calendar } from 'lucide-react';
import GlassCard from './cards/GlassCard';
import MatchCard from './MatchCard';
import { TeamInfo } from '@/types';

interface UpcomingMatch {
  id: string;
  date: string;
  time: string;
  league: string;
  homeTeam: {
    name: string;
    shortCode: string;
  };
  awayTeam: {
    name: string;
    shortCode: string;
  };
}

interface UpcomingMatchesProps {
  matches: UpcomingMatch[];
}

const UpcomingMatches: React.FC<UpcomingMatchesProps> = ({ matches }) => {
  // Convert matches to the format expected by MatchCard
  const convertedMatches = matches.map(match => ({
    date: match.date,
    time: match.time,
    league: match.league,
    homeTeam: {
      name: match.homeTeam.name,
      abbreviation: match.homeTeam.shortCode,
    },
    awayTeam: {
      name: match.awayTeam.name,
      abbreviation: match.awayTeam.shortCode,
    },
  }));

  const ActionButton = () => (
    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 h-10 px-4 py-2 w-full border border-matt-200 hover:bg-matt-100 text-muted-foreground hover:text-white hover:border-matt-300">
      View All Upcoming
    </button>
  );

  return (
    <GlassCard 
      title="Upcoming Matches" 
      icon={Calendar} 
      iconColor="text-app-green"
      action={<ActionButton />}
      fullHeight
      className="animate-on-load opacity-0"
    >
      <div className="space-y-4">
        {convertedMatches.map((match, index) => (
          <MatchCard 
            key={index}
            date={match.date}
            time={match.time}
            league={match.league}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
          />
        ))}
      </div>
    </GlassCard>
  );
};

export default UpcomingMatches;
