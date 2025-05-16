
import React from 'react';
import { Trophy, Calendar } from 'lucide-react';
import EnhancedMatchTable from '@/components/EnhancedMatchTable';
import { Match } from '@/types';

interface MatchTablesSectionProps {
  recentMatches: Match[];
  upcomingFixtures: Match[];
}

const MatchTablesSection: React.FC<MatchTablesSectionProps> = ({ 
  recentMatches, 
  upcomingFixtures 
}) => {
  return (
    <>
      <div className="col-span-12 lg:col-span-6 card-entrance stagger-1">
        <EnhancedMatchTable 
          matches={recentMatches} 
          title="Recent Matches" 
          icon={<Trophy className="h-5 w-5" />} 
          iconColor="text-app-amber" 
        />
      </div>
      <div className="col-span-12 lg:col-span-6 card-entrance stagger-2">
        <EnhancedMatchTable 
          matches={upcomingFixtures} 
          title="Upcoming Fixtures" 
          icon={<Calendar className="h-5 w-5" />} 
          iconColor="text-app-blue" 
        />
      </div>
    </>
  );
};

export default MatchTablesSection;
