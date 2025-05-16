
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import StatCard from '@/components/cards/StatCard';
import GlassCard from '@/components/cards/GlassCard';
import MediaCard from '@/components/cards/MediaCard';
import MatchTable from '@/components/MatchTable';
import MatchCard from '@/components/MatchCard';
import { Trophy, Users, Calendar, BarChart, Info } from 'lucide-react';
import { Match, UpcomingMatch } from '@/types';

const Index = () => {
  // Sample data
  const recentMatches: Match[] = [
    { date: '2025-05-15', homeTeam: 'Liverpool', awayTeam: 'Manchester Kék', score: '2-1', status: 'completed' },
    { date: '2025-05-16', homeTeam: 'London Ágyúk', awayTeam: 'Chelsea', score: '0-0', status: 'live' },
    { date: '2025-05-17', homeTeam: 'Tottenham', awayTeam: 'West Ham', score: '3-2', status: 'completed' },
    { date: '2025-05-18', homeTeam: 'Aston Oroszlán', awayTeam: 'Everton', score: '-', status: 'upcoming' },
    { date: '2025-05-19', homeTeam: 'Newcastle', awayTeam: 'Brighton', score: '-', status: 'upcoming' },
  ];

  const upcomingMatches: UpcomingMatch[] = [
    {
      date: '2025-05-18',
      time: '15:00',
      league: 'Virtual Premier League',
      homeTeam: { name: 'Aston Oroszlán', abbreviation: 'AO' },
      awayTeam: { name: 'Everton', abbreviation: 'EV' },
    },
    {
      date: '2025-05-19',
      time: '20:00',
      league: 'Virtual Premier League',
      homeTeam: { name: 'Newcastle', abbreviation: 'NC' },
      awayTeam: { name: 'Brighton', abbreviation: 'BR' },
    },
    {
      date: '2025-05-20',
      time: '16:45',
      league: 'Virtual Premier League',
      homeTeam: { name: 'London Ágyúk', abbreviation: 'LÁ' },
      awayTeam: { name: 'Vörös Ördögök', abbreviation: 'VÖ' },
    },
  ];

  // Add animation effect for content loading
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-load');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in');
        el.classList.remove('opacity-0');
      }, 100 * index);
    });
  }, []);

  const ActionButton = ({ label }: { label: string }) => (
    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 h-10 px-4 py-2 w-full border border-matt-200 hover:bg-matt-100 text-muted-foreground hover:text-white hover:border-matt-300">
      {label}
    </button>
  );

  return (
    <Layout title="Dashboard">
      <div className="w-full px-4 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Hero section */}
        <div className="flex flex-col gap-4 animate-on-load opacity-0">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your Virtual Premier League management system</p>
        </div>

        {/* Info Card */}
        <div className="rounded-lg border text-card-foreground bg-app-blue/10 border-app-blue/20 backdrop-blur-md animate-on-load opacity-0 hover:bg-app-blue/15 transition-all duration-300">
          <div className="space-y-1.5 p-6 flex flex-row items-start gap-3 pb-2">
            <Info className="h-5 w-5 text-app-blue mt-0.5" />
            <div>
              <h3 className="font-semibold tracking-tight text-lg">Virtual Premier League Teams Only</h3>
              <p className="text-sm text-muted-foreground">
                This platform exclusively features Virtual Premier League teams. All match data and statistics 
                refer to these virtual teams, not actual Premier League teams.
              </p>
            </div>
          </div>
        </div>

        {/* Main Header Video */}
        <MediaCard 
          title="Premier League Header" 
          mediaType="video" 
          src="https://player.vimeo.com/progressive_redirect/playback/859314337/rendition/1080p/file.mp4?loc=external&signature=086f2dff273737c68e918e0e6cc07912b0b15913a05c1e48fa59e573a29c5234&user_id=644152"
          aspectRatio="21/9"
          className="animate-on-load opacity-0"
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard 
            title="Total Teams" 
            value={16} 
            change={{ value: '+4', positive: true, text: 'from last month' }} 
            icon={Users} 
            color="blue" 
            className="animate-on-load opacity-0"
          />
          <StatCard 
            title="Upcoming Matches" 
            value={18} 
            change={{ value: '+2', positive: true, text: 'from last week' }} 
            icon={Calendar} 
            color="green" 
            className="animate-on-load opacity-0"
          />
          <StatCard 
            title="Prediction Accuracy" 
            value="76%" 
            change={{ value: '+2.5%', positive: true, text: 'from last month' }} 
            icon={BarChart} 
            color="purple" 
            className="animate-on-load opacity-0"
          />
          <StatCard 
            title="Active Leagues" 
            value={1} 
            change={{ value: 'Virtual Premier League', text: '' }} 
            icon={Trophy} 
            color="amber" 
            className="animate-on-load opacity-0"
          />
        </div>

        {/* Media Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 my-8">
          <MediaCard 
            title="Premier League Case Study" 
            mediaType="iframe" 
            src="https://player.vimeo.com/video/854948211?h=f6230ed63b&title=0&byline=0&portrait=0&color=ffffff&muted=1&autopause=0&controls=0&loop=1&app_id=122963"
            className="animate-on-load opacity-0 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          />
          <MediaCard 
            title="Premier League Presents" 
            mediaType="iframe" 
            src="https://player.vimeo.com/video/854712871?h=f166775e66&title=0&byline=0&portrait=0&color=ffffff&muted=1&autopause=0&controls=0&loop=1&app_id=122963"
            className="animate-on-load opacity-0 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          />
        </div>

        {/* Content Grid */}
        <div className="w-full grid gap-8 grid-cols-1 lg:grid-cols-12">
          {/* Recent Matches */}
          <div className="w-full lg:col-span-8">
            <GlassCard 
              title="Recent Matches" 
              icon={Trophy} 
              iconColor="text-app-amber"
              action={<ActionButton label="View All Matches" />}
              className="animate-on-load opacity-0"
            >
              <MatchTable matches={recentMatches} />
            </GlassCard>

            {/* Video Grid */}
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <MediaCard 
                title="Premier League Logo" 
                mediaType="video" 
                src="https://s3.eu-west-2.amazonaws.com/nomadstudio-com/videos/premier-league-rebrand-new-logo.mp4" 
                className="animate-on-load opacity-0 transform transition-all duration-300 hover:scale-[1.03]"
              />
              <MediaCard 
                title="Premier League Clubs" 
                mediaType="video" 
                src="https://s3.eu-west-2.amazonaws.com/nomadstudio-com/videos/premier-league-rebrand-clubs.mp4" 
                className="animate-on-load opacity-0 transform transition-all duration-300 hover:scale-[1.03]"
              />
              <MediaCard 
                title="Premier League Colors" 
                mediaType="video" 
                src="https://s3.eu-west-2.amazonaws.com/nomadstudio-com/videos/premier-league-rebrand-colour-2.mp4" 
                className="animate-on-load opacity-0 transform transition-all duration-300 hover:scale-[1.03]"
              />
            </div>
          </div>

          {/* Upcoming Matches */}
          <div className="w-full lg:col-span-4">
            <GlassCard 
              title="Upcoming Matches" 
              icon={Calendar} 
              iconColor="text-app-green"
              action={<ActionButton label="View All Upcoming" />}
              fullHeight
              className="animate-on-load opacity-0"
            >
              <div className="space-y-4">
                {upcomingMatches.map((match, index) => (
                  <MatchCard 
                    key={index}
                    date={match.date}
                    time={match.time}
                    league={match.league}
                    homeTeam={match.homeTeam}
                    awayTeam={match.awayTeam}
                  />
                ))}
              </div>
            </GlassCard>

            {/* Broadcast Media Card */}
            <div className="mt-8">
              <MediaCard 
                title="Broadcast Head to Head" 
                mediaType="iframe" 
                src="https://player.vimeo.com/video/854717626?h=db2dafd636&title=0&byline=0&portrait=0&color=ffffff&muted=1&autopause=0&controls=0&loop=1&app_id=122963" 
                className="animate-on-load opacity-0 transform transition-all duration-300 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
