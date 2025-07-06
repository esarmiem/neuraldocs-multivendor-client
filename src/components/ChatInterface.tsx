'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Send, User, LogOut, Trash2, Upload, X } from 'lucide-react';
import { chatAPI, documentsAPI } from '@/lib/api';
import { useAuth } from './AuthProvider';
import { processLLMResponse } from '@/utils/textProcessing';
import TypewriterText from './TypewriterText';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<{ total_documents: number; total_chunks: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await documentsAPI.getStats();
      setStats(statsData);
    } catch {
      console.error('Error loading stats');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      await documentsAPI.uploadDocument(file);
      setUploadSuccess(true);
      await loadStats(); // Recargar estadísticas después de subir
      
      // Limpiar el input de archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al subir el documento';
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearUploadError = () => {
    setUploadError(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage({ question: inputMessage });
      const processedAnswer = processLLMResponse(response.answer);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: processedAnswer,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar todos los documentos? Esta acción no se puede deshacer.')) {
      try {
        await documentsAPI.clearDatabase();
        await loadStats();
        setMessages([]);
        alert('Base de datos limpiada exitosamente');
      } catch {
        alert('Error al limpiar la base de datos');
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-[#fefefefe] rounded-full flex items-center justify-center">
              <Image src="/experianlogo.webp" alt="DELIA Logo" width={20} height={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">DELIA</h1>
              <p className="text-sm text-gray-500">
                {stats ? `${stats.total_documents} documentos, ${stats.total_chunks} chunks` : 'Cargando...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="bg-[#652678] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Subir documento"
            >
              <Upload className="h-4 w-4" />
              <span>{isUploading ? 'Subiendo...' : 'Subir Conocimiento'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.txt,.json,.xlsx"
              className="hidden"
            />
            <button
              onClick={handleClearDatabase}
              className="bg-[#652678] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium flex items-center space-x-2"
              title="Limpiar base de datos"
            >
              <Trash2 className="h-4 w-4" />
              <span>Limpiar DB</span>
            </button>
            <button
              onClick={logout}
              className="bg-[#d91ba2] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium flex items-center space-x-2"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Notifications */}
      {uploadError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error al subir documento: {uploadError}
                </p>
              </div>
            </div>
            <button
              onClick={clearUploadError}
              className="text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-5 w-5 text-green-400">✓</div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Documento subido exitosamente
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <Image src="/experianlogo.webp" alt="DELIA Logo" width={64} height={64} className="mx-auto mb-4" />
            <h3 className="text-lg font-medium">¡Bienvenido a DELIA!</h3>
            <p className="mt-2">Asistente experto en EDSL (Experian Domain Specific Language). Estoy aquí para ayudarte con todas las preguntas que tengas sobre PowerCurve.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-lg ${
                message.isUser
                  ? 'bg-[#d91ba2] text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {!message.isUser && (
                  <Image src="/experianlogo.webp" alt="DELIA" width={20} height={20} className="mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  {message.isUser ? (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  ) : (
                    <TypewriterText text={message.content} speed={30} />
                  )}
                  <div className={`text-xs mt-2 ${
                    message.isUser ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {message.isUser && (
                  <User className="h-5 w-5 text-white/70 mt-0.5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Image src="/experianlogo.webp" alt="DELIA" width={20} height={20} />
                <div className="flex space-x-1">
                  <div className="animate-bounce h-2 w-2 bg-[#d91ba2] rounded-full"></div>
                  <div className="animate-bounce h-2 w-2 bg-[#d91ba2] rounded-full" style={{ animationDelay: '0.1s' }}></div>
                  <div className="animate-bounce h-2 w-2 bg-[#d91ba2] rounded-full" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 p-6">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d91ba2] focus:border-transparent flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-[#d91ba2] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
} 