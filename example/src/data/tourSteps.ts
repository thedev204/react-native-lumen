export const tourSteps = {
  welcome: {
    key: 'welcome',
    order: 1,
    name: 'Welcome to Lumen',
    description:
      'This is a high-performance app tour library for React Native.',
  },
  profile: {
    key: 'profile',
    order: 2,
    name: 'User Profile',
    description: 'Manage your account settings and personal information here.',
  },
  bioInput: {
    key: 'bio-input',
    order: 2.5,
    name: 'Bio Input',
    description:
      'Edit your bio to tell others about yourself. This is an interactive input field!',
  },
  pollSection: {
    key: 'poll-section',
    order: 2.6,
    name: 'Poll Section',
    description:
      'Participate in polls and see what others think. Interactive poll example!',
  },
  promptSection: {
    key: 'prompt-section',
    order: 2.7,
    name: 'Daily Prompt',
    description:
      'Answer daily prompts to engage with the community. Interactive prompt example!',
  },
  stats: {
    key: 'stats',
    order: 3,
    name: 'View Statistics',
    description: 'Check your daily progress and analytics in real-time.',
  },
  action: {
    key: 'action',
    order: 4,
    name: 'Quick Action',
    description:
      'Perform quick tasks like adding a new item or maximizing productivity.',
  },
  users: {
    key: 'users',
    order: 5,
    name: 'Team Members',
    description: 'See who is online (Circular shapes example).',
  },
  tags: {
    key: 'tags',
    order: 6,
    name: 'Categories',
    description: 'Filter content by category (Pill shapes example).',
  },
  wallet: {
    key: 'wallet',
    order: 7,
    name: 'Wallet',
    description: 'Manage your wallet and transactions here.',
  },
  products: {
    key: 'products',
    order: 8,
    name: 'Products',
    description: 'Manage your products and inventory here.',
  },
  // Advanced tour examples
  settings: {
    key: 'settings',
    order: 9,
    name: 'Settings',
    description:
      'Configure your app preferences and customize your experience.',
  },
  notifications: {
    key: 'notifications',
    order: 10,
    name: 'Notifications',
    description: 'Stay updated with real-time notifications and alerts.',
  },
  search: {
    key: 'search',
    order: 11,
    name: 'Search',
    description: 'Find anything quickly with our powerful search feature.',
  },
  help: {
    key: 'help',
    order: 12,
    name: 'Help & Support',
    description:
      'Get help when you need it with our comprehensive support center.',
  },
} as const;
