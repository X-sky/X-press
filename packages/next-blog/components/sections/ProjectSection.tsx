"use client"

import { useEffect, useRef } from "react"
import useOnScreen from "@/hooks/useOnScreen"
import useScrollActive from "@/hooks/useScrollActive"
import HostsWitchImage from "@/public/assets/projects/HostsWitch.png"
import XPressImage from "@/public/assets/projects/X-press.png"
import VueDemiImage from "@/public/assets/projects/vue-demi.png"
import { useSectionStore } from "@/store/section"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { StaticImageData } from "next/image"
import Link from "next/link"
import { RoughNotation } from "react-rough-notation"
import ProjectCard from "../ProjectCard"

export default function ProjectSection() {
  gsap.registerPlugin(ScrollTrigger)

  const sectionRef = useRef(null)

  const elementRef = useRef<HTMLDivElement>(null)
  const isOnScreen = useOnScreen(elementRef)

  useEffect(() => {
    const q = gsap.utils.selector(sectionRef)

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        scrub: true,
        onEnter: () => {
          gsap.fromTo(
            q(".qoutes-animation"),
            {
              y: "-200%",
            },
            {
              y: 0,
            }
          )
        },
      },
    })
  }, [])

  // Set Active Session
  const projectSectionOnView = useScrollActive(sectionRef)
  const { setSection } = useSectionStore()

  useEffect(() => {
    projectSectionOnView && setSection("#project")
  }, [projectSectionOnView, setSection])

  return (
    <section
      ref={sectionRef}
      id="project"
      className="relative h-full bg-gray-50 dark:bg-gray-100 overflow-hidden py-14 px-10 lg:px-[5%]"
    >
      <div className="w-full max-w-[1100px] h-full m-auto flex flex-col items-center gap-14">
        <div className="w-[80%] md:w-full flex absolute left-1/2 -translate-x-1/2 flex-col gap-8 items-center">
          <RoughNotation
            type="underline"
            strokeWidth={2}
            color="hsl(157, 87%, 41%)"
            order={1}
            show={isOnScreen}
          >
            <div className="text-xl md:text-4xl tracking-tight font-medium w-fit dark:text-accentColor">
              Featured Projects
            </div>
          </RoughNotation>
          <div ref={elementRef} className="overflow-hidden ">
            <div className="qoutes-animation  md:w-full text-center font-medium flex flex-col items-center">
              <div>
                OpenSource is not about community, it&apos;s about attitude.
              </div>
            </div>
          </div>
        </div>
        <div className="w-full pt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project) => (
            <ProjectCard key={project.id} item={project} />
          ))}
        </div>

        <div className="font-medium">
          Explore more projects in{" "}
          <Link
            href="https://github.com/ShinnTNT"
            target="_blank"
            aria-label="Expore more in my github profile"
            rel="noopener noreferrer"
            className="text-accentColor"
          >
            my github profile
          </Link>
        </div>
      </div>
    </section>
  )
}

export interface Project {
  id: number
  title: string
  description: string
  techStacks: string[]
  image: StaticImageData
  githubURL: string
  githubApi: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "HostsExtension",
    description:
      "Enjoy the very fast and instant host-switching experience with ✨HostsWitch✨ !",
    techStacks: ["React", "TypeScript", "MUI", "Jotai"],
    image: HostsWitchImage,
    githubURL: "https://github.com/X-sky/HostsWitch",
    githubApi: "https://api.github.com/repos/X-sky/HostsWitch",
  },
  {
    id: 2,
    title: "Vue uni ui",
    description: "A Universal component lib for Vue 2 & 3!",
    techStacks: ["Vue", "typescript", "vite"],
    image: VueDemiImage,
    githubURL: "https://github.com/X-sky/vue-uni-component",
    githubApi: "https://api.github.com/repos/X-sky/vue-uni-component",
  },
  {
    id: 3,
    title: "X-press",
    description:
      "A refined and enhanced showcase of my work, an entry to all of my technique precipitation",
    techStacks: ["NextJS", "ShadnUI", "GSAP"],
    image: XPressImage,
    githubURL: "https://github.com/ShinnTNT/shinthant.dev",
    githubApi: "https://api.github.com/repos/ShinnTNT/shinthant.dev",
  },
]
