export type MatchStatus = 'completed' | 'live' | 'upcoming' | 'Completed' | 'Live' | 'Upcoming';

export interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  status: string;
}

export interface TeamInfo {
  id: string;
  name: string;
  stats: string;
  record: string;
  trend: 'up' | 'down';
  change: string;
}

export interface UpcomingMatch {
  id: string;
  date: string;
  time: string;
  league: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
}

export interface StatCardChange {
  value: string | number;
  isPositive?: boolean;
  text: string;
}

export interface MediaCardProps {
  title: string;
  videoSrc: string;
  isIframe?: boolean;
  description?: string;
  animationDelay?: number;
}

// Add type for icon props
export type IconComponent = React.FC<{ className?: string }>;
