export interface ILineTextPart {
  text: string;
  /** emphasis color type */
  emColorType?: string;
}
export interface ITimelineCardInfo {
  date: string;
  title: string;
  desc: string;
  link: string;
}

// fixed config

export const ARTICLE_GROUPS: {
  titleLines: ILineTextPart[][];
  list: ITimelineCardInfo[];
}[] = [
  {
    titleLines: [
      [{ text: 'Issues can' }],
      [
        { text: '&nbsp;be&nbsp;&nbsp;' },
        { text: 'weapons', emColorType: 'red' }
      ]
    ],
    list: [
      {
        date: 'Jan 10, 2024',
        title: 'HostsWith: \n A Simple Chrome Extension',
        desc: 'An incomplete guide to browser extension development',
        link: 'X-press/coding/frontend/auto-hosts/auto-hosts.html'
      },
      {
        date: 'June 26, 2024',
        title: 'Vue Uni Component: \n A ui lib for vue 2 & 3',
        desc: 'Cross versions, improve efficiency and reduce duplication',
        link: 'X-press/coding/frontend/vue-uni-comp/'
      },
      {
        date: 'June 26, 2024',
        title: 'Race Condition: \n under frontend field',
        desc: 'Quick through the multi-threading issue in the single-thread world',
        link: 'X-press/coding/frontend/race-condition'
      }
    ]
  },
  {
    titleLines: [
      [{ text: 'Load', emColorType: 'green' }],
      [{ text: '&nbsp;silver&nbsp;&nbsp;' }, { text: 'bullets' }]
    ],
    list: [
      {
        date: 'July 13, 2024',
        title: 'Deep Dive Into \n Web Performance',
        desc: 'Understanding the core web vitals and specifications',
        link: 'X-press/coding/frontend/performance/'
      },
      {
        date: 'Jun 26, 2024',
        title: 'Python Crash Course \n  Eric Matthes',
        desc: 'notes of the world’s best-selling guide to the Python programming language',
        link: 'X-press/coding/python/pythonCrashCourse/web-app'
      }
    ]
  }
];
