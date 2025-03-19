import React from 'react';

const reportTypes = [
  { id: 1, name: 'Monthly Financial Summary', description: 'Overview of monthly revenue, expenses, and profit margins', format: 'PDF', frequency: 'Monthly' },
  { id: 2, name: 'User Activity Report', description: 'Details on user registrations, logins, and engagement metrics', format: 'Excel', frequency: 'Weekly' },
  { id: 3, name: 'Inventory Status', description: 'Current inventory levels, incoming shipments, and low stock alerts', format: 'Excel', frequency: 'Daily' },
  { id: 4, name: 'Sales Performance', description: 'Analysis of sales by product, region, and sales representative', format: 'PDF', frequency: 'Weekly' },
  { id: 5, name: 'Customer Satisfaction', description: 'Survey results and feedback analysis', format: 'PDF', frequency: 'Monthly' },
];

const recentReports = [
  { id: 1, name: 'Monthly Financial Summary - May 2024', date: '2024-06-01', status: 'Completed', size: '3.2 MB' },
  { id: 2, name: 'User Activity Report - Week 22', date: '2024-05-31', status: 'Completed', size: '4.7 MB' },
  { id: 3, name: 'Inventory Status - May 30', date: '2024-05-30', status: 'Completed', size: '1.1 MB' },
  { id: 4, name: 'Sales Performance - Week 21', date: '2024-05-24', status: 'Archived', size: '5.3 MB' },
  { id: 5, name: 'Monthly Financial Summary - April 2024', date: '2024-05-01', status: 'Archived', size: '3.0 MB' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Reports</h1>
          <p className="text-gray-500">View and download system reports</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Generate Custom Report
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Available Report Types</h2>
          <p className="text-sm text-gray-500">Reports that can be generated on-demand</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportTypes.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{report.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{report.format}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{report.frequency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900">Generate Now</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Reports */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Recent Reports</h2>
          <p className="text-sm text-gray-500">Reports generated in the last 30 days</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Generated</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{report.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{report.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Download</button>
                    <button className="text-gray-600 hover:text-gray-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing 5 of 12 reports
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded text-sm" disabled>Previous</button>
              <button className="px-3 py-1 border rounded text-sm bg-gray-100">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
