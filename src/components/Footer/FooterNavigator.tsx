// src/components/Footer/FooterNavigator.tsx
import React from 'react';
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PatternA from '../../../assets/FooterButtonA.svg';
import PatternB from '../../../assets/FooterButtonB.svg';
import { RootTabParamList } from '../../../App';

type Props = {
  activeTab: keyof RootTabParamList;
  onTabChange: (tab: keyof RootTabParamList) => void;
};

const FooterNavigator: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const insets = useSafeAreaInsets();          // ←★ ここで取得
  const tabs = [
    { name: 'TimerStart',  label: 'タイマー' },
    { name: 'TimerConfig', label: 'タイマー\n設定' },
    { name: 'TimerSutta',  label: '経典' },
  ] as const;

  return (
    <View
      style={[
        styles.container,
        {
          /* 🔽 Androidでも iPhone X でもピッタリ浮かせる */
          paddingBottom: Math.max(insets.bottom, 6),
          height: 64 + Math.max(insets.bottom, 6),
          elevation: 6,          // Android 用
          zIndex: 10,            // iOS 用
        },
      ]}
    >
      {tabs.map(tab => {
        const Icon = activeTab === tab.name ? PatternB : PatternA;
        return (
          <Pressable
            key={tab.name}
            style={styles.button}
            android_ripple={{ color: '#00000022', borderless: false }}
            onPress={() => onTabChange(tab.name)}
          >
            <Icon width="100%" height="100%" />
            <Text style={[
              styles.label,
              activeTab === tab.name ? styles.labelActive : styles.labelInactive,
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default FooterNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E0EEF9',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    fontSize: 20,
    fontFamily: 'ZenMaruGothic-Medium',
    textAlign: 'center',
  },
  labelActive:   { color: '#FEEF94' },
  labelInactive: { color: '#000'    },
});
