'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  const { isAuthenticated, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d91ba2] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return <ChatInterface />;
} 