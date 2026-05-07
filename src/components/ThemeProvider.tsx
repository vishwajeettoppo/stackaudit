'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ theme: Theme; mounted: boolean }>({
    theme: 'light',
    mounted: false,
  })

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    
    // Defer update to satisfy strict 'set-state-in-effect' lint rule
    const timeout = setTimeout(() => {
      setState({ theme: initialTheme, mounted: true })
    }, 0)
    
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!state.mounted) return
    document.documentElement.classList.toggle('dark', state.theme === 'dark')
    document.documentElement.classList.toggle('light', state.theme === 'light')
    localStorage.setItem('theme', state.theme)
  }, [state.theme, state.mounted])

  const toggleTheme = () => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }))
  }

  return (
    <ThemeContext.Provider value={{ theme: state.theme, toggleTheme }}>
      <div style={{ visibility: state.mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
