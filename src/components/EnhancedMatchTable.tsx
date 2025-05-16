
import React, { useState } from 'react';
import { BarChart2, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Match } from '@/types';

interface EnhancedMatchTableProps {
  matches: Match[];
  title: string;
  icon: React.ReactNode;
  iconColor: string;
}

const EnhancedMatchTable: React.FC<EnhancedMatchTableProps> = ({ matches, title, icon, iconColor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Match | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMatches = matches.filter(match =>
    match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (column: keyof Match) => {
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
      }
    }
    return 0;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-green-500/15 text-green-500";
      case 'live':
        return "bg-red-500/15 text-red-500";
      case 'upcoming':
        return "bg-blue-500/15 text-blue-500";
      default:
        return "bg-gray-500/15 text-gray-500";
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-md ${iconColor.replace('text-', 'bg-').replace('app-', '')}/10`}>
            {icon}
          </div>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
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
                onClick={() => handleSort('homeTeam')}
              >
                Home Team <ChevronDown className="inline-block w-4 h-4 ml-1" />
              </th>
              <th
                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                onClick={() => handleSort('awayTeam')}
              >
                Away Team <ChevronDown className="inline-block w-4 h-4 ml-1" />
              </th>
              <th
                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Score
              </th>
              <th
                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                onClick={() => handleSort('status')}
              >
                Status <ChevronDown className="inline-block w-4 h-4 ml-1" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMatches.map((match, index) => (
              <tr key={match.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{match.date}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap font-medium">{match.homeTeam}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{match.awayTeam}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap font-medium">{match.score}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 rounded-full ${getStatusBadgeClass(match.status)}`}>
                    {match.status}
                  </span>
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
