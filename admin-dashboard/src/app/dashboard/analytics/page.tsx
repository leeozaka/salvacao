import React from 'react';

const mockMonthlyData = [
  { month: 'Jan', users: 120, revenue: 5400 },
  { month: 'Feb', users: 145, revenue: 5800 },
  { month: 'Mar', users: 190, revenue: 6700 },
  { month: 'Apr', users: 210, revenue: 7200 },
  { month: 'May', users: 250, revenue: 9100 },
  { month: 'Jun', users: 280, revenue: 10500 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Analytics Dashboard</h1>
        <p className="text-gray-500">Overview of key metrics and performance indicators</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Monthly Active Users</h3>
          <div className="flex items-end space-x-2 mt-2">
            <p className="text-2xl font-bold">12,345</p>
            <p className="text-green-500 text-sm">+8.2%</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">vs. last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Revenue Per User</h3>
          <div className="flex items-end space-x-2 mt-2">
            <p className="text-2xl font-bold">$42.50</p>
            <p className="text-green-500 text-sm">+5.3%</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">vs. last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Conversion Rate</h3>
          <div className="flex items-end space-x-2 mt-2">
            <p className="text-2xl font-bold">4.8%</p>
            <p className="text-red-500 text-sm">-0.3%</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">vs. last month</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Monthly Growth</h2>
          <div className="h-64 flex items-end">
            {mockMonthlyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex justify-center">
                  <div 
                    className="w-6 bg-blue-500 rounded-t" 
                    style={{ height: `${item.users / 3}px` }}
                  ></div>
                </div>
                <span className="text-xs mt-2 text-gray-500">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
            <span className="text-xs text-gray-500">Monthly Active Users</span>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Revenue Trends</h2>
          <div className="h-64 flex items-end">
            {mockMonthlyData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex justify-center">
                  <div 
                    className="w-6 bg-green-500 rounded-t" 
                    style={{ height: `${item.revenue / 165}px` }}
                  ></div>
                </div>
                <span className="text-xs mt-2 text-gray-500">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            <span className="text-xs text-gray-500">Monthly Revenue ($)</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">User Acquisition Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Organic Search</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Direct</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Referral</span>
                <span className="text-sm font-medium">16%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '16%' }}></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Social Media</span>
                <span className="text-sm font-medium">9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '9%' }}></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Email</span>
                <span className="text-sm font-medium">3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '3%' }}></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Other</span>
                <span className="text-sm font-medium">2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '2%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
