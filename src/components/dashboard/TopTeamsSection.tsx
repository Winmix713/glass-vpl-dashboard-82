
import React from 'react';
import { BarChart2 } from 'lucide-react';
import GlassCard from '@/components/cards/GlassCard';
import { TeamInfo } from '@/types';

interface TopTeamsSectionProps {
  teams: TeamInfo[];
}

const TopTeamsSection: React.FC<TopTeamsSectionProps> = ({ teams }) => {
  return (
    <GlassCard
      title="Top Teams"
      icon={BarChart2}
      iconColor="text-app-purple"
      className="col-span-12 lg:col-span-4 card-entrance stagger-1"
      gradientBorder
    >
      <div className="space-y-2">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className="flex items-center gap-4 p-3 rounded-md bg-matt-50/20 backdrop-blur-sm relative overflow-hidden group hover:bg-matt-100/30 transition-all duration-300 border border-white/5"
          >
            {/* Glass reflective effects */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/0 via-white/20 to-white/0"></div>
            <div className="absolute left-0 inset-y-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-white/0"></div>

            {/* Team ranking */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-matt-100/60 flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>

            {/* Team details */}
            <div className="flex-grow">
              <div className="font-medium text-white">{team.name}</div>
              <div className="text-xs text-gray-400">{team.stats}</div>
            </div>

            {/* Win/Loss indicator */}
            <div className="text-right">
              <div className="text-sm font-semibold">{team.record}</div>
              <div className={`text-xs ${team.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {team.trend === 'up' ? '▲' : '▼'} {team.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default TopTeamsSection;
