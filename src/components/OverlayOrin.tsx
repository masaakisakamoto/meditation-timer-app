// src/components/OverLayOrin.tsx
import React, { FC } from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';

interface OverLayOrinProps {
  /** おりんの名称（例: "大りん"） */
  name: string;
  /** アイコン画像のソース */
  icon: ImageSourcePropType;
}

export const OverLayOrin: FC<OverLayOrinProps> = ({ name, icon }) => {
  return (
    <View style={styles.overlayOrin}>
      <View style={styles.component13}>
        <View style={styles.countdownButton} />
        <Text style={styles.title}>{name}</Text>
        <Image source={icon} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayOrin: {
    width: '100%',
    height: 470,
    borderRadius: 55,
    backgroundColor: '#fcdfa5',
    paddingVertical: 38,
    paddingHorizontal: 44,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  component13: {
    width: 301,
    height: 80,
    position: 'relative',
  },
  countdownButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 80 * 0.6875, // Web の 68.75% 相当
    borderRadius: 15,
    backgroundColor: '#fcfcfc',
  },
  title: {
    position: 'absolute',
    top: 80 * 0.1875,    // Web の 18.75% 相当
    left: 301 * 0.2193,  // Web の 21.93% 相当
    fontSize: 20,
    fontWeight: '500',
  },
  icon: {
    position: 'absolute',
    top: 5,
    left: 301 * 0.0332,  // Web の 3.32% 相当
    width: 301 * 0.2359, // Web の 23.59% 相当
    height: 49.7,
    resizeMode: 'cover',
  },
});

export default OverLayOrin;
