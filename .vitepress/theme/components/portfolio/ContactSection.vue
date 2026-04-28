<script lang="ts" setup>
/**
 * ContactSection.vue
 *
 * Migrated from X-portfolio-main/components/sections/ContactSection.tsx
 *
 * Animations:
 * - Title slide-in: y: "200%" → 0 (triggered on scroll enter)
 * - End-title scale-in: scale: 0 → 1 with back.inOut ease
 *
 * Features:
 * - WeChat QR code image (/assets/images/wechat_qrcode.jpg)
 * - Social links: Twitter (x.com/Tse0103x), Github (github.com/X-sky)
 * - Contact info: Xie Tian, Developer & Lover
 * - Section id="contact" for anchor navigation
 *
 * Uses useGsapAnimation composable with ScrollTrigger.
 */
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { useGsapAnimation } from '../../composables/useGsapAnimation'

const sectionRef = ref<HTMLElement | null>(null)

useGsapAnimation(sectionRef, {
  setup({ el, gsap }) {
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scrub: true,
        onEnter: () => {
          gsap.fromTo(
            el.querySelectorAll('.title-animation'),
            { y: '200%' },
            { y: 0 },
          )

          gsap.fromTo(
            el.querySelectorAll('.end-title'),
            { scale: 0 },
            { scale: 1, ease: 'back.inOut' },
          )
        },
      },
    })
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    id="contact"
    class="max-h-max bg-gray-100 dark:bg-[#161D1F] py-[140px] px-10 lg:px-[5%]"
  >
    <div class="w-full max-w-[1100px] h-full m-auto flex flex-col items-center gap-5">
      <!-- Title area -->
      <div class="flex flex-col items-center gap-2">
        <div class="overflow-hidden">
          <div class="title-animation dark:text-white text-lg">
            Want to collaborate?
          </div>
        </div>
        <div class="overflow-hidden">
          <div class="title-animation text-5xl navlink text-accentColor">
            Contact me!
          </div>
        </div>
        <!-- WeChat QR code -->
        <div class="w-32 h-32">
          <img
            alt="wechat qrcode"
            title="scan to contact me with wechat"
            :src="withBase('/assets/images/wechat_qrcode.jpg')"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <div class="flex flex-col gap-8 items-center">
        <!-- Social links -->
        <div class="flex items-center gap-4">
          <!-- Twitter -->
          <a
            href="https://x.com/Tse0103x"
            aria-label="Contact me on Twitter"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full flex items-center gap-2 border py-[5px] px-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              class="stroke-black dark:stroke-white"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>
            <div class="text-xs dark:text-white">Twitter</div>
          </a>

          <!-- Github -->
          <a
            href="https://github.com/X-sky"
            aria-label="Contact me on Github"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full flex items-center gap-2 border py-[5px] px-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              class="stroke-black dark:stroke-white"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
            </svg>
            <div class="text-xs dark:text-white">Github</div>
          </a>
        </div>

        <!-- Contact info -->
        <div class="flex flex-col items-center">
          <div class="text-accentColor text-lg font-semibold">
            Xie Tian
          </div>
          <div class="dark:text-white text-sm">Developer &amp; Lover</div>
        </div>

        <!-- Description text -->
        <div class="overflow-hidden flex justify-center items-center">
          <div class="title-animation w-full md:max-w-[80%] text-center dark:text-gray-400">
            I'm always excited to connect with like-minded professionals
            and potential collaborators. Whether you have a project in mind,
            need assistance, or just want to say hello, feel free to reach
            out!
          </div>
        </div>

        <!-- End title with scale animation -->
        <div class="end-title dark:text-white text-md">
          Let's make the world better together!
          <br /><br /><br /><br /><br /><br />
        </div>
      </div>
    </div>
  </section>
</template>
