/**
 * @description if file extension was not 'mts', vitepress will treat .ts file as commonjs module if no project-level "type: modules" specified, while vite deprecating cjs syntax. To avoid this problem, just change the ext to mts to tell vitepress that this file should be treated as an ESmodule.
 */

import path from 'path';
import { defineConfig } from 'vitepress';
import type { DefaultTheme } from 'vitepress';
import UnoCSS from 'unocss/vite';
import { pythonWatcherPlugin } from './plugins';

const BASE_DIR = '/X-press';
export default defineConfig({
  title: 'X-press',
  description: 'X-press - A VitePress Site With Mass Messy',
  srcDir: 'src',
  base: `${BASE_DIR}/`,
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
    }
  },
  ignoreDeadLinks: [/'coding\/python\/markdowns'/],
  head: [['link', { rel: 'icon', href: `${BASE_DIR}/logo.svg` }]],
  themeConfig: {
    outline: {
      label: '----In this page----'
    },
    logo: '/logo.svg',
    nav: getNavList(),
    sidebar: {
      '/coding/': getCodeSidebarList()
    },
    editLink: {
      pattern: ({ frontmatter, relativePath }) => {
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
      },
      text: 'Edit this page on GitHub'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/X-sky/X-press.git' }
    ]
  }
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
            '/coding/frontend/race-condition'
        },
        {
          text: 'Python',
          link:
            (getCodeSidebarList()[1].items || [])[0].link ||
            '/coding/python/markdowns/pythonCrashCourse/index'
        },
        {
          text: 'Others',
          link:
            (getCodeSidebarList()[2].items || [])[0].link ||
            '/coding/others/shortcuts/shortcuts'
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
          link: '/coding/frontend/auto-hosts/auto-hosts.md'
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
          text: 'Web Browsers',
          link: '/coding/frontend/browser/index.md'
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
          text: 'Something wrong with Text-align:justify!',
          link: '/coding/frontend/text-align_justify/text-align_justify.md'
        },
        { text: 'Race condition', link: '/coding/frontend/race-condition.md' },
        {
          text: 'Iterator & Generator',
          link: '/coding/frontend/iterator/iterator.md'
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
          link: '/coding/others/shortcuts/shortcuts.md'
        }
      ]
    }
  ];
}
