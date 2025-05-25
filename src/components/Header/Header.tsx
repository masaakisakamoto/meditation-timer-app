// src/components/Header/Header.tsx
import React, { FC } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
}

const Header: FC<HeaderProps> = ({ title }) => (
  <SafeAreaView style={styles.header}>
    <Text
      style={styles.title}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {title}
    </Text>
  </SafeAreaView>
);

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 60,
    width: '100%',
    backgroundColor: '#9fcaec',
    justifyContent: 'center',    // 垂直中央
    alignItems: 'center',        // 水平中央
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    fontFamily: 'JosefinSans-Medium',
    color: '#fff',
  },
});
