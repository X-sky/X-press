/**
 * VitePress data loader for blog posts.
 *
 * Uses createContentLoader to scan `coding/**\/*.md` at build time,
 * extracting title, description, and date from frontmatter.
 *
 * If blog posts lack frontmatter fields (title/description/date),
 * falls back to hardcoded data matching the original X-portfolio BlogSection.
 */
import { createContentLoader } from 'vitepress'

export interface BlogPost {
    title: string
    description: string
    date: string
    url: string
}

/**
 * Fallback data matching the original X-portfolio BlogSection.tsx blogs array.
 * Used when blog posts don't have title/description/date in frontmatter.
 */
const fallbackPosts: BlogPost[] = [
    {
        title: 'Aspects of web performance',
        description:
            'Web performance is a crucial aspect of web development. There are huge amounts of articles focusing on optimizing techniques, merely diving into the inside. However, we should know: optimizing is compromising.',
        date: '2024-07-02',
        url: '/coding/frontend/performance/',
    },
    {
        title: 'Practice data analytics in frontend',
        description:
            'Data analytics is a vital procedure for decision-making. It normally just means an interface to a frontend developer. However, when it comes to designing a data analytics system, it\'s a whole different story.',
        date: '2024-06-09',
        url: '/coding/frontend/data-analytics/',
    },
    {
        title: 'Why do we need auto-testing',
        description:
            'Test automation is a must-have for a project, but somehow not being taken seriously. In this article, I will explain why we need auto-testing and how to implement it in a project.',
        date: '2024-03-30',
        url: '/coding/frontend/vue-uni-comp/test',
    },
    {
        title: 'A tutorial for Chrome extension development',
        description:
            'Developing a Chrome extension is not only necessary for upgrading developing skills, but also a sharp knife for some certain problems. In this article, I will guide you through the process of how I created a simple Chrome extension -- HostsWitch.',
        date: '2023-05-10',
        url: '/coding/frontend/auto-hosts/',
    },
]

export default createContentLoader('coding/**/*.md', {
    transform(rawData): BlogPost[] {
        // Try to build posts from frontmatter
        const postsFromFrontmatter = rawData
            .filter((page) => {
                const { title, description, date } = page.frontmatter
                return title && description && date
            })
            .map((page) => ({
                title: page.frontmatter.title as string,
                description: page.frontmatter.description as string,
                date: page.frontmatter.date as string,
                url: page.url,
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 4)

        // If no posts have complete frontmatter, use fallback data
        if (postsFromFrontmatter.length === 0) {
            return fallbackPosts
        }

        return postsFromFrontmatter
    },
})
