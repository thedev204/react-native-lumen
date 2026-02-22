// Example tour step configurations demonstrating various zone styles
export const tourSteps = {
  headerIcon: {
    key: 'header-icon',
    order: 1,
    name: 'Notifications',
    description: 'Check your latest updates and alerts here.',
  },
  welcomeBanner: {
    key: 'welcome-banner',
    order: 2,
    name: 'Welcome',
    description: 'Your daily summary and quick actions are available here.',
  },
  designSystem: {
    key: 'design-system',
    order: 3,
    name: 'Design System',
    description: 'Explore the design system components and guidelines.',
  },
  newFeature: {
    key: 'new-feature',
    order: 4,
    name: 'New Feature Launch',
    description: 'Check out other newest features in the app.',
  },
  post: {
    key: 'post',
    order: 5,
    name: 'Post',
    description: 'This is the first post in the feed.',
  },
  fab: {
    key: 'fab',
    order: 6,
    name: 'Create New',
    description: 'Tap here to create a new post or transaction.',
    zoneStyle: {
      shape: 'circle' as const,
      borderColor: '#6C5CE7',
    },
  },
} as const;
