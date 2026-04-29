import en from './en'
import zh from './zh'

export type LocaleKey = 'en' | 'zh'

export const locales: Record<LocaleKey, typeof en> = {
    en,
    zh,
}

export { en, zh }
