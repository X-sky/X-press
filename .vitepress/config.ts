/**
 * @description if file extension was not 'mts', vitepress will treat .ts file as commonjs module if no project-level "type: modules" specified, while vite deprecating cjs syntax. To avoid this problem, just change the ext to mts to tell vitepress that this file should be treated as an ESmodule.
 */

import path from 'path';
import { defineConfig } from 'vitepress';
import type { DefaultTheme } from 'vitepress';
import UnoCSS from 'unocss/vite';
import { pythonWatcherPlugin } from './plugins';

const BASE_DIR = '/X-press';

/** editLink pattern shared across locales */
const editLinkPattern = ({ frontmatter, relativePath }: { frontmatter: Record<string, unknown>; relativePath: string }) => {
  const commonRootPrefix =
    'https://github.com/X-sky/X-press/blob/main/src/';
  if (frontmatter.ipynb) {
    const ipynbPath = relativePath
      .replace(/.md$/i, '.ipynb')
      .replace(`markdowns/`, '');
    // ipynb预转换的文件需要修改编辑链接
    return `${commonRootPrefix}${ipynbPath}`;
  } else {
    return `${commonRootPrefix}${relativePath}`;
  }
};

export default defineConfig({
  srcDir: 'src',
  base: `${BASE_DIR}/`,
  appearance: 'dark',
  vite: {
    plugins: [UnoCSS(), pythonWatcherPlugin()],
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, '../src'),
        '@theme/*': path.resolve(__dirname, './theme'),
        'fs-extra': path.resolve(
          __dirname,
          '../node_modules/fs-extra/lib/esm.mjs'
        )
      }
    },
    ssr: {
      noExternal: ['gsap']
    }
  },
  ignoreDeadLinks: [
    /pythonCrashCourse\/web-app/,
    /coding\/python\/markdowns/,
  ],
  /* Shared head tags (favicon, fonts, twitter card, og:image, og:type) */
  head: [
    ['link', { rel: 'icon', href: `${BASE_DIR}/logo.svg` }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap', rel: 'stylesheet' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://x-sky.github.io/X-press/logo.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],
  /* Shared themeConfig (logo, socialLinks) */
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/X-sky/X-press.git' }
    ]
  },
  /* SEO: generate hreflang alternate links for each page */
  transformHead({ pageData }) {
    const relativePath = pageData.relativePath // e.g., 'index.md' or 'zh/coding/frontend/auto-hosts/index.md'
    const siteBase = 'https://x-sky.github.io/X-press/'

    // Compute English and Chinese paths
    const isZh = relativePath.startsWith('zh/')
    const enPath = isZh ? relativePath.replace(/^zh\//, '') : relativePath
    const zhPath = isZh ? relativePath : `zh/${relativePath}`

    // Convert .md to .html for URLs, strip trailing index.html for cleaner URLs
    const enUrl = siteBase + enPath.replace(/\.md$/, '.html').replace(/index\.html$/, '')
    const zhUrl = siteBase + zhPath.replace(/\.md$/, '.html').replace(/index\.html$/, '')

    return [
      ['link', { rel: 'alternate', hreflang: 'en', href: enUrl }],
      ['link', { rel: 'alternate', hreflang: 'zh', href: zhUrl }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: enUrl }],
    ]
  },
  /* Multi-language locales configuration */
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'X-press',
      description: 'X-press - A Frontend Developer Portfolio & Blog',
      head: [
        ['meta', { property: 'og:title', content: 'X-press' }],
        ['meta', { property: 'og:description', content: 'A Frontend Developer Portfolio & Blog' }],
        ['meta', { property: 'og:locale', content: 'en_US' }],
      ],
      themeConfig: {
        nav: getNavList(),
        sidebar: {
          '/coding/': getCodeSidebarList()
        },
        outline: {
          label: '----In this page----'
        },
        editLink: {
          pattern: editLinkPattern,
          text: 'Edit this page on GitHub'
        },
      },
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      title: 'X-press',
      description: 'X-press - 前端开发者作品集与博客',
      head: [
        ['meta', { property: 'og:title', content: 'X-press' }],
        ['meta', { property: 'og:description', content: '前端开发者作品集与博客' }],
        ['meta', { property: 'og:locale', content: 'zh_CN' }],
      ],
      themeConfig: {
        nav: getZhNavList(),
        sidebar: {
          '/zh/coding/': getZhCodeSidebarList(),
          '/zh/daily/': [
            {
              text: '日报',
              items: [
                { text: '日报列表', link: '/zh/daily/' }
              ]
            }
          ]
        },
        outline: {
          label: '----本页目录----'
        },
        editLink: {
          pattern: editLinkPattern,
          text: '在 GitHub 上编辑此页'
        },
      },
    },
  },
});
/**导航栏 */
function getNavList(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    {
      text: 'Coding',
      activeMatch: '/coding/',
      items: [
        {
          text: 'Frontend',
          link:
            (getCodeSidebarList()[0].items || [])[0].link ||
            '/coding/frontend/race-condition/index.md'
        },
        {
          text: 'Python',
          link:
            (getCodeSidebarList()[1].items || [])[0].link ||
            '/coding/python/markdowns/pythonCrashCourse'
        },
        {
          text: 'Others',
          link:
            (getCodeSidebarList()[2].items || [])[0].link ||
            '/coding/others/shortcuts'
        }
      ]
    }
  ];
}

