import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'
import { locales, type LocaleKey } from '../../../src/locales'

/**
 * Detect locale from a URL path (without base prefix).
 * Paths starting with /zh/ or equal to /zh return 'zh', all others return 'en'.
 *
 * IMPORTANT: This function expects a path WITHOUT the VitePress base prefix.
 * Use `stripBase()` to remove the base before calling this function,
 * or use the `useI18n()` composable which handles this automatically.
 */
export function getLocaleFromPath(path: string): LocaleKey {
    if (path.startsWith('/zh/') || path === '/zh') return 'zh'
    return 'en'
}

/**
 * Strip the VitePress base path prefix from a full route path.
 * e.g., '/X-press/zh/coding/foo' → '/zh/coding/foo'
 *       '/X-press/' → '/'
 */
function stripBase(path: string, base: string): string {
    const baseWithoutTrailingSlash = base.replace(/\/$/, '')
    if (baseWithoutTrailingSlash && path.startsWith(baseWithoutTrailingSlash)) {
        const stripped = path.slice(baseWithoutTrailingSlash.length)
        return stripped || '/'
    }
    return path
}

/**
 * Compute the equivalent path in the target locale.
 * Strips any existing /zh prefix, then prepends /zh for Chinese locale.
 *
 * IMPORTANT: This function expects a path WITHOUT the VitePress base prefix.
 * The returned path also does NOT include the base prefix.
 */
export function switchLocalePath(
    currentPath: string,
    targetLocale: LocaleKey,
): string {
    // Remove existing /zh prefix to get the base path
    const basePath = currentPath.replace(/^\/zh(\/|$)/, '/')
    if (targetLocale === 'zh') {
        return basePath === '/' ? '/zh/' : `/zh${basePath}`
    }
    return basePath || '/'
}

/**
 * Resolve a dot-separated key against a nested object.
 * Returns undefined if any segment is missing.
 */
function resolveKey(obj: Record<string, any>, key: string): string | undefined {
    const parts = key.split('.')
    let current: any = obj
    for (const part of parts) {
        if (current == null || typeof current !== 'object') return undefined
        current = current[part]
    }
    return typeof current === 'string' ? current : undefined
}

/**
 * Vue composable for i18n support.
 *
 * Returns:
 * - locale: current language key ('en' | 'zh')
 * - t(key): translate a dot-separated key with English fallback
 * - localePath(path): prefix path with language segment for non-root locales
 */
export function useI18n() {
    const route = useRoute()
    const { site } = useData()

    /** Get the base path from VitePress site config */
    const base = computed(() => site.value.base || '/')

    const locale = computed<LocaleKey>(() => {
        const cleanPath = stripBase(route.path, base.value)
        return getLocaleFromPath(cleanPath)
    })

    function t(key: string): string {
        const currentMessages = locales[locale.value] as Record<string, any>
        const result = resolveKey(currentMessages, key)
        if (result !== undefined) return result

        // Fallback to English
        const fallback = resolveKey(locales.en as Record<string, any>, key)
        if (fallback !== undefined) return fallback

        // Return the key itself as last resort
        return key
    }

    function localePath(path: string): string {
        if (locale.value === 'en') return path
        // For non-root locales, prepend the locale prefix
        return path.startsWith('/') ? `/zh${path}` : `/zh/${path}`
    }

    /**
     * Compute the equivalent path in the target locale, accounting for base path.
     * Returns a path WITHOUT the base prefix (caller should use withBase if needed).
     */
    function switchLocale(targetLocale: LocaleKey): string {
        const cleanPath = stripBase(route.path, base.value)
        return switchLocalePath(cleanPath, targetLocale)
    }

    return {
        locale,
        t,
        localePath,
        switchLocale,
    }
}
