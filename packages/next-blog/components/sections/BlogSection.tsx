"use client"

import { useEffect, useRef } from "react"
import useOnScreen from "@/hooks/useOnScreen"
import useScrollActive from "@/hooks/useScrollActive"
import { useSectionStore } from "@/store/section"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { ArrowRight } from "iconsax-react"
import Link from "next/link"
import { RoughNotation } from "react-rough-notation"
import BlogCard from "../BlogCard"

export default function BlogSection() {
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
  const aboutSectionOnView = useScrollActive(sectionRef)
  const { setSection } = useSectionStore()

  useEffect(() => {
    aboutSectionOnView && setSection("#blog")
  }, [aboutSectionOnView, setSection])

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="h-full bg-baseBackground py-14 px-10 lg:px-[5%]"
    >
      <div className="w-full max-w-[1100px] h-full m-auto flex flex-col items-center gap-14">
        <div className="w-[80%] md:w-full flex flex-col gap-8 items-center">
          <RoughNotation
            type="underline"
            strokeWidth={2}
            color="hsl(157, 87%, 41%)"
            order={1}
            show={isOnScreen}
          >
            <div className="text-xl md:text-4xl tracking-tight font-medium w-fit dark:text-accentColor">
              Blog
            </div>
          </RoughNotation>
          <div ref={elementRef} className="overflow-hidden flex flex-col gap-1">
            <div className="qoutes-animation mx-auto text-center text-sm dark:text-white flex flex-col items-center font-normal">
              I document my journey by writing blog posts about my projects and
              experiences.
            </div>
            <div className="qoutes-animation mx-auto text-center text-sm dark:text-white flex flex-col items-center font-normal">
              <div>Check out some of my latest entries below. 🚀</div>
            </div>
          </div>
        </div>

        <div className="md:w-full pt-4 pb-10 flex flex-col items-start gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} item={blog} />
          ))}
        </div>

        <Link
          href={"https://x-sky.github.io/X-press/coding/frontend/auto-hosts/"}
          target="_blank"
          aria-label="Read more"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <div className="text-accentColor navlink text-sm italic">
            Read more
          </div>
          <ArrowRight color="white" size={15} />
        </Link>
      </div>
    </section>
  )
}

export interface Blog {
  id: number
  title: string
  description: string
  publishAt: string
  link: string
}

const blogs: Blog[] = [
  {
    id: 1,
    title: "Aspects of web performance",
    description:
      "Web performance is a crucial aspect of web development. There are huge amounts of articles focusing on optimizing techniques, merely diving into the inside. However, we should know: optimizing is compromising.",
    publishAt: "2024, July 2",
    link: "https://x-sky.github.io/X-press/coding/frontend/data-analytics/",
  },
  {
    id: 2,
    title: "Practice data analytics in frontend",
    description:
      "Data analytics is a vital procedure for decision-making. It normally just means an interface to a frontend developer. However, when it comes to designing a data analytics system, it's a whole different story.",
    publishAt: "2024, June 9",
    link: "https://x-sky.github.io/X-press/coding/frontend/data-analytics/",
  },
  {
    id: 3,
    title: "Why do we need auto-testing",
    description:
      "Test automation is a must-have for a project, but somehow not being taken seriously. In this article, I will explain why we need auto-testing and how to implement it in a project.",
    publishAt: "2024, March 30",
    link: "https://x-sky.github.io/X-press/coding/frontend/vue-uni-comp/test.html",
  },
  {
    id: 4,
    title: "A tutorial for Chrome extension development",
    description:
      "Developing a Chrome extension is not only necessary for upgrading devloping skills, but also a sharp knife for some certain problems. In this article, I will guide you through the process of how I created a simple Chrome extension -- HostsWitch.",
    publishAt: "2023, May 10",
    link: "https://x-sky.github.io/X-press/coding/frontend/auto-hosts/",
  },
]
