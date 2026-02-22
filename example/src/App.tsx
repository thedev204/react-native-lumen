import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  TourProvider,
  WigglySpringConfig,
  type ZoneStyle,
  type TourPersistenceConfig,
} from 'react-native-lumen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Home } from './Home';
import { tourSteps } from './data/tourSteps';
import { StyleSheet } from 'react-native';

// Global zone style - applied to all steps unless overridden
const globalZoneStyle: ZoneStyle = {
  padding: 0,
  borderWidth: 1,
  borderColor: '#007AFF',
};

// Persistence configuration - auto-detects MMKV v4+ or AsyncStorage
const persistenceConfig: TourPersistenceConfig = {
  enabled: true,
  tourId: 'lumen-example-tour-v1',
  autoResume: true, // Resume from saved step when start() is called
  clearOnComplete: true, // Clear progress when tour finishes
  // maxAge: 7 * 24 * 60 * 60 * 1000, // Optional: expire after 7 days
};

export default function App() {
  // Extract keys for order
  const stepsOrder = Object.values(tourSteps)
    .sort((a, b) => a.order - b.order)
    .map((step) => step.key);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <TourProvider
            stepsOrder={stepsOrder}
            backdropOpacity={0.6}
            config={{
              // preventInteraction: true,
              springConfig: WigglySpringConfig,
              labels: {
                next: 'Go Next',
                finish: 'Complete!',
                skip: 'Skip Tour',
              },
              // Global zone style - can be overridden per-step
              zoneStyle: globalZoneStyle,
              // Persistence - saves progress to storage (MMKV or AsyncStorage)
              persistence: persistenceConfig,
              preventInteraction: false,
              // enableGlow - enable/disable glow effect for all steps (can still be overridden per-step)
              enableGlow: false,
            }}
          >
            <Home />
          </TourProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
