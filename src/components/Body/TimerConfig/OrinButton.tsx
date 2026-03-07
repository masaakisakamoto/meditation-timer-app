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
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
      ]}
    >
      <Text style={styles.label}>おりんの種類</Text>
      <View style={styles.right}>
        <Image source={selected.image} style={styles.icon} />
        <Text style={styles.name} numberOfLines={1}>
          {selected.name}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
};

export default OrinButton;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fcdfa5',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#000',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'cover',
    borderRadius: 14,
  },
  name: {
    fontSize: 15,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#666',
    maxWidth: 100,
  },
  chevron: {
    fontSize: 20,
    color: '#aaa',
    lineHeight: 22,
  },
});
