
import React from 'react';

interface Match {
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  status: 'completed' | 'live' | 'upcoming';
}

interface MatchTableProps {
  matches: Match[];
}

const MatchTable: React.FC<MatchTableProps> = ({ matches }) => {
  const statusBadge = (status: string) => {
    switch (status) {
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

  return (
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
          {matches.map((match, index) => (
            <tr 
              key={index} 
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
  );
};

export default MatchTable;
