// src/components/Body/TimerConfig/OverlayOrin.tsx

import React, { FC } from 'react';
import { View, Text, Image, Pressable, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type Orin = {
  id: string;
  name: string;
  image: any;
  sound: any; // 音声ファイルを require(...) で指定
};

type Props = {
  /** 選択可能なおりん一覧 */
  orins: Orin[];
  /** おりん選択時のコールバック（再生含む処理は呼び出し元が担う） */
  onSelect: (orin: Orin) => void;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
};

const OverlayOrin: FC<Props> = ({ orins, onSelect, onClose }) => {
  return (
    <SafeAreaView style={styles.overlayContainer}>
      {/* ヘッダー部分 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>おりんを選択</Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      </View>

      {/* おりんリスト */}
      <FlatList
        data={orins}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onSelect(item)}
            style={({ pressed }) => [
              styles.item,
              pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Image source={item.image} style={styles.icon} />
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default OverlayOrin;

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: '#fcdfa5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    fontWeight: '600',
  },
  list: {
    width: '100%',
  },
  item: {
    width: 300, // 横幅は固定
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 12,
    resizeMode: 'cover',
    borderRadius: 25, // 円形にする
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#000',
  },
});
