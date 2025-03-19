// Mock service for dashboard data

export async function getStats() {
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Return mock data
  return {
    totalUsers: 12458,
    userChange: 12.5,
    userTrend: 'up' as const,
    
    revenue: 84523.45,
    revenueChange: 8.2,
    revenueTrend: 'up' as const,
    
    activeProjects: 37,
    projectChange: -2.4,
    projectTrend: 'down' as const,
    
    completionRate: 78,
    completionChange: 5.1,
    completionTrend: 'up' as const,
  };
}

export async function getRecentActivity() {
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock data
  return [
    {
      id: '1',
      title: 'New user registered',
      time: '10 minutes ago',
      type: 'user'
    },
    {
      id: '2',
      title: 'System update completed',
      time: '1 hour ago',
      type: 'system'
    },
    {
      id: '3',
      title: 'New project created',
      time: '2 hours ago',
      type: 'project'
    },
    {
      id: '4',
      title: 'User profile updated',
      time: '5 hours ago',
      type: 'user'
    },
  ];
}

export async function getPerformanceData() {
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock data for a simple chart
  return [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 59 },
    { label: 'Mar', value: 80 },
    { label: 'Apr', value: 81 },
    { label: 'May', value: 56 },
    { label: 'Jun', value: 55 },
    { label: 'Jul', value: 40 }
  ];
}
