// src/components/FooterCommon.tsx
import React, { FC } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export interface FooterCommonProps {
  onPressTimer: () => void;
  onPressConfig: () => void;
  onPressSutta: () => void;
}

/**
 * Figma→ReactNative コンバート版フッター。
 * 左：タイマー、中：タイマー設定、右：経典
 */
export const FooterCommon: FC<FooterCommonProps> = ({
  onPressTimer,
  onPressConfig,
  onPressSutta,
}) => (
  <View style={styles.footer}>
    {/* 左ボタン：タイマー */}
    <Pressable onPress={onPressTimer} style={[styles.btn, styles.btnTimer]}>
      <Text style={styles.btnText}>タイマー</Text>
    </Pressable>

    {/* 中央ボタン：タイマー設定 */}
    <Pressable onPress={onPressConfig} style={[styles.btn, styles.btnConfig]}>
      <Text style={styles.btnText}>{`タイマー\n設定`}</Text>
    </Pressable>

    {/* 右ボタン：経典 */}
    <Pressable onPress={onPressSutta} style={[styles.btn, styles.btnSutta]}>
      <Text style={styles.btnText}>経典</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    height: 74,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  btn: {
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTimer: {
    width: 136,
    backgroundColor: '#9fcaec',
  },
  btnConfig: {
    width: 131,
    backgroundColor: '#76b0e0',
  },
  btnSutta: {
    width: 154,
    backgroundColor: '#9fcaec',
  },
  btnText: {
    color: '#585657',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
});
