import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'API Reference',
      link: {
        type: 'generated-index',
        description:
          'Complete API reference for React Native Lumen components, hooks, and types.',
      },
      items: [
        'api/tour-provider',
        'api/tour-zone',
        'api/use-tour',
        'api/types',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      link: {
        type: 'generated-index',
        description:
          'In-depth guides for advanced features in React Native Lumen.',
      },
      items: [
        'guides/step-enforcement',
        'guides/multi-screen-tours',
        'guides/customization',
        'guides/persistence',
      ],
    },
  ],
};

export default sidebars;
