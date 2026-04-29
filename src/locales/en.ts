export default {
    hero: {
        welcome: 'Welcome to',
        tagline: 'A stage where enthusiasm meets technology.',
        contactMe: 'Contact Me',
    },
    nav: {
        about: 'About',
        blog: 'Blog',
        projects: 'Projects',
        contact: 'Contact',
        coding: 'Coding',
        home: 'Home',
        frontend: 'Frontend',
        python: 'Python',
        others: 'Others',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
    },
    about: {
        title: "Keep Looking. Don't settle.",
        heading: 'About me',
        bio: [
            'A frontend developer with over 6 years of experience',
            'Mastering various frontend frameworks, especially Vue and its ecosystem.',
            'Proficient in toolchains and infrastructure with unique insights into coding and architecture',
            'A meticulous scholar and a cheerful optimist in life',
        ],
        education: {
            degree: "Bachelor's degree, CET-6",
            school:
                'Graduated from Zhejiang Sci-Tech University. Currently under postgraduate at Tongji University, majoring in Artificial Intelligence',
        },
        counters: {
            experiences: 'Experiences',
            completedProjects: 'Completed Projects',
            contributions: 'Contributions',
        },
    },
    blog: {
        title: 'Blog',
        description:
            'I document my journey by writing blog posts about my projects and experiences.',
        checkOut: 'Check out some of my latest entries below. 🚀',
        readMore: 'Read more',
    },
    projects: {
        title: 'Featured Projects',
        quote: "OpenSource is not about community, it's about attitude.",
        exploreMore: 'Explore more projects in',
        githubProfile: 'my github profile',
    },
    contact: {
        wantToCollaborate: 'Want to collaborate?',
        contactMe: 'Contact me!',
        description:
            "I'm always excited to connect with like-minded professionals and potential collaborators. Whether you have a project in mind, need assistance, or just want to say hello, feel free to reach out!",
        endTitle: "Let's make the world better together!",
    },
    social: {
        contactMe: 'Contact me',
        viewProject: 'View Project',
    },
    projectData: {
        1: {
            title: 'HostsExtension',
            description:
                'Enjoy the very fast and instant host-switching experience with ✨HostsWitch✨ !',
        },
        2: {
            title: 'Vue uni ui',
            description: 'A Universal component lib for Vue 2 & 3!',
        },
        3: {
            title: 'X-press',
            description:
                'A refined and enhanced showcase of my work, an entry to all of my technique precipitation',
        },
    },
    blogFallback: {
        posts: [
            {
                title: 'Aspects of web performance',
                description:
                    'Web performance is a crucial aspect of web development...',
            },
            {
                title: 'Practice data analytics in frontend',
                description:
                    'Data analytics is a vital procedure for decision-making...',
            },
            {
                title: 'Why do we need auto-testing',
                description: 'Test automation is a must-have for a project...',
            },
            {
                title: 'A tutorial for Chrome extension development',
                description:
                    'Developing a Chrome extension is not only necessary for upgrading developing skills...',
            },
        ],
    },
    languageSwitcher: {
        en: 'EN',
        zh: '中文',
    },
} as const
