import React from 'react';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/sidebar/Sidebar';
import { getAuthToken, verifyToken } from '@/utils/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAuthToken();
  
  if (!token) {
    redirect('/login');
  }
  
  const isValid = await verifyToken(token);
  
  if (!isValid) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
