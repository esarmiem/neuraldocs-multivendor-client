'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Send, User, X, ArrowLeft } from 'lucide-react';
import { chatAPI } from '@/lib/api';
import { processLLMResponse } from '@/utils/textProcessing';
import { useRouter } from 'next/navigation';
import MarkdownRenderer from './MarkdownRenderer';

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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/agents')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Volver a selección de agentes"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="h-10 w-10 bg-[#fefefefe] rounded-full flex items-center justify-center">
              <Image src="/experianlogo.webp" alt="DELIA Logo" width={20} height={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Agente Experian</h1>
              {/*<p className="text-sm text-gray-500">
                {stats ? `${stats.total_documents} documentos, ${stats.total_chunks} chunks` : 'Cargando...'}
              </p> */}
            </div>
          </div>
          
          {/* Desktop Menu 
          <div className="hidden md:flex items-center space-x-2">
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
          </div> */}

          {/* Mobile Menu Button */}
          <div className="md:hidden relative">
            {/* Mobile menu removed */}
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

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <Image src="/experianlogo.webp" alt="DELIA Logo" width={64} height={64} className="mx-auto mb-4" />
            <h3 className="text-lg font-medium">¡Bienvenido a Agente Experian!</h3>
            <p className="mt-2">Estoy aquí para ayudarte con todas las preguntas que tengas sobre PowerCurve y cualquier tema.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-lg ${
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
                    <MarkdownRenderer content={message.content} typewriter />
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