function getCodeSidebarList(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Frontend',
      collapsed: false,
      items: [
        {
          text: 'Host Extension',
          link: '/coding/frontend/auto-hosts/index.md'
        },
        {
          text: 'Vue Uni Component Lib',
          link: '/coding/frontend/vue-uni-comp/index.md'
        },
        {
          text: 'Test Automation',
          link: '/coding/frontend/vue-uni-comp/test.md'
        },
        {
          text: 'Data Analytics',
          link: '/coding/frontend/data-analytics/index.md'
        },
        {
          text: 'Web Performance',
          link: '/coding/frontend/performance/index.md',
          items: [
            {
              text: 'Core Web Vitals',
              link: '/coding/frontend/performance/core-web-vitals/index.md'
            },
            {
              text: 'Specifications',
              link: '/coding/frontend/performance/specifications/index.md'
            }
          ]
        },
        {
          text: 'Race condition',
          link: '/coding/frontend/race-condition/index.md'
        },
        {
          text: 'Something wrong with Text-align:justify!',
          link: '/coding/frontend/text-align-justify/index.md'
        },
        {
          text: 'Iterator & Generator',
          link: '/coding/frontend/iterator/index.md'
        }
      ]
    },
    {
      text: 'Python',
      collapsed: true,
      items: [
        {
          text: 'Python Crash Course',
          link: '/coding/python/markdowns/pythonCrashCourse/index.md',
          items: [
            {
              text: 'Visualize Data',
              link: '/coding/python/markdowns/pythonCrashCourse/data-visualizing.md'
            },
            {
              text: 'Build Web App',
              link: '/coding/python/pythonCrashCourse/web-app.md'
            }
          ]
        }
      ]
    },
    {
      text: 'Others',
      collapsed: true,
      items: [
        {
          text: 'Keyboard Shortcut',
          link: '/coding/others/shortcuts/index.md'
        }
      ]
    }
  ];
}

/**中文导航栏 */
function getZhNavList(): DefaultTheme.NavItem[] {
  return [
    { text: '首页', link: '/zh/' },
    {
      text: '编程',
      activeMatch: '/zh/coding/',
      items: [
        {
          text: '前端',
          link:
            (getZhCodeSidebarList()[0].items || [])[0].link ||
            '/zh/coding/frontend/race-condition/index.md'
        },
        {
          text: 'Python',
          link:
            (getZhCodeSidebarList()[1].items || [])[0].link ||
            '/zh/coding/python/markdowns/pythonCrashCourse'
        },
        {
          text: '其他',
          link:
            (getZhCodeSidebarList()[2].items || [])[0].link ||
            '/zh/coding/others/shortcuts'
        }
      ]
    },
    { text: '日报', link: '/zh/daily/' }
  ];
}

/**中文侧边栏 */
function getZhCodeSidebarList(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '前端',
      collapsed: false,
      items: [
        {
          text: 'Host 扩展',
          link: '/zh/coding/frontend/auto-hosts/index.md'
        },
        {
          text: 'Vue 通用组件库',
          link: '/zh/coding/frontend/vue-uni-comp/index.md'
        },
        {
          text: '自动化测试',
          link: '/zh/coding/frontend/vue-uni-comp/test.md'
        },
        {
          text: '数据分析',
          link: '/zh/coding/frontend/data-analytics/index.md'
        },
        {
          text: 'Web 性能优化',
          link: '/zh/coding/frontend/performance/index.md',
          items: [
            {
              text: '核心 Web 指标',
              link: '/zh/coding/frontend/performance/core-web-vitals/index.md'
            },
            {
              text: '性能规范',
              link: '/zh/coding/frontend/performance/specifications/index.md'
            }
          ]
        },
        {
          text: '竞态条件',
          link: '/zh/coding/frontend/race-condition/index.md'
        },
        {
          text: 'Text-align:justify 的问题！',
          link: '/zh/coding/frontend/text-align-justify/index.md'
        },
        {
          text: '迭代器与生成器',
          link: '/zh/coding/frontend/iterator/index.md'
        }
      ]
    },
    {
      text: 'Python',
      collapsed: true,
      items: [
        {
          text: 'Python 速成课程',
          link: '/zh/coding/python/markdowns/pythonCrashCourse/index.md',
          items: [
            {
              text: '数据可视化',
              link: '/zh/coding/python/markdowns/pythonCrashCourse/data-visualizing.md'
            },
            {
              text: '构建 Web 应用',
              link: '/zh/coding/python/pythonCrashCourse/web-app.md'
            }
          ]
        }
      ]
    },
    {
      text: '其他',
      collapsed: true,
      items: [
        {
          text: '键盘快捷键',
          link: '/zh/coding/others/shortcuts/index.md'
        }
      ]
    }
  ];
}
