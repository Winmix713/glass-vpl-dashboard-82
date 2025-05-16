import React, { useState } from 'react';
import { BarChart2, ChevronDown, ChevronRight, Search } from 'lucide-react';

interface MatchData {
  id: string;
  date: string;
  home: string;
  away: string;
  league: string;
  prediction: string;
  confidence: number;
  result?: string;
}

const EnhancedMatchTable: React.FC = () => {
  const [matches, setMatches] = useState<MatchData[]>([
    { id: '1', date: '2024-08-15', home: 'Team A', away: 'Team B', league: 'League X', prediction: 'Home Win', confidence: 75 },
    { id: '2', date: '2024-08-16', home: 'Team C', away: 'Team D', league: 'League Y', prediction: 'Away Win', confidence: 82 },
    { id: '3', date: '2024-08-17', home: 'Team E', away: 'Team F', league: 'League Z', prediction: 'Draw', confidence: 55 },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof MatchData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMatches = matches.filter(match =>
    match.home.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.away.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.league.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (column: keyof MatchData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    }
    return 0;
  });
  
  const IconComponent = ({ confidence }: { confidence: number }) => {
    if (confidence >= 80) {
      return <BarChart2 className="h-4 w-4 text-app-green" />;
    } else if (confidence >= 60) {
      return <BarChart2 className="h-4 w-4 text-app-blue" />;
    } else {
      return <BarChart2 className="h-4 w-4 text-app-amber" />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Match Predictions</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search matches..."
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                onClick={() => handleSort('date')}
              >
                Date <ChevronDown className="inline-block w-4 h-4 ml-1" />
              </th>
              <th
                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                onClick={() => handleSort('home')}
              >
                Home Team <ChevronDown className="inline-block w-4 h-4 ml-1" />
              </th>
              <th
                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                onClick={() => handleSort('away')}
              >
                Away Team <ChevronDown className="inline-block w-4 h-4 ml-1" />
              </th>
              <th
                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                onClick={() => handleSort('league')}
              >
                League <ChevronDown className="inline-block w-4 h-4 ml-1" />
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Prediction
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Confidence
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMatches.map(match => (
              <tr key={match.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{match.date}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{match.home}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{match.away}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{match.league}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{match.prediction}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="relative inline-block px-3 py-1 font-semibold leading-tight">
                    <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                    <span className="relative flex items-center gap-1">
                      {match.confidence}%
                      <IconComponent confidence={match.confidence} />
                    </span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">TBD</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnhancedMatchTable;
