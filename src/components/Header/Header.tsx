// src/components/Header/Header.tsx
import React, { FC } from 'react';
import { SafeAreaView, Text, StyleSheet, TextStyle, View } from 'react-native';

interface HeaderProps {
  title: string;
  // 任意：親から上書きしたい場合に使える
  titleStyle?: TextStyle;
  hasDivider?: boolean; // 追加
}

const Header: FC<HeaderProps> = ({ title, titleStyle, hasDivider }) => (
  <View>
    <SafeAreaView style={styles.header}>
      <Text style={[styles.title, titleStyle]} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
    </SafeAreaView>
    {hasDivider && <View style={styles.divider} />}
  </View>
);
export default Header;

const styles = StyleSheet.create({
  header: {
    height: 60,
    width: '100%',
    backgroundColor: '#9fcaec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    // ★ Android でカスタムフォントが外れないよう fontWeight は付けない
    //   太字にしたい時は Bold の ttf を別名で読み込んで切替える（下に補足）
    fontFamily: 'ZenMaruGothicBold', // ← useFonts のキー名と一致させる
    color: '#fff',
  },
  divider: {
    height: 5,
    width: '100%',
    backgroundColor: '#cfe1f9',
  },
});
