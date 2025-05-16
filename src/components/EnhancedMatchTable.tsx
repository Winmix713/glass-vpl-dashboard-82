
import React from 'react';
import { Trophy } from 'lucide-react';
import GlassCard from './cards/GlassCard';

interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  status: 'Completed' | 'Live' | 'Upcoming';
}

interface MatchTableProps {
  matches: Match[];
  title?: string;
  icon?: React.ReactNode;
  iconColor?: string;
}

const EnhancedMatchTable: React.FC<MatchTableProps> = ({ 
  matches, 
  title = "Matches",
  icon = <Trophy className="h-5 w-5" />,
  iconColor = "text-app-amber"
}) => {
  const statusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <span className="badge badge-green">Completed</span>;
      case 'live':
        return <span className="badge badge-red">Live</span>;
      case 'upcoming':
        return <span className="badge badge-blue">Upcoming</span>;
      default:
        return null;
    }
  };

  const ActionButton = () => (
    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 h-10 px-4 py-2 w-full border border-matt-200 hover:bg-matt-100 text-muted-foreground hover:text-white hover:border-matt-300">
      View All Matches
    </button>
  );

  return (
    <GlassCard 
      title={title}
      icon={() => icon}
      iconColor={iconColor}
      action={<ActionButton />}
      className="animate-on-load opacity-0"
    >
      <div className="overflow-x-auto animate-fade-in">
        <table className="w-full">
          <thead>
            <tr className="border-b border-matt-200">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Home Team</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Away Team</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Score</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr 
                key={match.id} 
                className={`border-b border-matt-200 transition-colors hover:bg-matt-100/30`}
              >
                <td className="py-3 px-2 text-sm">{match.date}</td>
                <td className="py-3 px-2 text-sm font-medium">{match.homeTeam}</td>
                <td className="py-3 px-2 text-sm">{match.awayTeam}</td>
                <td className="py-3 px-2 text-sm font-medium">{match.score}</td>
                <td className="py-3 px-2">{statusBadge(match.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default EnhancedMatchTable;
