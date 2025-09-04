// src/components/Body/TimerStop/PauseButton.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const pauseIcon = require('../../../../assets/PauseIcon.png');

const PauseButton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <Image source={pauseIcon} style={styles.icon} />
      <Text style={[styles.subtitle, styles.textTypo]}>
        (Dhammapada Nos. 183-185)
      </Text>
      <Text style={[styles.title, styles.textTypo]}>諸仏の教え</Text>
    </View>
  );
};

export default PauseButton;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 58,
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    backgroundColor: '#fff095',
  },
  icon: {
    position: 'absolute',
    top: '34.5%',
    right: '7.3%',
    width: 20,      // 実際のアイコン幅に合わせて調整
    height: 20,     // 実際のアイコン高さに合わせて調整
    resizeMode: 'contain',
  },
  textTypo: {
    position: 'absolute',
    left: '5.3%',
    color: '#000',
    fontFamily: 'ZenMaruGothic-Medium',
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
