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
  TrendingUp,
  Bookmark,
  Star,
  Zap,
} from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { tourSteps } from './data/tourSteps';
import { FEED_POSTS, RECENT_ACTIVITY, STATS, TRENDING } from './data/mockData';

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

        <FeedsCard />

        <StatsCard />

        <TrendingCard />

        <QuickActionsCard />

        <PremiumBanner />

        {/* Bottom padding for FAB */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Floating Action Button */}
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

// --- Sub-components ---
const Header = () => {
  const { start } = useTour();
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerGreeting}>Good morning,</Text>
        <Text style={styles.headerTitle}>Alex 👋</Text>
      </View>

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
          {post.role} · {post.time}
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

const FeedsCard = () => {
  return (
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
        <FeedPost post={FEED_POSTS[2]!} />
      </View>
    </View>
  );
};

const StatsCard = () => {
  return (
    <>
      <Text style={styles.sectionTitle}>Your Stats This Week</Text>
      <TourZone
        stepKey={tourSteps.statsCard.key}
        name={tourSteps.statsCard.name}
        order={tourSteps.statsCard.order}
        description={tourSteps.statsCard.description}
        borderRadius={16}
        style={styles.section}
      >
        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text
                style={[
                  styles.statDelta,
                  { color: s.positive ? '#00B894' : '#D63031' },
                ]}
              >
                {s.delta}
              </Text>
            </View>
          ))}
        </View>
      </TourZone>
    </>
  );
};

const QuickActionsCard = () => {
  return (
    <>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <TourZone
        stepKey={tourSteps.quickActions.key}
        name={tourSteps.quickActions.name}
        order={tourSteps.quickActions.order}
        description={tourSteps.quickActions.description}
        borderRadius={16}
        style={styles.section}
      >
        <View style={styles.quickRow}>
          {[
            { icon: <Bookmark color="#6C5CE7" size={22} />, label: 'Saved' },
            { icon: <Heart color="#E17055" size={22} />, label: 'Liked' },
            { icon: <Star color="#FDCB6E" size={22} />, label: 'Starred' },
            { icon: <Share2 color="#00B894" size={22} />, label: 'Shared' },
          ].map(({ icon, label }) => (
            <Pressable key={label} style={styles.quickBtn}>
              {icon}
              <Text style={styles.quickLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </TourZone>
    </>
  );
};

const TrendingCard = () => {
  return (
    <>
      <Text style={styles.sectionTitle}>Trending Now</Text>
      <TourZone
        stepKey={tourSteps.trendsCard.key}
        name={tourSteps.trendsCard.name}
        order={tourSteps.trendsCard.order}
        description={tourSteps.trendsCard.description}
        borderRadius={16}
        style={styles.section}
      >
        <View style={styles.trendList}>
          {TRENDING.map((t) => (
            <View key={t.tag} style={styles.trendRow}>
              <View style={[styles.trendDot, { backgroundColor: t.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.trendTag}>{t.tag}</Text>
                <Text style={styles.trendPosts}>{t.posts}</Text>
              </View>
              <TrendingUp color={t.color} size={18} />
            </View>
          ))}
        </View>
      </TourZone>
    </>
  );
};

const PremiumBanner = () => {
  return (
    <>
      <TourZone
        stepKey={tourSteps.bottomBanner.key}
        name={tourSteps.bottomBanner.name}
        order={tourSteps.bottomBanner.order}
        description={tourSteps.bottomBanner.description}
        borderRadius={20}
        style={styles.section}
      >
        <View style={styles.upgradeBanner}>
          <Zap color="#FDCB6E" size={32} style={{ marginBottom: 12 }} />
          <Text style={styles.upgradeTitle}>Unlock Premium</Text>
          <Text style={styles.upgradeText}>
            Get advanced analytics, unlimited posts, and exclusive features with
            a Pro account.
          </Text>
          <Pressable style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Upgrade Now →</Text>
          </Pressable>
        </View>
      </TourZone>
    </>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { padding: 20 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerGreeting: { fontSize: 14, color: '#636E72', marginBottom: 4 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2D3436' },
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
    elevation: 2,
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

  // Banner
  bannerContainer: { marginBottom: 32 },
  banner: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  bannerContent: { alignItems: 'flex-start' },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: { color: '#6C5CE7', fontSize: 15, fontWeight: 'bold' },

  // Sections
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
  },

  // Activity
  activityContainer: { flexDirection: 'row', gap: 12 },
  activityCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  activityIcon: { fontSize: 24, marginBottom: 12 },
  activityCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
    lineHeight: 20,
  },
  activityTime: { fontSize: 12, color: '#636E72' },

  // Feed
  postContainer: { gap: 22 },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  postAuthorInfo: { flex: 1 },
  postAuthorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  postAuthorRole: { fontSize: 13, color: '#636E72' },
  moreButton: { padding: 4 },
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
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 14, color: '#636E72', fontWeight: '500' },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  statCard: {
    width: '46%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#2D3436' },
  statLabel: { fontSize: 12, color: '#636E72', marginTop: 2 },
  statDelta: { fontSize: 12, fontWeight: '600', marginTop: 4 },

  // Trends
  trendList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trendDot: { width: 10, height: 10, borderRadius: 5 },
  trendTag: { fontSize: 15, fontWeight: '600', color: '#2D3436' },
  trendPosts: { fontSize: 12, color: '#636E72', marginTop: 2 },

  // Quick actions
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  quickBtn: {
    alignItems: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    flex: 1,
    marginHorizontal: 4,
  },
  quickLabel: { fontSize: 11, color: '#636E72', fontWeight: '500' },

  // Upgrade banner
  upgradeBanner: {
    backgroundColor: '#2D3436',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  upgradeBtn: {
    backgroundColor: '#FDCB6E',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  upgradeBtnText: { color: '#2D3436', fontWeight: 'bold', fontSize: 15 },

  // FAB
  fabContainer: { position: 'absolute', bottom: 24, right: 24 },
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
    elevation: 6,
  },
});
