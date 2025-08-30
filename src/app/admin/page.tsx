
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { documentsAPI } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { UploadCloud, Trash2, List, FileText, BarChart3, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import LogoutButton from '@/components/LogoutButton';

interface DocumentStats {
  total_documents: number;
  total_chunks: number;
  embedding_dimension: number;
}

export default function AdminPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [documents, setDocuments] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState({
    stats: true,
    documents: true,
    upload: false,
    clear: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const fetchData = async () => {
    try {
      setIsLoading(prev => ({ ...prev, stats: true, documents: true }));
      setError(null);
      const statsData = await documentsAPI.getStats();
      setStats(statsData);
      const documentsData = await documentsAPI.getDocuments();
      setDocuments(documentsData);
    } catch (err) {
      setError('Error al cargar los datos. Por favor, intente de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(prev => ({ ...prev, stats: false, documents: false }));
    }
  };

  useEffect(() => {
    if(isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(prev => ({ ...prev, upload: true }));
    setError(null);
    try {
      await documentsAPI.uploadDocument(selectedFile);
      setSelectedFile(null);
      await fetchData(); // Refresh data
    } catch (err) {
      setError('Error al subir el documento.');
      console.error(err);
    } finally {
      setIsLoading(prev => ({ ...prev, upload: false }));
    }
  };

  const handleClearDatabase = async () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar la base de datos? Esta acción es irreversible.')) {
      setIsLoading(prev => ({ ...prev, clear: true }));
      setError(null);
      try {
        await documentsAPI.clearDatabase();
        await fetchData(); // Refresh data
      } catch (err) {
        setError('Error al limpiar la base de datos.');
        console.error(err);
      } finally {
        setIsLoading(prev => ({ ...prev, clear: false }));
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d91ba2]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Dashboard de Administración AI"
        subtitle="Gestiona la base de conocimientos y monitorea el estado del sistema"
      >
        <LogoutButton />
      </Header>
      <main className="max-w-6xl mx-auto p-8 pt-0">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center">
            <AlertTriangle className="h-6 w-6 mr-3"/>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Estadísticas */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-[#652678]"/>
              <h2 className="text-xl font-semibold text-gray-700 ml-3">Estadísticas</h2>
            </div>
            {isLoading.stats ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-2 text-gray-600">
                <p className="flex justify-between"><strong>Documentos:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{stats?.total_documents ?? 0}</span></p>
                <p className="flex justify-between"><strong>Chunks:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{stats?.total_chunks ?? 0}</span></p>
              </div>
            )}
          </div>

          {/* Lista de Documentos */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 md:col-span-2">
            <div className="flex items-center mb-4">
              <List className="h-8 w-8 text-[#652678]"/>
              <h2 className="text-xl font-semibold text-gray-700 ml-3">Documentos Cargados</h2>
            </div>
            {isLoading.documents ? (
              <div className="space-y-2 animate-pulse"><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded w-5/6"></div></div>
            ) : (
              <div className="max-h-48 overflow-y-auto pr-2">
                {documents.length > 0 ? (
                  <ul className="space-y-2">
                    {documents.map((doc, index) => (
                      <li key={index} className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-md">
                        <FileText className="h-5 w-5 mr-3 text-gray-400"/>
                        <span className="truncate">{doc.split('_').slice(1).join('_') || doc}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No hay documentos en la base de datos.</p>
                )}
              </div>
            )}
          </div>

          {/* Subir Documento */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-[#d91ba2] transition-all">
            <div className="flex items-center mb-4">
              <UploadCloud className="h-8 w-8 text-[#d91ba2]"/>
              <h2 className="text-xl font-semibold text-gray-700 ml-3">Subir Documento</h2>
            </div>
            <div className="space-y-4">
              <input 
                type="file" 
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#d91ba2]/10 file:text-[#d91ba2] hover:file:bg-[#d91ba2]/20"
              />
              <button 
                onClick={handleUpload} 
                disabled={!selectedFile || isLoading.upload}
                className="w-full btn-primary bg-[#d91ba2] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading.upload ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <UploadCloud className="h-5 w-5 mr-2"/> Subir
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Limpiar Base de Datos */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-red-500 transition-all">
            <div className="flex items-center mb-4">
              <Trash2 className="h-8 w-8 text-red-500"/>
              <h2 className="text-xl font-semibold text-gray-700 ml-3">Limpiar Base de Datos</h2>
            </div>
            <p className="text-gray-500 mb-4 text-sm">Esta acción eliminará todos los documentos y chunks de la base de datos vectorial.</p>
            <button 
              onClick={handleClearDatabase} 
              disabled={isLoading.clear}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium disabled:bg-gray-300 flex items-center justify-center"
            >
              {isLoading.clear ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Trash2 className="h-5 w-5 mr-2"/> Limpiar Ahora
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
