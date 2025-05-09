// src/components/OrinButton.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';

interface OrinButtonProps {
  /** 表示するおりんの種類テキスト（例："大りん"） */
  typeLabel?: string;
  /** ボタン全体のスタイルを上書きする場合に使用 */
  style?: ViewStyle;
  /** テキスト部分のスタイルを上書きする場合に使用 */
  textStyle?: TextStyle;
  /** 押下時ハンドラ */
  onPress?: () => void;
}

/**
 * OrinButton
 * おりんの種類を選択するためのボタンコンポーネント
 */
export function OrinButton({
  typeLabel = '大りん',
  style,
  textStyle,
  onPress,
}: OrinButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.overlapGroup}>
        <View style={styles.background} />
        <Text style={[styles.textWrapper, textStyle]}>›おりんの種類：{typeLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 301,
    height: 79,
    position: 'relative',
  },
  overlapGroup: {
    width: 301,
    height: 78,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 301,
    height: 55,
    backgroundColor: '#fcdfa5',
    borderRadius: 15,
  },
  textWrapper: {
    position: 'absolute',
    top: 13,
    left: 42,
    width: 223,
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 25.3,
    letterSpacing: -0.4,
  },
});
