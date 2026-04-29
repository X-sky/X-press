export default {
    hero: {
        welcome: '欢迎来到',
        tagline: '一个热情与技术交汇的舞台。',
        contactMe: '联系我',
    },
    nav: {
        about: '关于',
        blog: '博客',
        projects: '项目',
        contact: '联系',
        coding: '编程',
        home: '首页',
        frontend: '前端',
        python: 'Python',
        others: '其他',
        lightMode: '浅色模式',
        darkMode: '深色模式',
    },
    about: {
        title: '求知若饥，虚心若愚。',
        heading: '关于我',
        bio: [
            '拥有超过6年经验的前端开发者',
            '精通各种前端框架，尤其是 Vue 及其生态系统。',
            '擅长工具链和基础设施建设，对编码和架构有独到见解',
            '一个严谨的学者，也是生活中乐观开朗的人',
        ],
        education: {
            degree: '本科学历，CET-6',
            school:
                '毕业于浙江理工大学。目前在同济大学攻读研究生，专业为人工智能',
        },
        counters: {
            experiences: '年经验',
            completedProjects: '已完成项目',
            contributions: '开源贡献',
        },
    },
    blog: {
        title: '博客',
        description: '我通过撰写博客文章来记录我的项目和经验。',
        checkOut: '查看我最新的一些文章吧。🚀',
        readMore: '阅读更多',
    },
    projects: {
        title: '精选项目',
        quote: '开源不是关于社区，而是关于态度。',
        exploreMore: '在以下链接探索更多项目',
        githubProfile: '我的 GitHub 主页',
    },
    contact: {
        wantToCollaborate: '想要合作？',
        contactMe: '联系我！',
        description:
            '我一直很期待与志同道合的专业人士和潜在合作者建立联系。无论你有项目想法、需要帮助，还是只是想打个招呼，都欢迎随时联系我！',
        endTitle: '让我们一起让世界变得更好！',
    },
    social: {
        contactMe: '联系我',
        viewProject: '查看项目',
    },
    projectData: {
        1: {
            title: 'HostsExtension',
            description: '享受 ✨HostsWitch✨ 带来的极速 Host 切换体验！',
        },
        2: {
            title: 'Vue uni ui',
            description: '一个同时支持 Vue 2 和 Vue 3 的通用组件库！',
        },
        3: {
            title: 'X-press',
            description: '精心打造的作品展示，汇聚所有技术沉淀的入口',
        },
    },
    blogFallback: {
        posts: [
            {
                title: 'Web 性能优化的方方面面',
                description: 'Web 性能是 Web 开发中至关重要的一环……',
            },
            {
                title: '前端数据分析实践',
                description: '数据分析是决策过程中不可或缺的环节……',
            },
            {
                title: '为什么我们需要自动化测试',
                description: '自动化测试是项目中必不可少的一环……',
            },
            {
                title: 'Chrome 扩展开发教程',
                description:
                    '开发 Chrome 扩展不仅能提升开发技能……',
            },
        ],
    },
    languageSwitcher: {
        en: 'EN',
        zh: '中文',
    },
} as const
