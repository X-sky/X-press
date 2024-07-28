"use client"

import { useEffect, useRef } from "react"
import useScrollActive from "@/hooks/useScrollActive"
import Circle from "@/public/assets/about/circle.svg"
import Signs from "@/public/assets/about/signs.svg"
import Star from "@/public/assets/about/star.svg"
import Triangle from "@/public/assets/about/triangle.svg"
import SelfieImage from "@/public/selfie.jpg"
import { useSectionStore } from "@/store/section"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import Image from "next/image"
import SplitType from "split-type"

export default function AboutSection() {
  gsap.registerPlugin(ScrollTrigger)

  const sectionRef = useRef(null)

  useEffect(() => {
    const q = gsap.utils.selector(sectionRef)

    new SplitType(q(".title"), {
      types: "chars",
      tagName: "span",
    })

    gsap.from(q(".title .char"), {
      opacity: 0.3,
      duration: 0.5,
      ease: "power1.out",
      stagger: 0.1,

      scrollTrigger: {
        trigger: q(".title"),
        start: "top center",
        scrub: true,
      },
    })

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        scrub: true,
        onEnter: () => {
          const tl = gsap.timeline({
            defaults: {
              stagger: 0.2,
              duration: 0.3,
            },
          })

          tl.fromTo(
            q(".image-animation"),
            {
              x: 200,
            },
            {
              x: 0,
            }
          )

          tl.fromTo(
            q(".text-animation"),
            {
              y: 100,
            },
            {
              y: 0,
            }
          )

          tl.to(q(".experience-count"), {
            innerText: 6,
            duration: 0.5,
            snap: {
              innerText: 1,
            },
          })

          tl.to(
            q(".project-count"),
            {
              innerText: 15,
              duration: 0.5,
              snap: {
                innerText: 1,
              },
            },
            "-=0.3"
          )

          tl.to(
            q(".user-count"),
            {
              innerText: 30,
              duration: 0.5,
              snap: {
                innerText: 1,
              },
            },
            "-=0.3"
          )
        },
      },
    })
  }, [])

  // Set Active Session
  const aboutSectionOnView = useScrollActive(sectionRef)
  const { setSection } = useSectionStore()

  useEffect(() => {
    aboutSectionOnView ? setSection("#about") : setSection("#home")
  }, [aboutSectionOnView, setSection])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-full bg-gray-100 dark:bg-[#161D1F] overflow-hidden py-14 px-10 lg:px-[5%]"
    >
      <div className="w-full max-w-[1100px] h-full m-auto flex flex-col items-center gap-24">
        <div className="relative title text-xl md:text-4xl tracking-tight font-medium w-fit dark:text-white">
          Keep Looking. Don&apos;t settle.
          <div className="absolute -right-[10px] top-2">
            <Image
              className="w-14 pointer-events-none select-none"
              src={Signs}
              alt="signs"
            />
          </div>
        </div>
        <div className="w-full flex flex-col-reverse md:flex-row items-center gap-20 md:gap-2 lg:gap-10">
          <div className="w-full flex flex-col items-start gap-7 md:gap-9">
            <div className="relative">
              <div className="overflow-hidden">
                <div className="text-animation dark:text-accentColor text-3xl md:text-4xl font-medium">
                  About me
                </div>
              </div>

              <div className="absolute -top-6 -left-8">
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
                  ></path>
                </svg>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4">
              <div className="overflow-hidden">
                <div className="dark:text-white text-animation">
                  <ul>
                    <li>
                      - A frontend developer with over 6 years of experience
                    </li>
                    <li>
                      - Mastering various frontend frameworks, especially Vue
                      and its ecosystem.
                    </li>
                    <li>
                      - Proficient in toolchains and infrastructure with unique
                      insights into coding and architecture
                    </li>
                    <li>
                      - A meticulous scholar and a cheerful optimist in life
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-1 flex-col items-start">
                <div className="text-accentColor">
                  Bachelor&apos;s degree, CET-6
                </div>
                <div className="overflow-hidden">
                  <div className="dark:text-white text-animation">
                    Graduated from Zhejiang Sci-Tech University. Currently under
                    postgraduate at Tongji University, majoring in Artificial
                    Intelligence
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full border-t-accentColor py-5 border-b-accentColor border-t-[0.01px] border-b-[0.01px] flex items-center gap-6 md:gap-6 lg:gap-20">
              <div className="flex flex-col items-center">
                <div className="text-3xl md:text-4xl font-medium dark:text-white">
                  <span className="experience-count">0</span>{" "}
                  <span className="text-accentColor">+</span>
                </div>
                <div className="dark:text-white text-sm">Experiences</div>
              </div>

              <div className="flex flex-col font-medium items-center">
                <div className="text-3xl md:text-4xl dark:text-white">
                  <span className="project-count">0</span>{" "}
                  <span className="text-accentColor">+</span>
                </div>
                <div className="dark:text-white text-sm">
                  Completed Projects
                </div>
              </div>

              <div className="flex flex-col font-medium items-center">
                <div className="text-3xl md:text-4xl dark:text-white">
                  <span className="user-count">0</span>{" "}
                  <span className="text-accentColor">+</span>
                </div>
                <div className="dark:text-white text-sm">Contributions</div>
              </div>
            </div>
          </div>
          <div className="w-full h-full flex justify-center items-center image-animation ">
            <div className="relative w-[220px] h-[275px] lg:w-[240px] lg:h-[300px]">
              <div className="w-full h-full bg-accentColor shadow-md rounded-sm absolute -right-3 -bottom-3" />
              <Image
                className="absolute z-10 w-full h-full shadow-sm rounded-sm"
                width={300}
                height={262}
                priority
                alt="selfie"
                src={SelfieImage}
              />

              <div className="absolute hidden lg:block -top-12 -right-12">
                <Image
                  className="pointer-events-auto select-none"
                  width={26}
                  height={26}
                  alt="triangle background"
                  src={Triangle}
                />
              </div>

              <div className="absolute hidden lg:block -bottom-14 -right-10">
                <Image
                  className="pointer-events-auto select-none"
                  width={22}
                  height={22}
                  alt="circle background"
                  src={Circle}
                />
              </div>

              <div className="absolute hidden lg:block -bottom-16 -left-10">
                <Image
                  className="pointer-events-auto select-none"
                  width={34}
                  height={34}
                  alt="star background"
                  src={Star}
                />
              </div>
            </div>
          </div>
        </div>

        <TechStack />
      </div>
    </section>
  )
}

