
import React from 'react';
import UpcomingMatches from '@/components/UpcomingMatches';

interface UpcomingMatchesSectionProps {
  matches: {
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
  }[];
}

const UpcomingMatchesSection: React.FC<UpcomingMatchesSectionProps> = ({ matches }) => {
  return (
    <div className="col-span-12 lg:col-span-4 card-entrance stagger-2">
      <UpcomingMatches matches={matches} />
    </div>
  );
};

export default UpcomingMatchesSection;
