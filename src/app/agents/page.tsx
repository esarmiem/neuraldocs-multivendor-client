'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Image from 'next/image';
import { MessageSquare, Bot } from 'lucide-react';

export default function AgentsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d91ba2] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Selecciona tu Agente</h1>
          <p className="text-gray-600">Elige el agente que mejor se adapte a tus necesidades</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Agente Experian */}
          <div 
            onClick={() => router.push('/chat')}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#652678] p-6"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 bg-[#fefefefe] rounded-full flex items-center justify-center">
                <Image src="/experianlogo.webp" alt="Experian Logo" width={32} height={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Agente Experian</h2>
            <p className="text-gray-600 text-center">
              Asistente especializado en documentación y consultas generales de Experian
            </p>
            <p className="text-gray-600 text-center mb-4">
              Responde sobre cualquier tema
            </p>
            <div className="flex items-center justify-center text-[#652678]">
              <MessageSquare className="h-5 w-5 mr-2" />
              <span className="font-medium">Chat General</span>
            </div>
          </div>

          {/* Agente Delia */}
          <div 
            onClick={() => router.push('/chat/delia')}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#d91ba2] p-6"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 bg-[#d91ba2] rounded-full flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Agente Delia</h2>
            <p className="text-gray-600 text-center">
              Asistente especializado en EDSL (Experian Domain Specific Language) 
            </p>
            <p className="text-gray-600 text-center mb-4">
              Respuestas adaptadas a tu nivel de conocimiento
            </p>
            <div className="flex items-center justify-center text-[#d91ba2]">
              <Bot className="h-5 w-5 mr-2" />
              <span className="font-medium">Chat EDSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 