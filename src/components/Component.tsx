// src/components/Component.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';

interface Props {
  one: boolean;
  saiseiIcon: ImageSourcePropType;
  title: string;
  subtitle: string;
  style?: ViewStyle;
}

export function Component({ one, saiseiIcon, title, subtitle, style }: Props) {
  return (
    <View style={[styles.base, one ? styles.trueBg : styles.falseBg, style]}>
      <Image source={saiseiIcon} style={[styles.icon, one ? styles.iconTrue : styles.iconFalse]} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 357,
    height: 58,
    borderRadius: 15,
    position: 'relative',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  trueBg: { backgroundColor: '#fff095' },
  falseBg:{ backgroundColor: '#cfe1f9' },
  icon:   { position: 'absolute', right: 16 },
  iconTrue: { top: 18, width: 15, height: 25 },
  iconFalse:{ top: 19, width: 20, height: 23 },
  title: { position: 'absolute', left: 16, top: 3, fontSize: 20, fontWeight: '500' },
  subtitle: { position: 'absolute', left: 16, top: 30, fontSize: 12, fontWeight: '500' },
});
