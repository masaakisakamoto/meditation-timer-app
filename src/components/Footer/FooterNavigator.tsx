// src/components/Footer/FooterNavigator.tsx
import React from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PatternA from '../../../assets/FooterButtonA.svg';
import PatternB from '../../../assets/FooterButtonB.svg';
import { RootTabParamList } from '../../../App';

type Props = {
  activeTab: keyof RootTabParamList;
  onTabChange: (tab: keyof RootTabParamList) => void;
};

const tabs = [
  { name: 'TimerStart', label: 'タイマー' },
  { name: 'TimerConfig', label: 'タイマー\n設定' },
  { name: 'TimerSutta', label: '経典' },
] as const;

const FooterNavigator: React.FC<Props> = React.memo(({ activeTab, onTabChange }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 6),
          height: 64 + Math.max(insets.bottom, 6),
          elevation: 6,
          zIndex: 10,
          backgroundColor: activeTab === 'TimerSutta' ? '#90c0e6' : '#E0EEF9',
        },
      ]}
    >
      {tabs.map((tab) => {
        const Icon = activeTab === tab.name ? PatternB : PatternA;
        const isActive = activeTab === tab.name;

        return (
          <Pressable
            key={tab.name}
            style={styles.button}
            android_ripple={{ color: '#00000022', borderless: false }}
            onPress={() => onTabChange(tab.name)}
          >
            <Icon
              width="110%"
              height="110%"
              style={RNStyleSheet.absoluteFillObject as any}
              pointerEvents="none"
            />
            <Text
              style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

export default FooterNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E0EEF9',
  },
  button: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  label: {
    position: 'absolute',
    marginLeft: 15,
    fontSize: 18,
    fontFamily: 'ZenMaruGothicMedium',
    textAlign: 'center',
  },
  labelActive: { color: '#FEEF94' },
  labelInactive: { color: '#000' },
});
