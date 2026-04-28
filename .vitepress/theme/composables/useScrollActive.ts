import { type Ref, ref, onMounted, onUnmounted, watch } from 'vue'

/**
 * Composable that detects whether a target element is visible in the viewport
 * using IntersectionObserver.
 *
 * - Creates the observer in `onMounted` to ensure SSR/SSG compatibility (VitePress)
 * - Disconnects the observer in `onUnmounted` to prevent memory leaks
 * - Watches the sectionRef so that if the element becomes available after mount,
 *   the observer will start observing it
 * - Returns a reactive `Ref<boolean>` indicating visibility state
 *
 * @param sectionRef - A Vue ref pointing to the target HTML element (or null)
 * @param options - Optional configuration
 * @param options.threshold - IntersectionObserver threshold (0–1). Default: 0.3
 * @returns A reactive boolean ref that is `true` when the element is in the viewport
 */
export function useScrollActive(
    sectionRef: Ref<HTMLElement | null>,
    options?: { threshold?: number }
): Ref<boolean> {
    const isActive = ref(false)
    const threshold = options?.threshold ?? 0.3

    let observer: IntersectionObserver | null = null

    const startObserving = (el: HTMLElement) => {
        if (observer) {
            observer.disconnect()
        }

        observer = new IntersectionObserver(
            ([entry]) => {
                isActive.value = entry.isIntersecting
            },
            { threshold }
        )

        observer.observe(el)
    }

    onMounted(() => {
        const el = sectionRef.value
        if (el) {
            startObserving(el)
        }
    })

    // Watch for late-bound element refs (e.g. v-if or async components)
    const stopWatch = watch(sectionRef, (newEl, oldEl) => {
        if (newEl && newEl !== oldEl) {
            startObserving(newEl)
        } else if (!newEl && observer) {
            observer.disconnect()
            observer = null
            isActive.value = false
        }
    })

    onUnmounted(() => {
        if (observer) {
            observer.disconnect()
            observer = null
        }
        stopWatch()
    })

    return isActive
}
