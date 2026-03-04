// src/components/Body/YourComponent/DiaryButton.tsx
import React, { FC } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

// SVG は require() で読み込み、<Image> で描画します
const ellipseIcon = require('../../../assets/Ellipse1.svg');
const vectorIcon = require('../../../assets/Vector.svg');

type Props = {
  onPress?: () => void;
};

const DiaryButton: FC<Props> = ({ onPress }) => (
  <Pressable style={styles.container} onPress={onPress}>
    <Image source={ellipseIcon} style={styles.ellipse} />
    <Image source={vectorIcon} style={styles.vector} />
    <Text style={styles.label}>Diary</Text>
  </Pressable>
);

export default DiaryButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 26,
    right: 0,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipse: {
    position: 'absolute',
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  vector: {
    position: 'absolute',
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  label: {
    position: 'absolute',
    bottom: -18,
    fontSize: 11,
    letterSpacing: 0.3,
    fontWeight: '500',
    fontFamily: 'JosefinSans-Medium',
    color: '#fff',
  },
});
