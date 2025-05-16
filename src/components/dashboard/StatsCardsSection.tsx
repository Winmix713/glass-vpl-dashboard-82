
import React from 'react';
import { AreaChart, PieChart, BarChartHorizontal } from 'lucide-react';
import EnhancedStatCard from '@/components/cards/EnhancedStatCard';

const StatsCardsSection: React.FC = () => {
  return (
    <>
      <EnhancedStatCard
        title="Average Goal Rate"
        value="2.4"
        trend="up"
        percentage={12}
        icon={<AreaChart className="h-5 w-5" />}
        chartData={[40, 70, 35, 50, 65, 75, 55, 60, 95, 75]}
        iconColor="text-app-blue"
        className="col-span-12 md:col-span-6 lg:col-span-4 card-entrance stagger-3"
      />
      <EnhancedStatCard
        title="Team Defense Rating"
        value="87.5"
        trend="down"
        percentage={4}
        icon={<PieChart className="h-5 w-5" />}
        chartData={[85, 90, 92, 89, 82, 80, 83, 85, 81, 80]}
        iconColor="text-app-green"
        className="col-span-12 md:col-span-6 lg:col-span-4 card-entrance stagger-4"
      />
      <EnhancedStatCard
        title="Possession"
        value="58%"
        trend="up"
        percentage={7}
        icon={<BarChartHorizontal className="h-5 w-5" />}
        chartData={[50, 52, 48, 55, 59, 54, 52, 58, 60, 62]}
        iconColor="text-app-amber"
        className="col-span-12 md:col-span-6 lg:col-span-4 card-entrance stagger-5"
      />
    </>
  );
};

export default StatsCardsSection;
