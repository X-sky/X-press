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
      pattern: 'https://github.com/X-sky/X-press/blob/main/src/:path',
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
          text: 'Something wrong with Text-align:justify!',
          link: '/coding/frontend/text-align_justify/text-align_justify'
        },
        { text: 'Race condition', link: '/coding/frontend/race-condition' },
        {
          text: 'Iterator & Generator',
          link: '/coding/frontend/iterator/iterator'
        }
      ]
    },
    {
      text: 'Python',
      collapsed: true,
      items: [
        {
          text: 'Python Crash Course',
          link: '/coding/python/markdowns/pythonCrashCourse/index',
          items: [
            {
              text: 'Web App based on Django',
              link: '/coding/python/markdowns/pythonCrashCourse/web-app'
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
          link: '/coding/others/shortcuts/shortcuts'
        }
      ]
    }
  ];
}
