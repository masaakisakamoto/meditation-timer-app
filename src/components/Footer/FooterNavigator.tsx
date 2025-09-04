// src/components/Footer/FooterNavigator.tsx
import React from 'react';
import { View, Pressable, Text, StyleSheet, StyleSheet as RNStyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PatternA from '../../../assets/FooterButtonA.svg';
import PatternB from '../../../assets/FooterButtonB.svg';
import { RootTabParamList } from '../../../App';

type Props = {
  activeTab: keyof RootTabParamList;
  onTabChange: (tab: keyof RootTabParamList) => void;
};

const FooterNavigator: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const insets = useSafeAreaInsets();
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
          paddingBottom: Math.max(insets.bottom, 6),
          height: 64 + Math.max(insets.bottom, 6),
          elevation: 6,
          zIndex: 10,
          backgroundColor: activeTab === 'TimerSutta' ? '#90c0e6' : '#E0EEF9',
        },
      ]}
    >
      {tabs.map(tab => {
        const Icon = activeTab === tab.name ? PatternB : PatternA;
        const isActive = activeTab === tab.name;

        return (
          <Pressable
            key={tab.name}
            style={styles.button}                 // ★ 横並び & 均等幅に戻す
            android_ripple={{ color: '#00000022', borderless: false }}
            onPress={() => onTabChange(tab.name)}
          >
            {/* ★ SVGを“背景”として全面に敷く（重ね順は下） */}
            <Icon
              width="110%"
              height="110%"
              // react-native-svg に百分率指定可。全面に貼るため absoluteFillObject を併用
              style={RNStyleSheet.absoluteFillObject as any}
              // 必要なら次の1行で切り抜き方を制御（SVG の viewBox がある前提）
              // preserveAspectRatio="xMidYMid slice"
              pointerEvents="none" // タップをテキストに通す
            />

            {/* ★ 前面にテキスト（重なり実現） */}
            <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
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
    flexDirection: 'row',     // ★ 横並び
    backgroundColor: '#E0EEF9',
  },
  button: {
    flex: 1,                  // ★ 各ボタンを等分
    position: 'relative',     // ★ 子のabsolute配置の基準にする
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    // 必要ならタップ領域を調整：
    // paddingVertical: 6, paddingHorizontal: 8,
  },
  label: {
    position: 'absolute',     // ★ 背景SVGの上に重ねる
    marginLeft: 15,
    fontSize: 18,
    fontFamily: 'ZenMaruGothic-Medium',
    textAlign: 'center',
  },
  labelActive:   { color: '#FEEF94' },
  labelInactive: { color: '#000'    },
});
