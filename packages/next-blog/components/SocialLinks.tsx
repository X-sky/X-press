import { ArrowRightIcon } from "@radix-ui/react-icons"
import { ArrowDown2, Mouse } from "iconsax-react"
import Link from "next/link"

export default function SocialLinks() {
  return (
    <>
      <div className="fixed z-10 right-4 bottom-[5%] md:bottom-[20%]">
        <div className="flex flex-col gap-6 items-center">
          {socialLinks.map((link) => (
            <Link
              key={link.id}
              title={link.title}
              target="_blank"
              aria-label={link.title}
              rel="noopener noreferrer"
              href={link.link}
              className="scale-110 rounded link-outline"
            >
              {link.svg}
            </Link>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 group flex flex-col gap-2 items-center left-4">
        <Link
          href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
          style={{
            writingMode: "vertical-lr",
          }}
          aria-label="blog"
          className="flex text-xs group-hover:text-accentColor font-light tracking-[0.3em] items-center gap-2 dark:text-gray-400"
        >
          Contact me
        </Link>
        <div className="h-24 w-[0.4px] bg-gray-400 group-hover:bg-accentColor "></div>
      </div>

      <div className="hidden md:block absolute bottom-4 right-4">
        <Link
          href="#project"
          aria-label="project"
          className="flex items-center gap-2 dark:text-gray-400"
        >
          <span className="text-sm tracking-widest">View Project</span>
          <ArrowRightIcon />
        </Link>
      </div>

      <Link
        href="#about"
        aria-label="about"
        className="absolute animate-bounce text-gray-600 dark:text-gray-400 hover:text-accentColor cursor-pointer bottom-4 left-[50%] -translate-x-1/2"
      >
        <div className="flex flex-col gap-1 items-center">
          <Mouse size={24} />
          <ArrowDown2 size={14} />
        </div>
      </Link>
    </>
  )
}

const socialLinks = [
  {
    id: 1,
    title: "Tse's Github Profile",
    link: "https://github.com/X-sky",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        className="dark:fill-gray-400 hover:fill-accentColor dark:hover:fill-accentColor"
      >
        <path d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"></path>
      </svg>
    ),
  },
]
