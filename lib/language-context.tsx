'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { LANGUAGE_COOKIE, LANGUAGE_STORAGE_KEY, type Language, isValidLanguage } from '@/lib/constants/language'
import { translate, translateWithParams, type TranslationKey } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  tp: (key: TranslationKey, params: Record<string, string>) => string
  ready: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function persistLanguage(lang: Language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    document.cookie = `${LANGUAGE_COOKIE}=${lang};path=/;max-age=31536000;SameSite=Lax`
    document.documentElement.lang = lang
    document.documentElement.dataset.language = lang
  } catch {
    // ignore storage errors
  }
}

function readStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  try {
    const fromDom = document.documentElement.dataset.language
    if (isValidLanguage(fromDom)) return fromDom
    const fromStorage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isValidLanguage(fromStorage)) return fromStorage
  } catch {
    // ignore
  }
  return 'en'
}

export function LanguageProvider({
  children,
  initialLanguage = 'en',
}: {
  children: ReactNode
  initialLanguage?: Language
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = readStoredLanguage()
    setLanguageState(stored)
    persistLanguage(stored)
    setReady(true)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    persistLanguage(lang)
  }, [])

  const t = useCallback((key: TranslationKey) => translate(key, language), [language])
  const tp = useCallback(
    (key: TranslationKey, params: Record<string, string>) => translateWithParams(key, language, params),
    [language]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tp, ready }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export { type Language } from '@/lib/constants/language'
