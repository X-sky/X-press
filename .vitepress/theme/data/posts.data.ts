/**
 * VitePress data loader for blog posts (multi-language).
 *
 * Uses createContentLoader to scan both English (`coding/**\/*.md`) and
 * Chinese (`zh/coding/**\/*.md`) posts at build time, extracting title,
 * description, and date from frontmatter.
 *
 * Exports separate arrays for each locale so BlogPreview can choose
 * based on the current language.
 */
import { createContentLoader } from 'vitepress'

export interface BlogPost {
    title: string
    description: string
    date: string
    url: string
}

export interface PostsData {
    en: BlogPost[]
    zh: BlogPost[]
}

/**
 * Transform raw content loader data into sorted BlogPost array.
 * Filters to posts with complete frontmatter, sorts by date descending,
 * and limits to 4 posts.
 */
function transformPosts(rawData: { url: string; frontmatter: Record<string, any> }[]): BlogPost[] {
    return rawData
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
}

// Use a single content loader with a broad pattern that captures both
// English and Chinese posts, then split them by path in the transform.
export default createContentLoader(['coding/**/*.md', 'zh/coding/**/*.md'], {
    transform(rawData): PostsData {
        const enRaw = rawData.filter((page) => !page.url.startsWith('/zh/'))
        const zhRaw = rawData.filter((page) => page.url.startsWith('/zh/'))

        return {
            en: transformPosts(enRaw),
            zh: transformPosts(zhRaw),
        }
    },
})
