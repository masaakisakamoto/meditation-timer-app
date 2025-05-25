// src/components/Body/TimerSutta/SuttaItem.tsx
import React, { FC } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Metro は PNG/SVG を require() すると数値 ID を返してくるので、
const saiseiIcon = require('../../../../assets/SaiseiIcon.png');

interface Props {
  title: string;
  subtitle: string;
}

const SuttaItem: FC<Props> = ({ title, subtitle }) => (
  <View style={styles.container}>
    <View style={styles.background} />
    {/* アイコンは必ず <Image> で包む */}
    <Image source={saiseiIcon} style={styles.icon} />
    <Text style={[styles.subtitle, styles.textTypo]}>{subtitle}</Text>
    <Text style={[styles.title, styles.textTypo]}>{title}</Text>
  </View>
);

export default SuttaItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 58,
    position: 'relative',
    marginBottom: 12,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    backgroundColor: '#cfe1f9',
  },
  icon: {
    position: 'absolute',
    top: '29.3%',
    right: '5.3%',
    width: '7.6%',
    height: '46.6%',
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
    top: '53.45%',
    fontSize: 12,
    letterSpacing: 0.6,
  },
});
