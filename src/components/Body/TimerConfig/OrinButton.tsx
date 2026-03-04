// src/components/Body/TimerConfig/OrinButton.tsx
import React, { FC } from 'react';
import { StyleSheet, Pressable, Text, View, Image } from 'react-native';

export type Orin = {
  id: string;
  name: string;
  image: any; // require(...) で渡す
  sound: any; // 音声ファイルを require(...) で指定
};

type Props = {
  /** 現在選択中のおりん */
  selected: Orin;
  /** タップ時にオーバーレイを開くハンドラ */
  onPress: () => void;
};

const OrinButton: FC<Props> = ({ selected, onPress }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.background} />
      <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
        ＞おりんの種類：{selected.name}
      </Text>
      <Image source={selected.image} style={styles.icon} />
    </Pressable>
  );
};

export default OrinButton;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 12,
    marginBottom: 40,
  },
  background: {
    position: 'absolute',
    top: 0,
    width: '90%',
    height: 60,
    backgroundColor: '#fcdfa5',
    borderRadius: 15,
    left: '5%',
  },
  label: {
    position: 'absolute',
    top: 18,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.4,
    fontWeight: '500',
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#000',
    textAlign: 'center',
    width: '80%',
    flexShrink: 1,
    paddingHorizontal: 10,
  },
  icon: {
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 30,
    zIndex: 1,
  },
});
