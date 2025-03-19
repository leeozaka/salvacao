'use client';

import React, { memo, useEffect, useState } from 'react';
import { getPerformanceData } from '@/services/dashboardService';

const PerformanceChart = () => {
  const [performanceData, setPerformanceData] = useState<{ label: string; value: number; }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPerformanceData();
        setPerformanceData(data);
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="w-full h-72 flex items-center justify-center">Loading chart data...</div>;
  }
  
  return (
    <div className="w-full h-72 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Performance data visualization would be rendered here</p>
        <div className="flex justify-center gap-4">
          {performanceData.map((point, index) => (
            <div 
              key={index} 
              className="h-40 w-8 bg-blue-500 rounded-t-md flex flex-col justify-end"
              style={{ height: `${Math.max(20, point.value)}px` }}
            >
              <div 
                className="w-full bg-blue-600"
                style={{ height: `${point}%` }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(PerformanceChart);
