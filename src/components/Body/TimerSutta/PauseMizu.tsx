// src/components/Body/TimerSutta/PauseMizu.tsx
import React, { FC } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Metro は PNG/SVG を require() すると数値 ID を返してくるので、Image コンポーネントで包む
const saiseiIcon = require('../../../../assets/SaiseiIcon.png');

interface Props {
  title: string;
  subtitle: string;
}

const PauseMizu: FC<Props> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.background} />

      {/* PNG／SVG は必ず <Image> で包む */}
      <Image source={saiseiIcon} style={styles.icon} />

      {/* 動的に渡されたテキストを表示 */}
      <Text style={[styles.title, styles.textTypo]}>{title}</Text>
      {subtitle !== '' && (
        <Text style={[styles.subtitle, styles.textTypo]}>{subtitle}</Text>
      )}
    </View>
  );
};

export default PauseMizu;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 58,
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    backgroundColor: '#ecf3fd',
  },
  icon: {
    position: 'absolute',
    top: '27.6%',
    right: '5.3%',
    width: '7.6%',
    height: '46.6%',
    resizeMode: 'contain',
  },
  textTypo: {
    position: 'absolute',
    color: '#000',
    fontFamily: 'ZenMaruGothic-Medium',
    fontWeight: '500',
  },
  title: {
    top: '6.9%',
    left: '5.3%',
    fontSize: 20,
  },
  subtitle: {
    top: '53.5%',
    left: '5.6%',
    fontSize: 12,
    letterSpacing: 0.6,
  },
});
