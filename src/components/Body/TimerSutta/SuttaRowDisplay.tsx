// src/components/Body/TimerSutta/SuttaRowDisplay.tsx
import React, { FC } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface SuttaProps {
  title: string;
  subtitle: string;
  /** 背景色 */
  backgroundColor: string;
  /** 再生中フラグ */
  isPlaying: boolean;
}

const SuttaRowDisplay: FC<SuttaProps> = ({
  title,
  subtitle,
  backgroundColor,
  isPlaying,
}) => {
  // 再生中なら pauseIcon、それ以外は saiseiIcon
  const saiseiIcon = require('../../../../assets/SaiseiIcon.png');
  const pauseIcon   = require('../../../../assets/PauseIcon.png');
  const iconSource  = isPlaying ? pauseIcon : saiseiIcon;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* 背景レイヤー */}
      <View style={styles.background} />

      {/* アイコン */}
      <Image source={iconSource} style={styles.icon} />

      {/* タイトル */}
      <Text style={[styles.title, styles.textTypo]}>{title}</Text>

      {/* サブタイトル（あれば） */}
      {subtitle !== '' && (
        <Text style={[styles.subtitle, styles.textTypo]}>{subtitle}</Text>
      )}
    </View>
  );
};

export default SuttaRowDisplay;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 58,
    position: 'relative',
    borderRadius: 15,
    marginBottom: 0,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  icon: {
    position: 'absolute',
    top: '29.3%',
    right: '5.3%',
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  textTypo: {
    position: 'absolute',
    left: '5.3%',
    color: '#000',
    fontFamily: 'ZenMaruGothic-Medium',
    fontWeight: '500',
  },
  title: {
    top: '6.9%',
    fontSize: 20,
  },
  subtitle: {
    top: '53.5%',
    fontSize: 12,
    letterSpacing: 0.6,
  },
});
