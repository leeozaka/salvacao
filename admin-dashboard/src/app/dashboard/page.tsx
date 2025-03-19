import React from 'react';
import { Suspense } from 'react';

import StatCard from '@/components/dashboard/StatCard';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import { getStats } from '@/services/dashboardService';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await getStats();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          change={stats.userChange} 
          trend={stats.userTrend}
          icon="users" 
        />
        <StatCard 
          title="Revenue" 
          value={`$${stats.revenue}`} 
          change={stats.revenueChange} 
          trend={stats.revenueTrend}
          icon="money" 
        />
        <StatCard 
          title="Active Projects" 
          value={stats.activeProjects} 
          change={stats.projectChange} 
          trend={stats.projectTrend}
          icon="briefcase" 
        />
        <StatCard 
          title="Completion Rate" 
          value={`${stats.completionRate}%`} 
          change={stats.completionChange} 
          trend={stats.completionTrend}
          icon="check" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Performance Metrics</h2>
          <Suspense fallback={<div>Loading chart...</div>}>
            <PerformanceChart />
          </Suspense>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <Suspense fallback={<div>Loading activities...</div>}>
            <RecentActivityList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
