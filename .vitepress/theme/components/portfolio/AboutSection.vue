<script lang="ts" setup>
/**
 * AboutSection.vue
 *
 * Migrated from X-portfolio-main/components/sections/AboutSection.tsx
 *
 * Animations:
 * - SplitType character-by-character reveal on the title (scrub with ScrollTrigger)
 * - Image slide-in (x: 200 → 0)
 * - Text slide-in (y: 100 → 0)
 * - Counter animations (experience: 6, projects: 15, contributions: 30)
 *
 * Uses useGsapAnimation composable for lifecycle management.
 * ScrollTrigger is already registered inside useGsapAnimation.
 */
import { ref } from 'vue'
import { useGsapAnimation } from '../../composables/useGsapAnimation'
import TechStack from './TechStack.vue'
import SplitType from 'split-type'

const sectionRef = ref<HTMLElement | null>(null)

useGsapAnimation(sectionRef, {
  setup({ el, gsap }) {
    // --- Title character-by-character reveal ---
    const titleEl = el.querySelector('.title') as HTMLElement
    if (titleEl) {
      new SplitType(titleEl, {
        types: 'chars',
        tagName: 'span',
      })

      gsap.from(titleEl.querySelectorAll('.char'), {
        opacity: 0.3,
        duration: 0.5,
        ease: 'power1.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: titleEl,
          start: 'top center',
          scrub: true,
        },
      })
    }

    // --- Image slide-in + Text slide-in + Counter animations ---
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scrub: true,
        onEnter: () => {
          const tl = gsap.timeline({
            defaults: {
              stagger: 0.2,
              duration: 0.3,
            },
          })

          // Image slides in from right
          tl.fromTo(
            el.querySelectorAll('.image-animation'),
            { x: 200 },
            { x: 0 },
          )

          // Text slides in from bottom
          tl.fromTo(
            el.querySelectorAll('.text-animation'),
            { y: 100 },
            { y: 0 },
          )

          // Counter: experience
          tl.to(el.querySelector('.experience-count'), {
            innerText: 6,
            duration: 0.5,
            snap: { innerText: 1 },
          })

          // Counter: projects
          tl.to(
            el.querySelector('.project-count'),
            {
              innerText: 15,
              duration: 0.5,
              snap: { innerText: 1 },
            },
            '-=0.3',
          )

          // Counter: contributions
          tl.to(
            el.querySelector('.user-count'),
            {
              innerText: 30,
              duration: 0.5,
              snap: { innerText: 1 },
            },
            '-=0.3',
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
    id="about"
    class="relative h-full bg-gray-100 dark:bg-[#161D1F] overflow-hidden py-14 px-10 lg:px-[5%]"
  >
    <div class="w-full max-w-[1100px] h-full m-auto flex flex-col items-center gap-24">
      <!-- Title with SplitType animation -->
      <div class="relative title text-xl md:text-4xl tracking-tight font-medium w-fit dark:text-white">
        Keep Looking. Don&apos;t settle.
        <div class="absolute -right-[10px] top-2">
          <img
            class="w-14 pointer-events-none select-none"
            src="/assets/about/signs.svg"
            alt="signs"
          />
        </div>
      </div>

      <!-- Content: text + image -->
      <div class="w-full flex flex-col-reverse md:flex-row items-center gap-20 md:gap-2 lg:gap-10">
        <!-- Left: About text -->
        <div class="w-full flex flex-col items-start gap-7 md:gap-9">
          <!-- "About me" heading with decorative SVG -->
          <div class="relative">
            <div class="overflow-hidden">
              <div class="text-animation dark:text-accentColor text-3xl md:text-4xl font-medium">
                About me
              </div>
            </div>

            <div class="absolute -top-6 -left-8">
              <svg
                width="45"
                height="37"
                viewBox="0 0 45 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25.807 19.086c-.485-.764-.744-1.319-1.136-1.76a815.404 815.404 0 00-7.627-8.56 4.462 4.462 0 00-1.429-1.06c-.352-.16-1.016-.182-1.22.033-.3.32-.508.962-.396 1.37.165.624.57 1.226.99 1.737 2.52 3.07 5.081 6.113 7.626 9.161.143.17.302.337.475.48.6.508 1.352.985 1.995.37.447-.429.524-1.245.722-1.771zM36.215 9.964c.25 1.018.476 2.041.759 3.053.232.816.832 1.255 1.674 1.21.847-.046 1.371-.582 1.568-1.378.105-.425.176-.914.07-1.328-.645-2.533-1.341-5.05-2.03-7.57-.056-.212-.147-.491-.309-.587-.54-.323-1.14-.827-1.688-.8-.86.045-1.203.871-1.13 1.67.104 1.114.322 2.221.534 3.322.155.806.384 1.601.577 2.404l-.027.009.002-.005zM7.28 28.081c-.22.298-.737.71-.825 1.2-.072.394.287.96.603 1.313.28.309.746.487 1.164.633 1.967.697 3.947 1.363 5.921 2.04.21.071.43.13.65.167.981.166 1.984.278 2.601-.72.457-.732-.07-1.93-1.239-2.553-2.395-1.274-4.98-1.97-7.69-2.171-.295-.021-.595.046-1.183.095l-.001-.004z"
                  fill="#ffffff"
                />
              </svg>
            </div>
          </div>

          <!-- Personal info -->
          <div class="flex flex-col items-start gap-4">
            <div class="overflow-hidden">
              <div class="dark:text-white text-animation">
                <ul>
                  <li>- A frontend developer with over 6 years of experience</li>
                  <li>- Mastering various frontend frameworks, especially Vue and its ecosystem.</li>
                  <li>- Proficient in toolchains and infrastructure with unique insights into coding and architecture</li>
                  <li>- A meticulous scholar and a cheerful optimist in life</li>
                </ul>
              </div>
            </div>

            <!-- Education info -->
            <div class="flex gap-1 flex-col items-start">
              <div class="text-accentColor">
                Bachelor&apos;s degree, CET-6
              </div>
              <div class="overflow-hidden">
                <div class="dark:text-white text-animation">
                  Graduated from Zhejiang Sci-Tech University. Currently under
                  postgraduate at Tongji University, majoring in Artificial
                  Intelligence
                </div>
              </div>
            </div>
          </div>

          <!-- Counters -->
          <div
            class="w-full py-5 flex items-center gap-6 md:gap-6 lg:gap-20"
            style="border-top: 0.01px solid hsl(var(--accent-color)); border-bottom: 0.01px solid hsl(var(--accent-color));"
          >
            <div class="flex flex-col items-center">
              <div class="text-3xl md:text-4xl font-medium dark:text-white">
                <span class="experience-count">0</span>
                <span class="text-accentColor">+</span>
              </div>
              <div class="dark:text-white text-sm">Experiences</div>
            </div>

            <div class="flex flex-col font-medium items-center">
              <div class="text-3xl md:text-4xl dark:text-white">
                <span class="project-count">0</span>
                <span class="text-accentColor">+</span>
              </div>
              <div class="dark:text-white text-sm">Completed Projects</div>
            </div>

            <div class="flex flex-col font-medium items-center">
              <div class="text-3xl md:text-4xl dark:text-white">
                <span class="user-count">0</span>
                <span class="text-accentColor">+</span>
              </div>
              <div class="dark:text-white text-sm">Contributions</div>
            </div>
          </div>
        </div>

        <!-- Right: Selfie image with decorative SVGs -->
        <div class="w-full h-full flex justify-center items-center image-animation">
          <div class="relative w-[220px] h-[275px] lg:w-[240px] lg:h-[300px]">
            <!-- Accent color background offset -->
            <div class="w-full h-full bg-accentColor shadow-md rounded-sm absolute -right-3 -bottom-3" />
            <!-- Selfie photo -->
            <img
              class="absolute z-10 w-full h-full shadow-sm rounded-sm object-cover"
              width="300"
              height="262"
              alt="selfie"
              src="/assets/images/selfie.jpg"
            />

            <!-- Decorative: triangle -->
            <div class="absolute hidden lg:block -top-12 -right-12">
              <img
                class="pointer-events-none select-none"
                width="26"
                height="26"
                alt="triangle background"
                src="/assets/about/triangle.svg"
              />
            </div>

            <!-- Decorative: circle -->
            <div class="absolute hidden lg:block -bottom-14 -right-10">
              <img
                class="pointer-events-none select-none"
                width="22"
                height="22"
                alt="circle background"
                src="/assets/about/circle.svg"
              />
            </div>

            <!-- Decorative: star -->
            <div class="absolute hidden lg:block -bottom-16 -left-10">
              <img
                class="pointer-events-none select-none"
                width="34"
                height="34"
                alt="star background"
                src="/assets/about/star.svg"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tech Stack marquee -->
      <TechStack />
    </div>
  </section>
</template>
