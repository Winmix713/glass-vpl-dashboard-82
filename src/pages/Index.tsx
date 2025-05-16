
import React from 'react';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TopTeamsSection from '@/components/dashboard/TopTeamsSection';
import UpcomingMatchesSection from '@/components/dashboard/UpcomingMatchesSection';
import StatsCardsSection from '@/components/dashboard/StatsCardsSection';
import MatchTablesSection from '@/components/dashboard/MatchTablesSection';
import MediaSection from '@/components/dashboard/MediaSection';
import { 
  topTeams, 
  upcomingMatches, 
  recentMatches, 
  upcomingFixtures, 
  mediaItems 
} from '@/data/dashboardData';

const Index = () => {
  return (
    <Layout title="Dashboard">
      <div className="p-4 md:p-6 space-y-6">
        <h1 className="heading-gradient text-3xl md:text-4xl font-bold mb-6">League Dashboard</h1>
        
        {/* Info cards row */}
        <DashboardHeader />
        
        {/* Main grid layout */}
        <div className="grid grid-cols-12 gap-5">
          {/* Top teams card */}
          <TopTeamsSection teams={topTeams} />
          
          {/* Upcoming matches card */}
          <UpcomingMatchesSection matches={upcomingMatches} />
          
          {/* Stats cards */}
          <StatsCardsSection />
          
          {/* Match tables section */}
          <MatchTablesSection 
            recentMatches={recentMatches}
            upcomingFixtures={upcomingFixtures}
          />
          
          {/* Media cards section */}
          <MediaSection media={mediaItems} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
