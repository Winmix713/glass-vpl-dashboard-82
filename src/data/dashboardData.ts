
import { Match, TeamInfo } from '@/types';

// Sample data for the dashboard
export const topTeams: TeamInfo[] = [
  {
    id: "1",
    name: "Manchester United",
    stats: "Points: 72 | GD: +35",
    record: "24W - 5D - 3L",
    trend: "up",
    change: "+2"
  },
  {
    id: "2",
    name: "Liverpool",
    stats: "Points: 70 | GD: +42",
    record: "22W - 4D - 6L",
    trend: "up",
    change: "+1"
  },
  {
    id: "3",
    name: "Manchester City",
    stats: "Points: 68 | GD: +38",
    record: "21W - 5D - 6L",
    trend: "down",
    change: "-1"
  },
  {
    id: "4",
    name: "Chelsea",
    stats: "Points: 65 | GD: +27",
    record: "20W - 5D - 7L",
    trend: "up",
    change: "+2"
  },
  {
    id: "5",
    name: "Arsenal",
    stats: "Points: 61 | GD: +23",
    record: "18W - 7D - 7L",
    trend: "down",
    change: "-1"
  }
];

export const upcomingMatches = [
  {
    id: "1",
    date: "May 20",
    time: "15:00",
    league: "Premier League",
    homeTeam: {
      name: "Manchester United",
      shortCode: "MUN"
    },
    awayTeam: {
      name: "Liverpool",
      shortCode: "LIV"
    }
  },
  {
    id: "2",
    date: "May 21",
    time: "17:30",
    league: "La Liga",
    homeTeam: {
      name: "Barcelona",
      shortCode: "BAR"
    },
    awayTeam: {
      name: "Real Madrid",
      shortCode: "RMA"
    }
  },
  {
    id: "3",
    date: "May 22",
    time: "19:45",
    league: "Serie A",
    homeTeam: {
      name: "Juventus",
      shortCode: "JUV"
    },
    awayTeam: {
      name: "AC Milan",
      shortCode: "MIL"
    }
  }
];

export const recentMatches: Match[] = [
  {
    id: "1",
    date: "May 14",
    homeTeam: "Chelsea",
    awayTeam: "Brighton",
    score: "2 - 0",
    status: "Completed"
  },
  {
    id: "2",
    date: "May 13",
    homeTeam: "Manchester City",
    awayTeam: "Everton",
    score: "3 - 1",
    status: "Completed"
  },
  {
    id: "3",
    date: "May 13",
    homeTeam: "Liverpool",
    awayTeam: "Newcastle",
    score: "4 - 0",
    status: "Completed"
  },
  {
    id: "4",
    date: "May 12",
    homeTeam: "Arsenal",
    awayTeam: "Wolves",
    score: "2 - 1",
    status: "Completed"
  }
];

export const upcomingFixtures: Match[] = [
  {
    id: "1",
    date: "May 20",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    score: "vs",
    status: "Upcoming"
  },
  {
    id: "2",
    date: "May 21",
    homeTeam: "Tottenham",
    awayTeam: "West Ham",
    score: "vs",
    status: "Upcoming"
  },
  {
    id: "3",
    date: "May 21",
    homeTeam: "Leicester",
    awayTeam: "Crystal Palace",
    score: "vs",
    status: "Upcoming"
  },
  {
    id: "4",
    date: "May 22",
    homeTeam: "Leeds",
    awayTeam: "Brentford",
    score: "vs",
    status: "Upcoming"
  }
];

export const mediaItems = [
  {
    id: "1",
    title: "Match Highlights: Chelsea vs. Brighton",
    type: "video" as const,
    source: "https://example.com/videos/chelsea-brighton",
    duration: "5:32",
    views: "125K",
    badge: "New"
  },
  {
    id: "2",
    title: "Post-Match Analysis: Liverpool's Tactical Masterclass",
    type: "video" as const,
    source: "https://example.com/videos/liverpool-analysis",
    duration: "12:15",
    views: "83K"
  },
  {
    id: "3",
    title: "Top 10 Goals of the Week",
    type: "image" as const,
    source: "https://example.com/images/top-goals",
    views: "254K",
    badge: "Trending"
  },
  {
    id: "4",
    title: "Manager Interview: Pep Guardiola",
    type: "video" as const,
    source: "https://example.com/videos/guardiola-interview",
    duration: "8:47",
    views: "92K"
  }
];
