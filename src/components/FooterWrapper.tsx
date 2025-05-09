// src/components/FooterWrapper.tsx
import React, { FC } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type Tab = 'timer' | 'config' | 'sutta';

interface FooterWrapperProps {
  /** 現在選択中のタブ */
  current: Tab;
  /** タブ切替コールバック */
  onNavigate: (tab: Tab) => void;
  style?: ViewStyle;
}

export const FooterWrapper: FC<FooterWrapperProps> = ({
  current,
  onNavigate,
  style,
}) => (
  <View style={[styles.footer, style]}>
    {/* 左：タイマー */}
    <Pressable
      style={[
        styles.button,
        styles.btnTimer,
        current === 'timer' && styles.active,
      ]}
      onPress={() => onNavigate('timer')}
    >
      <Text style={styles.label}>タイマー</Text>
    </Pressable>

    {/* 中央：タイマー設定 */}
    <Pressable
      style={[
        styles.button,
        styles.btnConfig,
        current === 'config' && styles.active,
      ]}
      onPress={() => onNavigate('config')}
    >
      <Text style={styles.label}>{`タイマー\n設定`}</Text>
    </Pressable>

    {/* 右：経典 */}
    <Pressable
      style={[
        styles.button,
        styles.btnSutta,
        current === 'sutta' && styles.active,
      ]}
      onPress={() => onNavigate('sutta')}
    >
      <Text style={[styles.label, { color: '#eeec3f' }]}>経典</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    position: 'relative',
    height: 128,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  button: {
    position: 'absolute',
    top: 0,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#c1dcf1',
    overflow: 'hidden',
  },
  btnTimer: {
    left: 0,
    width: 136,
    borderRadius: 68,
    backgroundColor: '#9fcaec',
  },
  btnConfig: {
    left: 131,
    width: 131,
    borderRadius: 65.5,
    backgroundColor: '#9fcaec',
  },
  btnSutta: {
    left: 262,
    width: 154,
    borderRadius: 77,
    backgroundColor: '#76b0e0',
  },
  label: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: '#585657',
    lineHeight: 24,
    letterSpacing: -0.12,
  },
  active: {
    opacity: 1, // you can adjust to highlight the active tab
  },
});
