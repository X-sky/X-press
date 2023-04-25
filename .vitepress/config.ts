import path from 'path';
import { defineConfig } from 'vitepress';
import type { DefaultTheme } from 'vitepress';

export default defineConfig({
  title: 'X-press',
  description: 'X-press - A VitePress Site With Mass Messy',
  srcDir: 'src',
  vite: {
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, '../src'),
        '@theme/*': path.resolve(__dirname, './theme')
      }
    }
  },
  themeConfig: {
    outline: {
      label: '----目录----'
    },
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
        }
      ]
    }
  ];
}

function getCodeSidebarList(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '前端相关',
      collapsed: false,
      items: [
        {
          text: 'text-align实现两端对齐',
          link: '/coding/frontend/text-align_justify/text-align_justify'
        },
        { text: '竞态问题', link: '/coding/frontend/race-condition' }
      ]
    }
  ];
}
