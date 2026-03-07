// src/components/Body/TimerConfig/TimerModeToggle.tsx
import React, { FC } from 'react';
import { SafeAreaView, Pressable, View, Text, StyleSheet } from 'react-native';

export type Mode = 'countdown' | 'countup';

type Props = {
  /** 現在のモード */
  mode: Mode;
  /** 押されたときにモードを切り替える */
  onToggle: () => void;
};

const TimerModeToggle: FC<Props> = ({ mode, onToggle }) => {
  const isDown = mode === 'countdown';

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          isDown ? styles.downBg : styles.upBg,
          pressed && { opacity: 0.7 },
        ]}
        onPress={onToggle}
      >
        <Text style={[styles.label, isDown ? styles.downText : styles.upText]}>
          {isDown ? 'カウントダウンする' : 'カウントアップする'}
        </Text>
        <View style={[styles.indicator, isDown ? styles.downInd : styles.upInd]} />
        <Text style={[styles.countSample, isDown ? styles.downSample : styles.upSample]}>
          {isDown ? '5,4,3…' : '1,2,3…'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default TimerModeToggle;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '90%',
    height: 60,
    borderRadius: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  // 背景色
  downBg: { backgroundColor: '#fcdfa5' },
  upBg: { backgroundColor: '#fcdfa5' },

  // ラベル
  label: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: 'ZenMaruGothicMedium',
    fontWeight: '500',
    textAlign: 'center',
    position: 'absolute',
    left: '5%', // 左端の余白5%
    right: '28%', // 右側のサンプル数字分を避ける
    flexShrink: 1, // テキストを縮小可能に
  },
  downText: { color: '#000' },
  upText: { color: '#000' },

  // サンプル数字背景
  indicator: {
    position: 'absolute',
    borderRadius: 12,
    width: '20%',
    height: '60%',
    right: '5%',
    top: '20%',
  },
  downInd: {
    backgroundColor: '#fff095',
  },
  upInd: {
    backgroundColor: '#f9c04c',
  },

  // サンプル数字
  countSample: {
    position: 'absolute',
    fontSize: 16,
    fontFamily: 'GothicA1-Medium',
    fontWeight: '500',
    right: '8%',
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  downSample: {
    color: '#aba686',
  },
  upSample: {
    color: '#fff',
  },
});
