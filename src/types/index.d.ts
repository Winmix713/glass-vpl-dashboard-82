
export type MatchStatus = 'completed' | 'live' | 'upcoming';

export interface Match {
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  status: MatchStatus;
}

export interface TeamInfo {
  name: string;
  abbreviation: string;
}

export interface UpcomingMatch {
  date: string;
  time: string;
  league: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
}
