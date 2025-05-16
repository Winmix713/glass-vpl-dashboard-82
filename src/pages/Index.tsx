
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import GlassCard from '@/components/cards/GlassCard';
import EnhancedMediaCard from '@/components/cards/EnhancedMediaCard';
import EnhancedMatchTable from '@/components/EnhancedMatchTable';
import UpcomingMatches from '@/components/UpcomingMatches';
import EnhancedStatCard from '@/components/cards/EnhancedStatCard';
import InfoCard from '@/components/InfoCard';
import { Trophy, Users, Calendar, BarChart, Info } from 'lucide-react';

const Index = () => {
  // Add parallax effect to background blobs
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 50;
      const moveY = (clientY - window.innerHeight / 2) / 50;
      
      document.querySelectorAll('.parallax-bg').forEach((el) => {
        (el as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Sample data
  const recentMatches = [
    { id: "1", date: '2025-05-15', homeTeam: 'Liverpool', awayTeam: 'Manchester Kék', score: '2-1', status: 'Completed' as const },
    { id: "2", date: '2025-05-16', homeTeam: 'London Ágyúk', awayTeam: 'Chelsea', score: '0-0', status: 'Live' as const },
    { id: "3", date: '2025-05-17', homeTeam: 'Tottenham', awayTeam: 'West Ham', score: '3-2', status: 'Completed' as const },
    { id: "4", date: '2025-05-18', homeTeam: 'Aston Oroszlán', awayTeam: 'Everton', score: '-', status: 'Upcoming' as const },
    { id: "5", date: '2025-05-19', homeTeam: 'Newcastle', awayTeam: 'Brighton', score: '-', status: 'Upcoming' as const },
  ];

  const upcomingMatches = [
    {
      id: "1",
      date: '2025-05-18',
      time: '15:00',
      league: 'Virtual Premier League',
      homeTeam: { name: 'Aston Oroszlán', shortCode: 'AO' },
      awayTeam: { name: 'Everton', shortCode: 'EV' },
    },
    {
      id: "2",
      date: '2025-05-19',
      time: '20:00',
      league: 'Virtual Premier League',
      homeTeam: { name: 'Newcastle', shortCode: 'NC' },
      awayTeam: { name: 'Brighton', shortCode: 'BR' },
    },
    {
      id: "3",
      date: '2025-05-20',
      time: '16:45',
      league: 'Virtual Premier League',
      homeTeam: { name: 'London Ágyúk', shortCode: 'LÁ' },
      awayTeam: { name: 'Vörös Ördögök', shortCode: 'VÖ' },
    },
  ];

  const statCards = [
    {
      title: "Total Teams",
      value: 16,
      icon: Users,
      iconColor: "text-app-blue",
      iconBgColor: "bg-app-blue/10",
      change: {
        value: "+4",
        isPositive: true,
        text: "from last month",
      },
      trend: [8, 10, 9, 12, 16],
    },
    {
      title: "Upcoming Matches",
      value: 18,
      icon: Calendar,
      iconColor: "text-app-green",
      iconBgColor: "bg-app-green/10",
      change: {
        value: "+2",
        isPositive: true,
        text: "from last week",
      },
      trend: [12, 14, 13, 16, 18],
    },
    {
      title: "Prediction Accuracy",
      value: 76,
      icon: BarChart,
      iconColor: "text-app-purple",
      iconBgColor: "bg-app-purple/10",
      change: {
        value: "+2.5%",
        isPositive: true,
        text: "from last month",
      },
      trend: [68, 70, 72, 73.5, 76],
    },
    {
      title: "Active Leagues",
      value: 1,
      icon: Trophy, 
      iconColor: "text-app-amber",
      iconBgColor: "bg-app-amber/10", 
      change: {
        value: "Virtual Premier League",
        isPositive: true,
        text: "",
      },
      trend: [1, 1, 1, 1, 1],
    },
  ];

  // Add descriptions for media cards
  const videoCards = [
    {
      title: "Premier League Case Study",
      videoSrc: "https://player.vimeo.com/video/854948211?h=f6230ed63b&title=0&byline=0&portrait=0&color=ffffff&muted=1&autopause=0&controls=0&loop=1&app_id=122963",
      isIframe: true,
      description: "An in-depth analysis of the Virtual Premier League structure and performance metrics."
    },
    {
      title: "Premier League Presents",
      videoSrc: "https://player.vimeo.com/video/854712871?h=f166775e66&title=0&byline=0&portrait=0&color=ffffff&muted=1&autopause=0&controls=0&loop=1&app_id=122963",
      isIframe: true,
      description: "Official presentation of the Virtual Premier League season highlights and key moments."
    },
  ];

  const smallVideoCards = [
    {
      title: "Premier League Logo",
      videoSrc: "https://s3.eu-west-2.amazonaws.com/nomadstudio-com/videos/premier-league-rebrand-new-logo.mp4",
      description: "The evolution and design philosophy behind the Virtual Premier League logo."
    },
    {
      title: "Premier League Clubs",
      videoSrc: "https://s3.eu-west-2.amazonaws.com/nomadstudio-com/videos/premier-league-rebrand-clubs.mp4",
      description: "Overview of all participating clubs in the Virtual Premier League this season."
    },
    {
      title: "Premier League Colors",
      videoSrc: "https://s3.eu-west-2.amazonaws.com/nomadstudio-com/videos/premier-league-rebrand-colour-2.mp4",
      description: "Color system and visual identity elements of the Virtual Premier League brand."
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

  return (
    <Layout title="Dashboard">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-app-blue/5 rounded-full blur-3xl -mr-64 -mt-64 parallax-bg"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-app-purple/5 rounded-full blur-3xl -ml-64 -mb-64 parallax-bg"></div>
      </div>
      
      <div className="w-full px-4 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Hero section */}
        <div className="flex flex-col gap-4 animate-on-load opacity-0">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your Virtual Premier League management system</p>
        </div>

        {/* Info Card */}
        <InfoCard
          title="Virtual Premier League Teams Only"
          description="This platform exclusively features Virtual Premier League teams. All match data and statistics refer to these virtual teams, not actual Premier League teams."
          icon={<Info className="h-5 w-5 text-app-blue" />}
          bgColor="bg-app-blue/10"
          className="animate-on-load opacity-0"
        />

        {/* Main Header Video */}
        <GlassCard 
          className="animate-on-load opacity-0 overflow-hidden"
          parallax={true}
          gradientBorder={true}
        >
          <div className="flex flex-col space-y-1.5 p-4">
            <h3 className="font-semibold tracking-tight text-lg">Premier League Header</h3>
          </div>
          <div className="p-0 aspect-[21/9] relative group">
            <video
              src="https://player.vimeo.com/progressive_redirect/playback/859314337/rendition/1080p/file.mp4?loc=external&signature=086f2dff273737c68e918e0e6cc07912b0b15913a05c1e48fa59e573a29c5234&user_id=644152"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              autoPlay
              loop
              playsInline
              muted
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-4">
                <h3 className="text-xl font-bold text-white">Virtual Premier League</h3>
                <p className="text-sm text-white/80">Experience the excitement of virtual football at its finest</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statCards.map((card, index) => (
            <EnhancedStatCard 
              key={index}
              title={card.title} 
              value={card.value} 
              change={{ 
                value: card.change.value, 
                isPositive: card.change.isPositive, 
                text: card.change.text 
              }} 
              icon={card.icon} 
              iconColor={card.iconColor} 
              iconBgColor={card.iconBgColor}
              trend={card.trend}
              className="animate-on-load opacity-0"
              animationDelay={index + 1}
            />
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 my-8">
          {videoCards.map((card, index) => (
            <EnhancedMediaCard 
              key={index}
              title={card.title} 
              videoSrc={card.videoSrc}
              isIframe={card.isIframe}
              description={card.description}
              className="animate-on-load opacity-0 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              animationDelay={index + 1}
            />
          ))}
        </div>

        {/* Content Grid */}
        <div className="w-full grid gap-8 grid-cols-1 lg:grid-cols-12">
          {/* Recent Matches */}
          <div className="w-full lg:col-span-8">
            <EnhancedMatchTable 
              matches={recentMatches} 
              title="Recent Matches"
              icon={<Trophy className="h-5 w-5" />}
              iconColor="text-app-amber"
            />

            {/* Video Grid */}
            <div className="grid gap-5 grid-cols-1 md:grid-cols-3 mt-8">
              {smallVideoCards.map((card, index) => (
                <EnhancedMediaCard 
                  key={index}
                  title={card.title} 
                  videoSrc={card.videoSrc}
                  description={card.description}
                  className="animate-on-load opacity-0 transform transition-all duration-300 hover:scale-[1.03]"
                  animationDelay={index + 2}
                />
              ))}
            </div>
          </div>

          {/* Upcoming Matches */}
          <div className="w-full lg:col-span-4">
            <UpcomingMatches matches={upcomingMatches} />

            {/* Broadcast Media Card */}
            <div className="mt-8">
              <EnhancedMediaCard 
                title="Broadcast Head to Head" 
                videoSrc="https://player.vimeo.com/video/854717626?h=db2dafd636&title=0&byline=0&portrait=0&color=ffffff&muted=1&autopause=0&controls=0&loop=1&app_id=122963" 
                isIframe={true}
                description="Live comparison of team performance metrics and head-to-head statistics."
                className="animate-on-load opacity-0 transform transition-all duration-300 hover:scale-[1.03]"
                animationDelay={5}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
