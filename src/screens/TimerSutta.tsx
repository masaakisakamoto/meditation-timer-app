// src/screens/TimerSutta.tsx
import React, { FC, useState, useEffect } from 'react';

import {
  SafeAreaView,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Asset } from 'expo-asset';

import Header from '../components/Header/Header';
import SuttaRowDisplay from '../components/Body/TimerSutta/SuttaRowDisplay';

type SuttaItem = {
  id: string;
  title: string;
  subtitle: string;
  file: any;
};

const suttas: SuttaItem[] = [
  {
    id: '1',
    title: '仏法僧（三宝）の徳の偈文',
    subtitle: '',
    file: require('../../assets/suttas/0003buddhavandana.mp3'),
  },
  {
    id: '2',
    title: '諸仏の教え',
    subtitle: 'Buddhanasasana',
    file: require('../../assets/suttas/0005buddhanasasana.mp3'),
  },
  {
    id: '3',
    title: '因縁の教え',
    subtitle: 'Paticca Samuppādo',
    file: require('../../assets/suttas/0006paticcasamuppado.mp3'),
  },
  {
    id: '4',
    title: '歓喜の言葉',
    subtitle: 'Paṭhama udāna',
    file: require('../../assets/suttas/0007pathamaudana.mp3'),
  },
  {
    id: '5',
    title: '宝経',
    subtitle: 'Ratana Suttaṃ',
    file: require('../../assets/suttas/0008ratanasutta.mp3'),
  },
  {
    id: '6',
    title: '慈経',
    subtitle: 'Metta Suttaṃ',
    file: require('../../assets/suttas/0009mettasutta.mp3'),
  },
  {
    id: '7',
    title: '勝利の経',
    subtitle: 'Vijaya suttaṃ (Sutta nipāta I_11)',
    file: require('../../assets/suttas/0010vijayasutta.mp3'),
  },
  {
    id: '8',
    title: '箭経',
    subtitle: 'Salla suttaṃ',
    file: require('../../assets/suttas/0011sallasutta.mp3'),
  },
  {
    id: '9',
    title: '偉大なる人の思考',
    subtitle: 'Mahā purisa vitakka',
    file: require('../../assets/suttas/0012mahapurisavitakka.mp3'),
  },
  {
    id: '10',
    title: '吉祥経',
    subtitle: 'Mangala suttaṃ',
    file: require('../../assets/suttas/0013mangalasutta.mp3'),
  },
  {
    id: '11',
    title: '戒め',
    subtitle: 'Sallekha suttaṃ',
    file: require('../../assets/suttas/0014sallekhasutta.mp3'),
  },
  {
    id: '12',
    title: '「日々是好日」偈',
    subtitle: 'Bhaddekaratta gāthā',
    file: require('../../assets/suttas/0015bhaddekarattasutta.mp3'),
  },
  {
    id: '13',
    title: '祝福の偈',
    subtitle: 'Āsiṃsanā',
    file: require('../../assets/suttas/0019asimsana.mp3'),
  },
  {
    id: '14',
    title: '慈悲の瞑想',
    subtitle: '',
    file: require('../../assets/suttas/jihinomeiso_full.mp3'),
  },
  {
    id: '15',
    title: '回向の文',
    subtitle: '',
    file: require('../../assets/suttas/0021ekonomon.mp3'),
  },
];

const TimerSutta: FC = () => {
  // 現在選択中の経典ID（null = 未選択）
  const [currentId, setCurrentId] = useState<string | null>(null);
  // 一時停止中フラグ（source 切り替え後の自動再生を抑止するため）
  const [isPaused, setIsPaused] = useState(false);

  // 親で1本だけ player を持つ。currentId が変わると source が切り替わる
  const currentSutta = suttas.find((s) => s.id === currentId) ?? null;
  const player = useAudioPlayer(currentSutta?.file ?? null);
  const status = useAudioPlayerStatus(player);

  // source 切り替え後、ロード完了で自動再生（一時停止中は除く）
  // currentId も依存に含めることで、source 変更時に isLoaded が false→true を
  // 通らないケースでも確実に再生トリガーされる
  useEffect(() => {
    if (currentId !== null && status.isLoaded && !isPaused) {
      player.play();
    }
  }, [currentId, status.isLoaded]);

  // 自然終了時の処理
  useEffect(() => {
    if (status.isLoaded && status.didJustFinish) {
      player.setActiveForLockScreen(false);
      setCurrentId(null);
      setIsPaused(false);
    }
  }, [status.didJustFinish]);

  // 再生中かどうかに応じて audio mode を切り替え
  useEffect(() => {
    if (currentId !== null) {
      setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix',
      }).catch(() => {});
    } else {
      setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: 'mixWithOthers',
      }).catch(() => {});
    }
  }, [currentId]);

  // ロック画面メタデータ: ロード済みかつ再生開始されたら設定
  useEffect(() => {
    if (currentSutta && status.isLoaded && status.playing) {
      player.setActiveForLockScreen(true, {
        title: currentSutta.title,
        artist: 'MitterTimer',
        albumTitle: 'Pali Chanting',
        artworkUrl: Asset.fromModule(require('../../assets/icon.png')).uri,
      });
    }
  }, [currentId, status.isLoaded, status.playing]);

  const handlePress = (item: SuttaItem) => {
    if (currentId === item.id) {
      // 同じ行: 再生/一時停止トグル
      if (status.playing) {
        player.pause();
        player.setActiveForLockScreen(false);
        setIsPaused(true);
      } else {
        player.play();
        setIsPaused(false);
      }
    } else {
      // 別の行: source を切り替え → ロード完了後 useEffect で自動再生
      setCurrentId(item.id);
      setIsPaused(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="パーリ語日常読誦経典"
        titleStyle={{ fontFamily: 'ZenMaruGothicBold' }}
        hasDivider={true}
      />
      <FlatList
        data={suttas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <SuttaRow
            item={item}
            index={index}
            isPlaying={status.playing && currentId === item.id}
            isLoading={currentId === item.id && (status.isBuffering || !status.isLoaded)}
            onPress={() => handlePress(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default TimerSutta;

//─── 行表示コンポーネント（音声ロジックなし）───
type SuttaRowProps = {
  item: SuttaItem;
  index: number;
  isPlaying: boolean;
  isLoading: boolean;
  onPress: () => void;
};

const SuttaRow: FC<SuttaRowProps> = ({ item, index, isPlaying, isLoading, onPress }) => {
  let backgroundColor: string;
  if (isLoading) backgroundColor = '#cccccc';
  else if (isPlaying) backgroundColor = '#fff095';
  else if (index % 2 === 0) backgroundColor = '#cfe1f9';
  else backgroundColor = '#ecf3fd';

  return isLoading ? (
    <ActivityIndicator style={{ height: 58, marginBottom: 12 }} color="#000" />
  ) : (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 10 }}>
      <SuttaRowDisplay
        title={item.title}
        subtitle={item.subtitle}
        backgroundColor={backgroundColor}
        isPlaying={isPlaying}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#90c0e6' },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  separator: {
    height: 0,
  },
});
