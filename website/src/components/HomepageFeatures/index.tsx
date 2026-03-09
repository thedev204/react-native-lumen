import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '60fps, Every Step',
    Svg: require('@site/static/img/reanimated_logo.svg').default,
    description: (
      <>
        Built on <code>react-native-reanimated</code> worklets, every highlight
        transition, glow effect, and tooltip animation runs on the UI thread —
        no jank, no dropped frames.
      </>
    ),
  },
  {
    title: 'Fully Customizable',
    Svg: require('@site/static/img/full_custom.svg').default,
    description: (
      <>
        Choose from three zone shapes, tweak glow colors, provide your own
        tooltip card, override styles per step, and control every button label.
        Your tour, your design system.
      </>
    ),
  },
  {
    title: 'Multi-Screen & Persistent',
    Svg: require('@site/static/img/navigation.svg').default,
    description: (
      <>
        Run tours across multiple navigator screens with automatic step-pending
        and auto-resume. Persist progress with MMKV or AsyncStorage so users
        never lose their place.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