const TechStack = () => {
  return (
    <div className="w-full inline-flex gap-20 flex-nowrap lg:overflow-hidden">
      <div className="flex items-center gap-20 justify-center animate-infinite-scroll">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="stroke-black dark:stroke-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 17.5c.32 .32 .754 .5 1.207 .5h.543c.69 0 1.25 -.56 1.25 -1.25v-.25a1.5 1.5 0 0 0 -1.5 -1.5a1.5 1.5 0 0 1 -1.5 -1.5v-.25c0 -.69 .56 -1.25 1.25 -1.25h.543c.453 0 .887 .18 1.207 .5" />
            <path d="M9 12h4" />
            <path d="M11 12v6" />
            <path d="M21 19v-14a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2z" />
          </svg>
          <div className="dark:text-white text-lg font-medium">TypeScript</div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="0.5"
            className="stroke-black dark:stroke-white translate-y-1"
            fill="none"
          >
            <path d="M7.5 13.5L7.06811 13.7519C7.15772 13.9055 7.32217 14 7.5 14C7.67783 14 7.84228 13.9055 7.93189 13.7519L7.5 13.5ZM11.5 1.5L11.9341 1.74807C12.0226 1.59332 12.0219 1.40319 11.9325 1.24904C11.843 1.09488 11.6782 1 11.5 1V1.5ZM7.5 8.5L7.06588 8.74807C7.1549 8.90386 7.32057 9 7.5 9C7.67943 9 7.8451 8.90386 7.93412 8.74807L7.5 8.5ZM3.5 1.5V1C3.32176 1 3.15701 1.09488 3.06754 1.24904C2.97808 1.40319 2.97745 1.59332 3.06588 1.74807L3.5 1.5ZM6.5 1.5L6.94721 1.27639L6.80902 1H6.5V1.5ZM7.5 3.5L7.05279 3.72361C7.13748 3.893 7.31061 4 7.5 4C7.68939 4 7.86252 3.893 7.94721 3.72361L7.5 3.5ZM8.5 1.5V1H8.19098L8.05279 1.27639L8.5 1.5ZM0.0681106 1.75194L7.06811 13.7519L7.93189 13.2481L0.931889 1.24806L0.0681106 1.75194ZM7.93189 13.7519L14.9319 1.75194L14.0681 1.24806L7.06811 13.2481L7.93189 13.7519ZM11.0659 1.25193L7.06588 8.25193L7.93412 8.74807L11.9341 1.74807L11.0659 1.25193ZM7.93412 8.25193L3.93412 1.25193L3.06588 1.74807L7.06588 8.74807L7.93412 8.25193ZM3.5 2H6.5V1H3.5V2ZM6.05279 1.72361L7.05279 3.72361L7.94721 3.27639L6.94721 1.27639L6.05279 1.72361ZM7.94721 3.72361L8.94721 1.72361L8.05279 1.27639L7.05279 3.27639L7.94721 3.72361ZM8.5 2H11.5V1H8.5V2Z" />
          </svg>
          <div className="dark:text-white text-lg font-medium">Vue</div>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="stroke-black dark:stroke-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6.306 8.711c-2.602 .723 -4.306 1.926 -4.306 3.289c0 2.21 4.477 4 10 4c.773 0 1.526 -.035 2.248 -.102" />
            <path d="M17.692 15.289c2.603 -.722 4.308 -1.926 4.308 -3.289c0 -2.21 -4.477 -4 -10 -4c-.773 0 -1.526 .035 -2.25 .102" />
            <path d="M6.305 15.287c-.676 2.615 -.485 4.693 .695 5.373c1.913 1.105 5.703 -1.877 8.464 -6.66c.387 -.67 .733 -1.339 1.036 -2" />
            <path d="M17.694 8.716c.677 -2.616 .487 -4.696 -.694 -5.376c-1.913 -1.105 -5.703 1.877 -8.464 6.66c-.387 .67 -.733 1.34 -1.037 2" />
            <path d="M12 5.424c-1.925 -1.892 -3.82 -2.766 -5 -2.084c-1.913 1.104 -1.226 5.877 1.536 10.66c.386 .67 .793 1.304 1.212 1.896" />
            <path d="M12 18.574c1.926 1.893 3.821 2.768 5 2.086c1.913 -1.104 1.226 -5.877 -1.536 -10.66c-.375 -.65 -.78 -1.283 -1.212 -1.897" />
            <path d="M11.5 12.866a1 1 0 1 0 1 -1.732a1 1 0 0 0 -1 1.732z" />
          </svg>
          <div className="dark:text-white text-lg font-medium">React</div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="stroke-black dark:stroke-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 15v-6l7.745 10.65a9 9 0 1 1 2.255 -1.993" />
            <path d="M15 12v-3" />
          </svg>
          <div className="dark:text-white text-lg font-medium">Next</div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="stroke-black dark:stroke-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M20 4l-2 14.5l-6 2l-6 -2l-2 -14.5z" />
            <path d="M7.5 8h3v8l-2 -1" />
            <path d="M16.5 8h-2.5a.5 .5 0 0 0 -.5 .5v3a.5 .5 0 0 0 .5 .5h1.423a.5 .5 0 0 1 .495 .57l-.418 2.93l-2 .5" />
          </svg>
          <div className="dark:text-white text-lg font-medium">JavaScript</div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="stroke-black dark:stroke-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M11.667 6c-2.49 0 -4.044 1.222 -4.667 3.667c.933 -1.223 2.023 -1.68 3.267 -1.375c.71 .174 1.217 .68 1.778 1.24c.916 .912 2 1.968 4.288 1.968c2.49 0 4.044 -1.222 4.667 -3.667c-.933 1.223 -2.023 1.68 -3.267 1.375c-.71 -.174 -1.217 -.68 -1.778 -1.24c-.916 -.912 -1.975 -1.968 -4.288 -1.968zm-4 6.5c-2.49 0 -4.044 1.222 -4.667 3.667c.933 -1.223 2.023 -1.68 3.267 -1.375c.71 .174 1.217 .68 1.778 1.24c.916 .912 1.975 1.968 4.288 1.968c2.49 0 4.044 -1.222 4.667 -3.667c-.933 1.223 -2.023 1.68 -3.267 1.375c-.71 -.174 -1.217 -.68 -1.778 -1.24c-.916 -.912 -1.975 -1.968 -4.288 -1.968z" />
          </svg>
          <div className="dark:text-white text-lg font-medium">Tailwind</div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            strokeWidth="1"
            className="stroke-black dark:stroke-white translate-y-1"
            fill="none"
          >
            <path d="M6 2.5H7M4.5 4V1.5C4.5 0.947715 4.94772 0.5 5.5 0.5H9.5C10.0523 0.5 10.5 0.947715 10.5 1.5V6.5C10.5 7.05228 10.0523 7.5 9.5 7.5H5.5C4.94772 7.5 4.5 7.94772 4.5 8.5V13.5C4.5 14.0523 4.94772 14.5 5.5 14.5H9.5C10.0523 14.5 10.5 14.0523 10.5 13.5V11M8 4.5H1.5C0.947715 4.5 0.5 4.94772 0.5 5.5V10.5C0.5 11.0523 0.947715 11.5 1.5 11.5H4.5M7 10.5H13.5C14.0523 10.5 14.5 10.0523 14.5 9.5V4.5C14.5 3.94772 14.0523 3.5 13.5 3.5H10.5M8 12.5H9" />
          </svg>
          <div className="dark:text-white text-lg font-medium">Python</div>
        </div>
      </div>

      <div
        className="flex items-center gap-20 justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="stroke-black dark:stroke-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 17.5c.32 .32 .754 .5 1.207 .5h.543c.69 0 1.25 -.56 1.25 -1.25v-.25a1.5 1.5 0 0 0 -1.5 -1.5a1.5 1.5 0 0 1 -1.5 -1.5v-.25c0 -.69 .56 -1.25 1.25 -1.25h.543c.453 0 .887 .18 1.207 .5" />
            <path d="M9 12h4" />
            <path d="M11 12v6" />
            <path d="M21 19v-14a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2z" />
          </svg>
          <div className="dark:text-white text-lg font-medium">TypeScript</div>
        </div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="0.5"
            className="stroke-black dark:stroke-white translate-y-1"
            fill="none"
          >
            <path d="M7.5 13.5L7.06811 13.7519C7.15772 13.9055 7.32217 14 7.5 14C7.67783 14 7.84228 13.9055 7.93189 13.7519L7.5 13.5ZM11.5 1.5L11.9341 1.74807C12.0226 1.59332 12.0219 1.40319 11.9325 1.24904C11.843 1.09488 11.6782 1 11.5 1V1.5ZM7.5 8.5L7.06588 8.74807C7.1549 8.90386 7.32057 9 7.5 9C7.67943 9 7.8451 8.90386 7.93412 8.74807L7.5 8.5ZM3.5 1.5V1C3.32176 1 3.15701 1.09488 3.06754 1.24904C2.97808 1.40319 2.97745 1.59332 3.06588 1.74807L3.5 1.5ZM6.5 1.5L6.94721 1.27639L6.80902 1H6.5V1.5ZM7.5 3.5L7.05279 3.72361C7.13748 3.893 7.31061 4 7.5 4C7.68939 4 7.86252 3.893 7.94721 3.72361L7.5 3.5ZM8.5 1.5V1H8.19098L8.05279 1.27639L8.5 1.5ZM0.0681106 1.75194L7.06811 13.7519L7.93189 13.2481L0.931889 1.24806L0.0681106 1.75194ZM7.93189 13.7519L14.9319 1.75194L14.0681 1.24806L7.06811 13.2481L7.93189 13.7519ZM11.0659 1.25193L7.06588 8.25193L7.93412 8.74807L11.9341 1.74807L11.0659 1.25193ZM7.93412 8.25193L3.93412 1.25193L3.06588 1.74807L7.06588 8.74807L7.93412 8.25193ZM3.5 2H6.5V1H3.5V2ZM6.05279 1.72361L7.05279 3.72361L7.94721 3.27639L6.94721 1.27639L6.05279 1.72361ZM7.94721 3.72361L8.94721 1.72361L8.05279 1.27639L7.05279 3.27639L7.94721 3.72361ZM8.5 2H11.5V1H8.5V2Z" />
          </svg>
          <div className="dark:text-white text-lg font-medium">Vue</div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="stroke-black dark:stroke-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6.306 8.711c-2.602 .723 -4.306 1.926 -4.306 3.289c0 2.21 4.477 4 10 4c.773 0 1.526 -.035 2.248 -.102" />
            <path d="M17.692 15.289c2.603 -.722 4.308 -1.926 4.308 -3.289c0 -2.21 -4.477 -4 -10 -4c-.773 0 -1.526 .035 -2.25 .102" />
            <path d="M6.305 15.287c-.676 2.615 -.485 4.693 .695 5.373c1.913 1.105 5.703 -1.877 8.464 -6.66c.387 -.67 .733 -1.339 1.036 -2" />
            <path d="M17.694 8.716c.677 -2.616 .487 -4.696 -.694 -5.376c-1.913 -1.105 -5.703 1.877 -8.464 6.66c-.387 .67 -.733 1.34 -1.037 2" />
            <path d="M12 5.424c-1.925 -1.892 -3.82 -2.766 -5 -2.084c-1.913 1.104 -1.226 5.877 1.536 10.66c.386 .67 .793 1.304 1.212 1.896" />
            <path d="M12 18.574c1.926 1.893 3.821 2.768 5 2.086c1.913 -1.104 1.226 -5.877 -1.536 -10.66c-.375 -.65 -.78 -1.283 -1.212 -1.897" />
            <path d="M11.5 12.866a1 1 0 1 0 1 -1.732a1 1 0 0 0 -1 1.732z" />
          </svg>
          <div className="dark:text-white text-lg font-medium">React</div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="stroke-black dark:stroke-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 15v-6l7.745 10.65a9 9 0 1 1 2.255 -1.993" />
            <path d="M15 12v-3" />
          </svg>
          <div className="dark:text-white text-lg font-medium">Next</div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="stroke-black dark:stroke-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M20 4l-2 14.5l-6 2l-6 -2l-2 -14.5z" />
            <path d="M7.5 8h3v8l-2 -1" />
            <path d="M16.5 8h-2.5a.5 .5 0 0 0 -.5 .5v3a.5 .5 0 0 0 .5 .5h1.423a.5 .5 0 0 1 .495 .57l-.418 2.93l-2 .5" />
          </svg>
          <div className="dark:text-white text-lg font-medium">JavaScript</div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="stroke-black dark:stroke-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M11.667 6c-2.49 0 -4.044 1.222 -4.667 3.667c.933 -1.223 2.023 -1.68 3.267 -1.375c.71 .174 1.217 .68 1.778 1.24c.916 .912 2 1.968 4.288 1.968c2.49 0 4.044 -1.222 4.667 -3.667c-.933 1.223 -2.023 1.68 -3.267 1.375c-.71 -.174 -1.217 -.68 -1.778 -1.24c-.916 -.912 -1.975 -1.968 -4.288 -1.968zm-4 6.5c-2.49 0 -4.044 1.222 -4.667 3.667c.933 -1.223 2.023 -1.68 3.267 -1.375c.71 .174 1.217 .68 1.778 1.24c.916 .912 1.975 1.968 4.288 1.968c2.49 0 4.044 -1.222 4.667 -3.667c-.933 1.223 -2.023 1.68 -3.267 1.375c-.71 -.174 -1.217 -.68 -1.778 -1.24c-.916 -.912 -1.975 -1.968 -4.288 -1.968z" />
          </svg>
          <div className="dark:text-white text-lg font-medium">Tailwind</div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            strokeWidth="1"
            className="stroke-black dark:stroke-white translate-y-1"
            fill="none"
          >
            <path d="M6 2.5H7M4.5 4V1.5C4.5 0.947715 4.94772 0.5 5.5 0.5H9.5C10.0523 0.5 10.5 0.947715 10.5 1.5V6.5C10.5 7.05228 10.0523 7.5 9.5 7.5H5.5C4.94772 7.5 4.5 7.94772 4.5 8.5V13.5C4.5 14.0523 4.94772 14.5 5.5 14.5H9.5C10.0523 14.5 10.5 14.0523 10.5 13.5V11M8 4.5H1.5C0.947715 4.5 0.5 4.94772 0.5 5.5V10.5C0.5 11.0523 0.947715 11.5 1.5 11.5H4.5M7 10.5H13.5C14.0523 10.5 14.5 10.0523 14.5 9.5V4.5C14.5 3.94772 14.0523 3.5 13.5 3.5H10.5M8 12.5H9" />
          </svg>
          <div className="dark:text-white text-lg font-medium">Python</div>
        </div>
      </div>
    </div>
  )
}
