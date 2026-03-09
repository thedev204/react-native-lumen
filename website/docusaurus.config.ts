import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'React Native Lumen',
  tagline:
    'A high-performance, fully customizable app tour library for React Native.',
  favicon: 'img/favicon.ico',
  future: {
    v4: true,
  },
  url: 'https://thedev204.github.io',
  baseUrl: '/react-native-lumen/',
  organizationName: 'thedev204',
  projectName: 'react-native-lumen',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/thedev204/react-native-lumen/tree/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'React Native Lumen',
      logo: {
        alt: 'React Native Lumen Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/thedev204/react-native-lumen',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'API Reference',
              to: '/docs/category/api-reference',
            },
            {
              label: 'Guides',
              to: '/docs/category/guides',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/react-native-lumen',
            },
            {
              label: 'Issues',
              href: 'https://github.com/thedev204/react-native-lumen/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/thedev204/react-native-lumen',
            },
            {
              label: 'Changelog',
              href: 'https://github.com/thedev204/react-native-lumen/blob/main/CHANGELOG.md',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} React Native Lumen. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
