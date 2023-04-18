import { defineConfig } from 'vitepress';
import type { DefaultTheme } from 'vitepress';

export default defineConfig({
  title: 'X-press',
  description: 'X-press - A VitePress Site With Mass Messy',
  srcDir: 'src',
  themeConfig: {
    nav: getNavList(),

    sidebar: [
      {
        text: '前端',
        items: [{ text: '竞态问题', link: '/frontend/race-condition' }]
      }
    ],
    editLink: {
      pattern: 'https://github.com/X-sky/X-press.git/src/:path',
      text: 'Edit this page on GitHub'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/X-sky/X-press.git' }
    ]
  }
});

function getNavList(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    {
      text: 'Docs',
      items: [
        {
          text: '前端',
          link: '/frontend/race-condition'
        }
      ]
    }
  ];
}
