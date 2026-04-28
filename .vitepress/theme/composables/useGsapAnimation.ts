import { type Ref, ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface UseGsapAnimationOptions {
    /** Animation setup function, called inside onMounted with the target element and gsap instance */
    setup: (ctx: { el: HTMLElement; gsap: typeof gsap }) => gsap.core.Timeline | gsap.core.Tween | void
    /** Whether to auto-cleanup animations and ScrollTrigger on unmount (default: true) */
    autoCleanup?: boolean
}

/**
 * Composable that encapsulates GSAP animation lifecycle management.
 *
 * - Initializes animations in `onMounted` using `gsap.context()` for scoped management
 * - Calls `ctx.revert()` in `onUnmounted` to auto-cleanup all animations and ScrollTrigger instances
 * - Handles null elementRef gracefully (no-op)
 * - All GSAP code runs only on the client side (inside onMounted)
 */
export function useGsapAnimation(
    elementRef: Ref<HTMLElement | null>,
    options: UseGsapAnimationOptions
): {
    timeline: Ref<gsap.core.Timeline | null>
    isReady: Ref<boolean>
} {
    const timeline = ref<gsap.core.Timeline | null>(null) as Ref<gsap.core.Timeline | null>
    const isReady = ref(false)
    const autoCleanup = options.autoCleanup ?? true

    let ctx: gsap.Context | null = null

    onMounted(() => {
        const el = elementRef.value
        if (!el) {
            // Element not available — skip animation setup silently
            return
        }

        try {
            ctx = gsap.context(() => {
                const result = options.setup({ el, gsap })
                if (result instanceof gsap.core.Timeline) {
                    timeline.value = result
                }
            }, el)

            isReady.value = true
        } catch (e) {
            console.warn('[useGsapAnimation] GSAP initialization failed, falling back to static render:', e)
            // Ensure all elements are visible as a fallback
            el.querySelectorAll<HTMLElement>('[style*="opacity: 0"]').forEach(
                (child) => { child.style.opacity = '1' }
            )
        }
    })

    onUnmounted(() => {
        if (autoCleanup && ctx) {
            ctx.revert()
            ctx = null
        }
        timeline.value = null
        isReady.value = false
    })

    return { timeline, isReady }
}
