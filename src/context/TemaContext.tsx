'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TemaContextType = {
  temaEscuro: boolean;
  alternarTema: () => void;
};

const TemaContext = createContext<TemaContextType | undefined>(undefined);

export function ProvedorTema({ children }: { children: ReactNode }) {
  const [temaEscuro, setTemaEscuro] = useState(false);

  useEffect(() => {
    const temaSalvo = localStorage.getItem('temaEscuro');
    const temaPreferido = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const temaInicial = temaSalvo ? JSON.parse(temaSalvo) : temaPreferido;

    if (temaInicial) {
      document.documentElement.classList.add('dark');
      setTemaEscuro(true);
    }
  }, []);

  const alternarTema = () => {
    const novoEstado = !temaEscuro;
    setTemaEscuro(novoEstado);
    localStorage.setItem('temaEscuro', JSON.stringify(novoEstado));
    document.documentElement.classList.toggle('dark', novoEstado);
  };

  return (
    <TemaContext.Provider value={{ temaEscuro, alternarTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error('useTema deve ser usado dentro de um ProvedorTema');
  }
  return context;
}