import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { TourZone, useTour, useTourScrollView } from 'react-native-lumen';
import {
  Bell,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
} from 'lucide-react-native';
import { tourSteps } from './data/tourSteps';
import Animated from 'react-native-reanimated';

// --- Mock Data ---
const RECENT_ACTIVITY = [
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

const FEED_POSTS = [
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
];

// --- Main Screen ---
export const Home = () => {
  const { scrollViewProps } = useTourScrollView();

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        {...scrollViewProps}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <WelcomeBanner />
        <ActivityList />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Feed</Text>
          <View style={styles.postContainer}>
            <TourZone
              key={0}
              stepKey={tourSteps.post.key}
              name={tourSteps.post.name}
              order={tourSteps.post.order}
              description={tourSteps.post.description}
              borderRadius={16}
            >
              <FeedPost post={FEED_POSTS[0]!} />
            </TourZone>
            <FeedPost post={FEED_POSTS[1]!} />
          </View>
        </View>

        {/* Bottom padding for FAB */}
        <View style={{ height: 80 }} />
      </Animated.ScrollView>

      {/* Target 4: Floating Action Button */}
      <View style={styles.fabContainer}>
        <TourZone
          stepKey={tourSteps.fab.key}
          name={tourSteps.fab.name}
          order={tourSteps.fab.order}
          description={tourSteps.fab.description}
          shape="circle"
        >
          <Pressable
            style={styles.fab}
            onPress={() => console.log('FAB Pressed')}
          >
            <Plus color="white" size={24} />
          </Pressable>
        </TourZone>
      </View>
    </View>
  );
};

// --- Components ---
const Header = () => {
  const { start } = useTour();
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerGreeting}>Good morning,</Text>
        <Text style={styles.headerTitle}>Alex 👋</Text>
      </View>

      {/* Target 1: Header Icon */}
      <TourZone
        stepKey={tourSteps.headerIcon.key}
        name={tourSteps.headerIcon.name}
        order={tourSteps.headerIcon.order}
        description={tourSteps.headerIcon.description}
        shape="circle"
      >
        <Pressable
          style={styles.iconButton}
          onPress={() => start(tourSteps.headerIcon.key)}
        >
          <Bell color="#2D3436" size={24} />
          <View style={styles.notificationBadge} />
        </Pressable>
      </TourZone>
    </View>
  );
};

const WelcomeBanner = () => {
  const { start } = useTour();
  return (
    /* Target 2: Welcome Banner */
    <TourZone
      stepKey={tourSteps.welcomeBanner.key}
      name={tourSteps.welcomeBanner.name}
      order={tourSteps.welcomeBanner.order}
      description={tourSteps.welcomeBanner.description}
      borderRadius={16}
      style={styles.bannerContainer}
    >
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Ready to explore?</Text>
          <Text style={styles.bannerText}>
            Take a quick tour to discover all the new features we've added to
            your dashboard.
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => start(tourSteps.headerIcon.key)}
          >
            <Text style={styles.primaryButtonText}>Start Tour</Text>
          </Pressable>
        </View>
      </View>
    </TourZone>
  );
};

const ActivityList = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityContainer}>
        {RECENT_ACTIVITY.map((item, index) => {
          const cardContent = (
            <View
              style={[
                styles.activityCard,
                { borderTopColor: item.color, borderTopWidth: 4 },
              ]}
            >
              <Text style={styles.activityIcon}>{item.icon}</Text>
              <Text style={styles.activityCardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          );

          // Target 3: Wrap the first item in the list
          if (index === 0) {
            return (
              <TourZone
                key={item.id}
                stepKey={tourSteps.designSystem.key}
                name={tourSteps.designSystem.name}
                order={tourSteps.designSystem.order}
                description={tourSteps.designSystem.description}
                borderRadius={12}
              >
                {cardContent}
              </TourZone>
            );
          }

          // Target 4: Wrap the second item in the list
          if (index === 1) {
            return (
              <TourZone
                key={item.id}
                stepKey={tourSteps.newFeature.key}
                name={tourSteps.newFeature.name}
                order={tourSteps.newFeature.order}
                description={tourSteps.newFeature.description}
                borderRadius={12}
              >
                {cardContent}
              </TourZone>
            );
          }

          return <React.Fragment key={item.id}>{cardContent}</React.Fragment>;
        })}
      </View>
    </View>
  );
};

const FeedPost = ({ post }: { post: (typeof FEED_POSTS)[0] }) => (
  <View style={styles.postCard}>
    <View style={styles.postHeader}>
      <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
      <View style={styles.postAuthorInfo}>
        <Text style={styles.postAuthorName}>{post.author}</Text>
        <Text style={styles.postAuthorRole}>
          {post.role} {post.time}
        </Text>
      </View>
      <Pressable style={styles.moreButton}>
        <MoreHorizontal color="#636E72" size={20} />
      </Pressable>
    </View>
    <Text style={styles.postContent}>{post.content}</Text>
    <View style={styles.postActions}>
      <Pressable style={styles.actionButton}>
        <Heart color="#636E72" size={20} />
        <Text style={styles.actionText}>{post.likes}</Text>
      </Pressable>
      <Pressable style={styles.actionButton}>
        <MessageCircle color="#636E72" size={20} />
        <Text style={styles.actionText}>{post.comments}</Text>
      </Pressable>
      <Pressable style={styles.actionButton}>
        <Share2 color="#636E72" size={20} />
      </Pressable>
    </View>
  </View>
);

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerGreeting: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 0,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  bannerContainer: { marginBottom: 32 },
  banner: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 0,
  },
  bannerContent: {
    alignItems: 'flex-start',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#6C5CE7',
    fontSize: 15,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
  },
  activityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  activityCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 0,
  },
  activityIcon: {
    fontSize: 24,
    marginBottom: 12,
  },
  activityCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: '#636E72',
  },
  postContainer: {
    gap: 22,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 0,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  postAuthorRole: {
    fontSize: 13,
    color: '#636E72',
  },
  moreButton: {
    padding: 4,
  },
  postContent: {
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F2F6',
    paddingTop: 12,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 0,
  },
});
