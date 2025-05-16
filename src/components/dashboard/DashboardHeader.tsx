
import React from 'react';
import { Users, Award, Calendar } from 'lucide-react';
import InfoCard from '@/components/InfoCard';

const DashboardHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <InfoCard
        title="Total Teams"
        description="32 teams in the league"
        icon={<Users className="h-5 w-5" />}
        iconColor="text-app-blue"
        className="card-entrance stagger-1"
      />
      <InfoCard
        title="Season Progress"
        description="Week 16 of 22"
        icon={<Calendar className="h-5 w-5" />}
        iconColor="text-app-green"
        className="card-entrance stagger-2"
      />
      <InfoCard
        title="Championship Teams"
        description="Top 4 teams advance"
        icon={<Award className="h-5 w-5" />}
        iconColor="text-app-amber"
        className="card-entrance stagger-3"
      />
    </div>
  );
};

export default DashboardHeader;
