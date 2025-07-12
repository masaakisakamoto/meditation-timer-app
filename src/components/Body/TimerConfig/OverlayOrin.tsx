// src/components/Body/TimerConfig/OverlayOrin.tsx

import React, { FC } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AudioPlayer, AudioStatus } from 'expo-audio';

export type Orin = {
  id: string;
  name: string;
  image: any;
  sound: any;  // 音声ファイルを require(...) で指定
};

type Props = {
  /** 選択可能なおりん一覧 */
  orins: Orin[];
  /** おりん選択時のコールバック */
  onSelect: (orin: Orin) => void;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
  /** AudioPlayerのマップ */
  players: Record<string, AudioPlayer>;
};

/**
 * AudioPlayer を再生し、再生完了まで待つユーティリティ
 * 
 * @param player ExpoAudio の AudioPlayer インスタンス
 */
const playAndWait = (player: AudioPlayer) =>
  new Promise<void>((resolve) => {
    let hasStarted = false;
    const sub = player.addListener(
      'playbackStatusUpdate',
      (status: AudioStatus) => {
        if (!hasStarted && status.playing) {
          hasStarted = true;
        }
        if (hasStarted && !status.playing) {
          sub.remove(); // リスナー解除
          resolve();    // Promise 解決
        }
      }
    );
    player.play(); // 再生開始
  });

const OverlayOrin: FC<Props> = ({ orins, onSelect, onClose, players }) => {
  const handleOrinPress = async (item: Orin) => {
    try {
      // まずおりんを選択
      onSelect(item);
      console.log('Selected orin:', item.name, 'with ID:', item.id);

      // モーダルを先に閉じる
      onClose();

      // 少し待ってから音を再生（モーダルのアニメーション完了を待つ）
      await new Promise(resolve => setTimeout(resolve, 300));

      // 音を再生
      const player = players[item.id];
      console.log('Starting playback...');
      player.play();

    } catch (e) {
      console.warn('おりん再生エラー:', e);
    }
  };

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
            style={styles.item}
            onPress={() => handleOrinPress(item)}
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
    width: 300,             // 横幅は固定
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
    borderRadius: 25,  // 円形にする
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#000',
  },
});
