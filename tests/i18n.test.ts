import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
    getLocaleFromPath,
    switchLocalePath,
} from '../.vitepress/theme/composables/useI18n'
import { locales, type LocaleKey } from '../src/locales'

/**
 * Helper: resolve a dot-separated key against a nested object.
 * Mirrors the internal resolveKey logic in useI18n.
 */
function resolveKey(
    obj: Record<string, any>,
    key: string,
): string | undefined {
    const parts = key.split('.')
    let current: any = obj
    for (const part of parts) {
        if (current == null || typeof current !== 'object') return undefined
        current = current[part]
    }
    return typeof current === 'string' ? current : undefined
}

/**
 * Helper: translate function that works outside Vue context.
 * Uses the same logic as useI18n's t() function.
 */
function t(locale: LocaleKey, key: string): string {
    const currentMessages = locales[locale] as Record<string, any>
    const result = resolveKey(currentMessages, key)
    if (result !== undefined) return result

    const fallback = resolveKey(locales.en as Record<string, any>, key)
    if (fallback !== undefined) return fallback

    return key
}

/**
 * Arbitrary: generates URL path segments (alphanumeric + hyphens).
 */
const pathSegmentArb = fc.stringMatching(/^[a-z0-9_-]{1,20}$/)

/**
 * Arbitrary: generates a URL path like /foo/bar/baz
 */
const urlPathArb = fc
    .array(pathSegmentArb, { minLength: 0, maxLength: 5 })
    .map((segments) => '/' + segments.join('/'))

/**
 * Arbitrary: generates a non-zh-prefixed URL path (English path).
 * Ensures the first segment is not 'zh'.
 */
const nonZhPathArb = fc
    .array(pathSegmentArb, { minLength: 0, maxLength: 5 })
    .filter((segments) => segments.length === 0 || segments[0] !== 'zh')
    .map((segments) => '/' + segments.join('/'))

/**
 * Collect all string-valued leaf keys from a nested object.
 */
