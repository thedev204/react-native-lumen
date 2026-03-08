// --- Mock Data ---
export const RECENT_ACTIVITY = [
  {
    id: '1',
    title: 'Design System Update',
    time: '2h ago',
    color: '#FF6B6B',
    icon: '🎨',
  },
  {
    id: '2',
    title: 'New Feature Launch',
    time: '4h ago',
    color: '#4ECDC4',
    icon: '🚀',
  },
];

export const FEED_POSTS = [
  {
    id: '1',
    author: 'Sarah Jenkins',
    role: 'Product Designer',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    content:
      'Just published the new design system guidelines! Check them out and let me know what you think. 🎨✨',
    likes: 24,
    comments: 5,
    time: '2 hours ago',
  },
  {
    id: '2',
    author: 'Alex Chen',
    role: 'Frontend Engineer',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    content:
      'Finally merged the performance improvements PR. The app should feel much snappier now! 🚀',
    likes: 42,
    comments: 12,
    time: '4 hours ago',
  },
  {
    id: '3',
    author: 'Maria López',
    role: 'Backend Engineer',
    avatar: 'https://i.pravatar.cc/150?u=maria',
    content:
      'Deployed the new caching layer — p99 latency dropped by 40%. Huge win for the team! ⚡️',
    likes: 61,
    comments: 8,
    time: '6 hours ago',
  },
];

export const STATS = [
  { label: 'Posts', value: '128', delta: '+12%', positive: true },
  { label: 'Reach', value: '14.2k', delta: '+8%', positive: true },
  { label: 'Saves', value: '340', delta: '-3%', positive: false },
  { label: 'Followers', value: '2.1k', delta: '+22%', positive: true },
];

export const TRENDING = [
  { tag: '#ReactNative', posts: '4.2k posts', color: '#6C5CE7' },
  { tag: '#OpenSource', posts: '2.8k posts', color: '#00B894' },
  { tag: '#TypeScript', posts: '6.1k posts', color: '#0984E3' },
  { tag: '#UIDesign', posts: '3.5k posts', color: '#E17055' },
];
