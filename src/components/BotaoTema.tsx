'use client'
import { useTheme } from 'next-themes'
import { FiSun, FiMoon } from 'react-icons/fi'

export function BotaoTema() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-input/30 border border-input text-foreground"
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  )
}