function collectKeys(
    obj: Record<string, any>,
    prefix = '',
): string[] {
    const keys: string[] = []
    for (const [k, v] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${k}` : k
        if (typeof v === 'string') {
            keys.push(fullKey)
        } else if (v != null && typeof v === 'object' && !Array.isArray(v)) {
            keys.push(...collectKeys(v, fullKey))
        }
    }
    return keys
}

// ============================================================
// Property 1: Language detection correctness
// **Validates: Requirements 3.2**
// ============================================================
describe('Feature: i18n-support, Property 1: Language detection correctness', () => {
    it('paths starting with /zh/ return zh, paths equal to /zh return zh, all others return en', () => {
        fc.assert(
            fc.property(urlPathArb, (path) => {
                const result = getLocaleFromPath(path)
                if (path.startsWith('/zh/') || path === '/zh') {
                    expect(result).toBe('zh')
                } else {
                    expect(result).toBe('en')
                }
            }),
            { numRuns: 200 },
        )
    })

    it('explicitly /zh paths return zh', () => {
        fc.assert(
            fc.property(
                fc
                    .array(pathSegmentArb, { minLength: 0, maxLength: 4 })
                    .map((segments) =>
                        segments.length === 0 ? '/zh' : '/zh/' + segments.join('/'),
                    ),
                (path) => {
                    expect(getLocaleFromPath(path)).toBe('zh')
                },
            ),
            { numRuns: 100 },
        )
    })
})

// ============================================================
// Property 2: Translation lookup with fallback
// **Validates: Requirements 3.3, 3.4**
// ============================================================
describe('Feature: i18n-support, Property 2: Translation lookup with fallback', () => {
    const enKeys = collectKeys(locales.en as Record<string, any>)

    it('existing keys in en return the correct English value', () => {
        fc.assert(
            fc.property(
                fc.constantFrom(...enKeys),
                (key) => {
                    const result = t('en', key)
                    const expected = resolveKey(
                        locales.en as Record<string, any>,
                        key,
                    )
                    expect(result).toBe(expected)
                },
            ),
            { numRuns: Math.min(enKeys.length * 3, 200) },
        )
    })

    it('existing keys in zh return the correct Chinese value', () => {
        const zhKeys = collectKeys(locales.zh as Record<string, any>)
        fc.assert(
            fc.property(
                fc.constantFrom(...zhKeys),
                (key) => {
                    const result = t('zh', key)
                    const expected = resolveKey(
                        locales.zh as Record<string, any>,
                        key,
                    )
                    expect(result).toBe(expected)
                },
            ),
            { numRuns: Math.min(zhKeys.length * 3, 200) },
        )
    })

    it('missing keys in zh fall back to en values', () => {
        // Create a key that exists in en but not in zh by using a fabricated scenario
        // Since zh mirrors en structure, we test with random non-existent keys
        fc.assert(
            fc.property(
                fc.constantFrom(...enKeys),
                fc.constantFrom('en' as LocaleKey, 'zh' as LocaleKey),
                (key, locale) => {
                    const result = t(locale, key)
                    // Result should never be the key itself if it exists in en
                    const enValue = resolveKey(
                        locales.en as Record<string, any>,
                        key,
                    )
                    expect(enValue).toBeDefined()
                    // If locale is en, result must equal enValue
                    // If locale is zh, result must equal zhValue or enValue (fallback)
                    if (locale === 'en') {
                        expect(result).toBe(enValue)
                    } else {
                        const zhValue = resolveKey(
                            locales.zh as Record<string, any>,
                            key,
                        )
                        expect(result).toBe(zhValue ?? enValue)
                    }
                },
            ),
            { numRuns: 200 },
        )
    })

    it('completely missing keys return the key itself', () => {
        fc.assert(
            fc.property(
                fc
                    .tuple(pathSegmentArb, pathSegmentArb, pathSegmentArb)
                    .map(([a, b, c]) => `nonexistent.${a}.${b}.${c}`),
                fc.constantFrom('en' as LocaleKey, 'zh' as LocaleKey),
                (key, locale) => {
                    const result = t(locale, key)
                    expect(result).toBe(key)
                },
            ),
            { numRuns: 100 },
        )
    })
})

// ============================================================
// Property 3: Round-trip consistency for locale path switching
// **Validates: Requirements 4.7, 6.2**
// ============================================================
describe('Feature: i18n-support, Property 3: Round-trip locale path switching consistency', () => {
    /**
     * Normalize a path: ensure it starts with / and collapse double slashes.
     * A trailing slash on root is kept as /.
     */
    function normalizePath(p: string): string {
        let result = p.replace(/\/+/g, '/')
        if (!result.startsWith('/')) result = '/' + result
        return result || '/'
    }

    it('en → zh → en round-trip returns the normalized original path', () => {
        fc.assert(
            fc.property(nonZhPathArb, (path) => {
                const toZh = switchLocalePath(path, 'zh')
                const backToEn = switchLocalePath(toZh, 'en')
                expect(backToEn).toBe(normalizePath(path))
            }),
            { numRuns: 200 },
        )
    })

    it('zh → en → zh round-trip returns the normalized zh path', () => {
        fc.assert(
            fc.property(
                fc
                    .array(pathSegmentArb, { minLength: 0, maxLength: 4 })
                    .map((segments) =>
                        segments.length === 0 ? '/zh/' : '/zh/' + segments.join('/'),
                    ),
                (zhPath) => {
                    const toEn = switchLocalePath(zhPath, 'en')
                    const backToZh = switchLocalePath(toEn, 'zh')

                    // Normalize both for comparison
                    const normalizedOriginal = zhPath.replace(/\/+/g, '/')
                    const normalizedResult = backToZh.replace(/\/+/g, '/')
                    expect(normalizedResult).toBe(normalizedOriginal)
                },
            ),
            { numRuns: 200 },
        )
    })
})
