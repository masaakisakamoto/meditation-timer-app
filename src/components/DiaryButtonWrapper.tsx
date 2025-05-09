// src/components/DiaryButtonWrapper.tsx
import React, { FC } from 'react';
import { Pressable, View, Text, StyleSheet, Image } from 'react-native';

// Web版で使っていたアイコン
import vectorIcon from '../../assets/Vector.png'; 

export const DiaryButtonWrapper: FC<{ onPress?: () => void }> = ({ onPress }) => {
  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <View style={styles.button}>
        <View style={styles.ellipseParent}>
          <View style={styles.groupChild} />
          <Image source={vectorIcon} style={styles.vectorIcon} />
          <Text style={styles.diaryText}>Diary</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 52,
    justifyContent: 'center',
  },
  button: {
    width: 52,
    height: 52,
    position: 'relative',
  },
  ellipseParent: {
    position: 'absolute',
    top: '-46.15%',
    left: 0,
    right: '-232.12%',
    bottom: '-90.96%',
    width: 332.12 * 0.52, // 元CSS比率を掛け合わせています
    height: 237.12 * 0.52,
  },
  groupChild: {
    position: 'absolute',
    top: '0.22%',
    left: '0.16%',
    width: '35.73%',
    height: '48.18%',
    borderRadius: 26,
    backgroundColor: '#f7d3dd',
  },
  vectorIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '36.07%',
    height: '48.58%',
    resizeMode: 'contain',
  },
  diaryText: {
    position: 'absolute',
    top: 45,
    left: 17,
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Josefin Sans',
    color: '#000',
  },
});
