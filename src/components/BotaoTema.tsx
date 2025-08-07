'use client';

import { useTema } from '@/context/TemaContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function BotaoTema() {
  const { temaEscuro, alternarTema } = useTema();

  return (
    <button
      onClick={alternarTema}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-200"
      aria-label={temaEscuro ? 'Modo claro' : 'Modo escuro'}
    >
      {temaEscuro ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}