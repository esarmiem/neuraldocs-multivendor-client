'use client';

import { useAuth } from './AuthProvider';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="bg-[#d91ba2] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium flex items-center space-x-2"
      title="Cerrar sesión"
    >
      <LogOut className="h-4 w-4" />
      <span>Cerrar Sesión</span>
    </button>
  );
}
