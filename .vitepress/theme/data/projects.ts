/**
 * Static project data configuration
 *
 * Migrated from X-portfolio-main/components/sections/ProjectSection.tsx
 * Project images are served from /assets/projects/ (VitePress public directory)
 */

export interface Project {
    id: number
    title: string
    description: string
    techStacks: string[]
    image: string
    githubURL: string
    githubApi: string
}

export const projects: Project[] = [
    {
        id: 1,
        title: 'HostsExtension',
        description:
            'Enjoy the very fast and instant host-switching experience with ✨HostsWitch✨ !',
        techStacks: ['React', 'TypeScript', 'MUI', 'Jotai'],
        image: '/assets/projects/HostsWitch.png',
        githubURL: 'https://github.com/X-sky/HostsWitch',
        githubApi: 'https://api.github.com/repos/X-sky/HostsWitch',
    },
    {
        id: 2,
        title: 'Vue uni ui',
        description: 'A Universal component lib for Vue 2 & 3!',
        techStacks: ['Vue', 'TypeScript', 'Vite'],
        image: '/assets/projects/vue-demi.png',
        githubURL: 'https://github.com/X-sky/vue-uni-component',
        githubApi: 'https://api.github.com/repos/X-sky/vue-uni-component',
    },
    {
        id: 3,
        title: 'X-press',
        description:
            'A refined and enhanced showcase of my work, an entry to all of my technique precipitation',
        techStacks: ['NextJS', 'ShadnUI', 'GSAP'],
        image: '/assets/projects/X-press.png',
        githubURL: 'https://github.com/ShinnTNT/shinthant.dev',
        githubApi: 'https://api.github.com/repos/ShinnTNT/shinthant.dev',
    },
]
