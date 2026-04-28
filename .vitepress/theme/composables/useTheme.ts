import { useData } from 'vitepress'

/**
 * Composable that wraps VitePress built-in theme toggling for convenient
 * use in portfolio components.
 *
 * - Exposes `isDark` reactive ref from VitePress `useData()`
 * - Provides a `toggleTheme` helper that flips the dark/light mode
 * - VitePress handles `.dark` class toggling and localStorage persistence automatically
 *
 * @returns An object containing the `isDark` ref and `toggleTheme` method
 */
export function useTheme() {
    const { isDark } = useData()

    const toggleTheme = () => {
        isDark.value = !isDark.value
    }

    return {
        isDark,
        toggleTheme,
    }
}
