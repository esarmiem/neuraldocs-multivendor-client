'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authAPI } from '@/lib/api';
import { Mail, User, Lock, IdCard } from 'lucide-react';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await authAPI.register({ username, email, full_name: fullName, password });
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo registrar';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[#fefefefe] rounded-full flex items-center justify-center">
            <Image src="/experianlogo.webp" alt="DELIA Logo" width={32} height={32} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Crear cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">Regístrate para usar los agentes</p>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>
            )}

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IdCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d91ba2] focus:border-transparent pl-10"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d91ba2] focus:border-transparent pl-10"
                  placeholder="Elige un usuario"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d91ba2] focus:border-transparent pl-10"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d91ba2] focus:border-transparent pl-10"
                  placeholder="Crea una contraseña segura"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#d91ba2] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium w-full flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-[#d91ba2] hover:underline"
              >
                Inicia sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


