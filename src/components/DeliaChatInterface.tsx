'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, LogOut, ChevronDown, Bot, ArrowLeft } from 'lucide-react';
import { chatAPI } from '@/lib/api';
import { useAuth } from './AuthProvider';
import { processLLMResponse } from '@/utils/textProcessing';
import TypewriterText from './TypewriterText';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

type UserLevel = 'basic' | 'intermediate' | 'advanced';

const userLevelOptions = [
  { value: 'basic', label: 'Básico' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' }
];

export default function DeliaChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLevel, setUserLevel] = useState<UserLevel>('basic');
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLevelDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      const response = await chatAPI.sendDeliaMessage({ 
        question: inputMessage,
        user_level: userLevel
      });
      
      const processedAnswer = processLLMResponse(response.response);
      
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

  const handleLevelSelect = (level: UserLevel) => {
    setUserLevel(level);
    setIsLevelDropdownOpen(false);
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
            <div className="h-10 w-10 bg-[#d91ba2] rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">DELIA</h1>
              <p className="text-sm text-gray-500">Asistente especializado en EDSL</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.isUser
                  ? 'bg-[#d91ba2] text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              {message.isUser ? (
                <div className="flex items-start space-x-2">
                  <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Tú</p>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-2">
                  <Bot className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#d91ba2]" />
                  <div>
                    <p className="text-sm font-medium mb-1 text-[#d91ba2]">DELIA</p>
                    <TypewriterText text={message.content} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2 max-w-[70%]">
              <div className="flex items-start space-x-2">
                <Bot className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#d91ba2]" />
                <div>
                  <p className="text-sm font-medium mb-1 text-[#d91ba2]">DELIA</p>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          {/* Level Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center space-x-2 min-w-[200px]"
            >
              <span>Nivel: {userLevelOptions.find(opt => opt.value === userLevel)?.label}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLevelDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLevelDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <p className="text-xs text-gray-500 mb-2 px-2">Escoge tu nivel de conocimiento</p>
                  {userLevelOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleLevelSelect(option.value as UserLevel)}
                      className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors duration-200 ${
                        userLevel === option.value ? 'bg-[#d91ba2] text-white hover:bg-[#d91ba2]' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu pregunta sobre EDSL..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d91ba2] focus:border-transparent resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-[#d91ba2] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
} 