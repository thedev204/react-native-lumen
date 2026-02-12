import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { TourZone, useTour, useTourScrollView } from 'react-native-lumen';
import {
  User,
  BarChart2,
  Plus,
  Info,
  Users,
  Tag,
  MessageSquare,
  BarChart3,
  Edit3,
} from 'lucide-react-native';
import { tourSteps } from './data/tourSteps';
import Animated from 'react-native-reanimated';
import { useState } from 'react';

const Card = ({
  title,
  icon: Icon,
  color,
}: {
  title: string;
  icon: any;
  color: string;
}) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <Icon color="white" size={32} />
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

export const Home = () => {
  const { start, hasSavedProgress, clearProgress } = useTour();
  // Use the new useTourScrollView hook for cleaner scroll view integration
  const { scrollViewProps } = useTourScrollView();
  const [bio, setBio] = useState(
    'Passionate developer with 5+ years of experience in React Native and mobile app development. Love creating intuitive user experiences!'
  );

  return (
    <Animated.ScrollView
      {...scrollViewProps}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TourZone
            stepKey={tourSteps.welcome.key}
            name={tourSteps.welcome.name}
            order={tourSteps.welcome.order}
            description={tourSteps.welcome.description}
            borderRadius={12}
          >
            <View style={styles.welcomeBanner}>
              <Text style={styles.welcomeText}>Hello, User! 👋</Text>
              <Text style={styles.subtitle}>
                Welcome to the enhanced Lumen tour example.
              </Text>
            </View>
          </TourZone>
        </View>

        {/* Enhanced Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>

          {/* Profile Header - demonstrating per-zone spotlight props */}
          <TourZone
            stepKey={tourSteps.profile.key}
            name={tourSteps.profile.name}
            order={tourSteps.profile.order}
            description={tourSteps.profile.description}
            borderRadius={16}
            style={styles.profileCard}
            // Per-zone spotlight customization
            spotlightGlowColor="#6C5CE7"
            spotlightBorderColor="#6C5CE7"
            spotlightPadding={12}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarLarge}>
                <User color="white" size={40} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>John Doe</Text>
                <Text style={styles.profileRole}>Senior Developer</Text>
              </View>
              <Pressable style={styles.editButton}>
                <Edit3 color="#6C5CE7" size={20} />
              </Pressable>
            </View>
          </TourZone>

          {/* Bio Section with Input */}
          <TourZone
            stepKey={tourSteps.bioInput.key}
            name={tourSteps.bioInput.name}
            order={tourSteps.bioInput.order}
            description={tourSteps.bioInput.description}
            borderRadius={12}
            style={styles.bioCard}
          >
            <Text style={styles.bioLabel}>Bio</Text>
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={4}
            />
            <Text style={styles.charCount}>{bio.length}/200 characters</Text>
          </TourZone>

          {/* Poll Section */}
          <TourZone
            stepKey={tourSteps.pollSection.key}
            name={tourSteps.pollSection.name}
            order={tourSteps.pollSection.order}
            description={tourSteps.pollSection.description}
            borderRadius={16}
            style={styles.pollCard}
          >
            <View style={styles.pollHeader}>
              <MessageSquare color="#6C5CE7" size={20} />
              <Text style={styles.pollTitle}>Quick Poll</Text>
            </View>
            <Text style={styles.pollQuestion}>
              What's your favorite React Native feature?
            </Text>
            <View style={styles.pollOptions}>
              {['Performance', 'Animations', 'Community', 'Hot Reload'].map(
                (option, index) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.pollOption,
                      index === 0 && styles.pollOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pollOptionText,
                        index === 0 && styles.pollOptionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
            <Text style={styles.pollVotes}>245 votes • 2 days left</Text>
          </TourZone>

          {/* Prompt Section */}
          <TourZone
            stepKey={tourSteps.promptSection.key}
            name={tourSteps.promptSection.name}
            order={tourSteps.promptSection.order}
            description={tourSteps.promptSection.description}
            borderRadius={16}
            style={styles.promptCard}
          >
            <View style={styles.promptHeader}>
              <BarChart3 color="#FF6B6B" size={20} />
              <Text style={styles.promptTitle}>Daily Prompt</Text>
            </View>
            <Text style={styles.promptQuestion}>
              What's the best piece of advice you've received in your career?
            </Text>
            <Pressable style={styles.promptButton}>
              <Text style={styles.promptButtonText}>Share Your Thoughts</Text>
            </Pressable>
          </TourZone>
        </View>

        <View style={styles.grid}>
          <TourZone
            stepKey={tourSteps.stats.key}
            name={tourSteps.stats.name}
            order={tourSteps.stats.order}
            description={tourSteps.stats.description}
            borderRadius={16}
            style={styles.container}
          >
            <Card title="Stats" icon={BarChart2} color="#4ECDC4" />
          </TourZone>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {/* Circle spotlight shape for FAB */}
        <TourZone
          stepKey={tourSteps.action.key}
          name={tourSteps.action.name}
          order={tourSteps.action.order}
          description={tourSteps.action.description}
          borderRadius={30}
          spotlightShape="circle"
          spotlightGlowColor="#6C5CE7"
          spotlightGlowOpacity={0.6}
          spotlightGlowRadius={16}
        >
          <Pressable style={styles.fab} onPress={() => console.log('Action')}>
            <Plus color="white" size={28} />
          </Pressable>
        </TourZone>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Members</Text>
        {/* Pill spotlight shape for avatar row */}
        <TourZone
          stepKey={tourSteps.users.key}
          name={tourSteps.users.name}
          order={tourSteps.users.order}
          description={tourSteps.users.description}
          spotlightShape="pill"
          borderRadius={24}
          spotlightPadding={8}
        >
          <View style={styles.avatarRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <View
                key={i}
                style={[
                  styles.avatar,
                  {
                    backgroundColor: `rgba(108, 92, 231, ${0.4 + i * 0.15})`,
                    marginLeft: i === 1 ? 0 : -10,
                  },
                ]}
              >
                <Users color="white" size={20} />
              </View>
            ))}
          </View>
        </TourZone>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        {/* Pill shape with blue accent */}
        <TourZone
          stepKey={tourSteps.tags.key}
          name={tourSteps.tags.name}
          order={tourSteps.tags.order}
          description={tourSteps.tags.description}
          borderRadius={20}
          spotlightShape="pill"
          spotlightBorderColor="#0984e3"
          spotlightGlowColor="#0984e3"
        >
          <View style={styles.tagContainer}>
            {['Design', 'Product', 'Marketing'].map((tag, i) => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  { backgroundColor: i % 2 === 0 ? '#0984e3' : '#00b894' },
                ]}
              >
                <Tag color="white" size={14} />
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </TourZone>
      </View>

      <View style={styles.grid}>
        <TourZone
          stepKey={tourSteps.wallet.key}
          description={tourSteps.wallet.description}
          order={tourSteps.wallet.order}
          borderRadius={16}
          style={styles.container}
        >
          <Card title="Wallet" icon={User} color="#6b95ff" />
        </TourZone>

        <TourZone
          stepKey={tourSteps.products.key}
          description={tourSteps.products.description}
          order={tourSteps.products.order}
          borderRadius={16}
          style={styles.container}
        >
          <Card title="Products" icon={BarChart2} color="#c24ecd" />
        </TourZone>
      </View>

      <View style={styles.infoContainer}>
        <Info color="#888" size={20} />
        <Text style={styles.infoText}>
          Tap "Start Enhanced Tour" to begin the tutorial with interactive
          elements!
        </Text>
      </View>

      {/* Advanced Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Features</Text>

        {/* Settings with Toggle */}
        <TourZone
          stepKey={tourSteps.settings.key}
          name={tourSteps.settings.name}
          order={tourSteps.settings.order}
          description={tourSteps.settings.description}
          borderRadius={16}
          style={styles.featureCard}
        >
          <View style={styles.featureHeader}>
            <Text style={styles.featureTitle}>Settings</Text>
            <Pressable style={styles.toggleButton}>
              <View style={[styles.toggleTrack, styles.toggleActive]}>
                <View style={styles.toggleThumb} />
              </View>
            </Pressable>
          </View>
          <Text style={styles.featureDescription}>
            Enable dark mode, notifications, and more
          </Text>
        </TourZone>

        {/* Notifications with Badge */}
        <TourZone
          stepKey={tourSteps.notifications.key}
          name={tourSteps.notifications.name}
          order={tourSteps.notifications.order}
          description={tourSteps.notifications.description}
          borderRadius={16}
          style={styles.featureCard}
        >
          <View style={styles.featureHeader}>
            <Text style={styles.featureTitle}>Notifications</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
          <Text style={styles.featureDescription}>
            You have 3 new notifications
          </Text>
        </TourZone>

        {/* Search with Input */}
        <TourZone
          stepKey={tourSteps.search.key}
          name={tourSteps.search.name}
          order={tourSteps.search.order}
          description={tourSteps.search.description}
          borderRadius={16}
          style={styles.featureCard}
        >
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for anything..."
              placeholderTextColor="#999"
            />
            <Pressable style={styles.searchButton}>
              <Text style={styles.searchButtonText}>🔍</Text>
            </Pressable>
          </View>
        </TourZone>

        {/* Help with Progress */}
        <TourZone
          stepKey={tourSteps.help.key}
          name={tourSteps.help.name}
          order={tourSteps.help.order}
          description={tourSteps.help.description}
          borderRadius={16}
          style={styles.featureCard}
        >
          <View style={styles.helpContainer}>
            <Text style={styles.featureTitle}>Help & Support</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
            <Text style={styles.progressText}>Tour Progress: 75% Complete</Text>
          </View>
        </TourZone>
      </View>

      {/* Show different button based on saved progress */}
      {hasSavedProgress ? (
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.startButton, styles.resumeButton]}
            onPress={() => start()} // Will auto-resume from saved step
          >
            <Text style={styles.startButtonText}>Resume Tour</Text>
          </Pressable>
          <Pressable
            style={[styles.startButton, styles.restartButton]}
            onPress={async () => {
              await clearProgress();
              start(tourSteps.welcome.key);
            }}
          >
            <Text style={styles.startButtonText}>Restart</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.startButton}
          onPress={() => start(tourSteps.welcome.key)}
        >
          <Text style={styles.startButtonText}>Start Enhanced Tour</Text>
        </Pressable>
      )}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 30,
  },
  welcomeBanner: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  card: {
    flex: 1,
    height: 140,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  actionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    width: '100%',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  tagText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  infoText: {
    color: '#888',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#2D3436',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resumeButton: {
    flex: 1,
    backgroundColor: '#6C5CE7',
  },
  restartButton: {
    flex: 1,
    backgroundColor: '#636E72',
  },
  // Enhanced Profile Styles
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#636E72',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  // Bio Styles
  bioCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 12,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#2D3436',
    minHeight: 80,
  },
  charCount: {
    fontSize: 12,
    color: '#636E72',
    textAlign: 'right',
    marginTop: 8,
  },
  // Poll Styles
  pollCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  pollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  pollTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  pollQuestion: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 16,
    lineHeight: 20,
  },
  pollOptions: {
    gap: 8,
    marginBottom: 16,
  },
  pollOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  pollOptionSelected: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  pollOptionText: {
    fontSize: 12,
    color: '#636E72',
    textAlign: 'center',
    fontWeight: '500',
  },
  pollOptionTextSelected: {
    color: '#fff',
  },
  pollVotes: {
    fontSize: 12,
    color: '#636E72',
  },
  // Prompt Styles
  promptCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  promptQuestion: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 16,
    lineHeight: 20,
  },
  promptButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  promptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Advanced Feature Styles
  featureCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
  },
  featureDescription: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  // Toggle Switch Styles
  toggleButton: {
    padding: 4,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#6C5CE7',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: 'flex-end',
  },
  // Notification Badge Styles
  notificationBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  searchButton: {
    marginLeft: 12,
  },
  searchButtonText: {
    fontSize: 18,
  },
  // Progress Bar Styles
  helpContainer: {
    flex: 1,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C5CE7',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#636E72',
    textAlign: 'center',
  },
});
