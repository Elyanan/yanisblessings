export const LANGUAGE_STORAGE_KEY = 'yanis-language'
export const LANGUAGE_COOKIE = 'yanis-language'
export type Language = 'en' | 'am'

export function isValidLanguage(value: string | null | undefined): value is Language {
  return value === 'en' || value === 'am'
}
