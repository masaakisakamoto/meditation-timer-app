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
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../App';

import Header from '../components/Header/Header';
import SuttaRowDisplay from '../components/Body/TimerSutta/SuttaRowDisplay';



type Props = BottomTabScreenProps<RootTabParamList, 'TimerSutta'>;

type SuttaItem = {
  id: string;
  title: string;
  subtitle: string;
  file: any;
};

const suttas: SuttaItem[] = [
  { id: '1',  title: '仏法僧（三宝）の徳の偈文', subtitle: '',                           file: require('../../assets/suttas/0003buddhavandana.mp3') },
  { id: '2',  title: '諸仏の教え', subtitle: 'Buddhanasasana',            file: require('../../assets/suttas/0005buddhanasasana.mp3') },
  { id: '3',  title: '因縁の教え',              subtitle: 'Paticca Samuppādo',            file: require('../../assets/suttas/0006paticcasamuppado.mp3') },
  { id: '4',  title: '宝経',                    subtitle: 'Ratana Suttaṃ',                file: require('../../assets/suttas/0008ratanasutta.mp3') },
  { id: '5',  title: '慈経',                    subtitle: 'Metta Suttaṃ',                 file: require('../../assets/suttas/0009mettasutta.mp3') },
  { id: '6',  title: '勝利の経',                subtitle: 'Vijaya suttaṃ (Sutta nipāta I_11)', file: require('../../assets/suttas/0010vijayasutta.mp3') },
  { id: '7',  title: '箭経',                    subtitle: 'Salla suttaṃ',                 file: require('../../assets/suttas/0011sallasutta.mp3') },
  { id: '8',  title: '偉大なる人の思考',        subtitle: 'Mahā purisa vitakka',           file: require('../../assets/suttas/0012mahapurisavitakka.mp3') },
  { id: '9', title: '「日々是好日」偈',        subtitle: 'Bhaddekaratta gāthā',          file: require('../../assets/suttas/0015bhaddekarattasutta.mp3') },
  { id: '10', title: '祝福の偈',                subtitle: 'Āsiṃsanā',                     file: require('../../assets/suttas/0019asimsana.mp3') },
  { id: '11', title: '慈悲の瞑想',              subtitle: '',                           file: require('../../assets/suttas/0020jihinomeiso.mp3') },
  { id: '12', title: '回向の文',            subtitle: '',                           file: require('../../assets/suttas/0021ekonomon.mp3') },
];

const TimerSutta: FC<Props> = () => {
  // 現在再生中の経典のIDを管理
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  // 最後に再生していた経典のIDを管理
  const [lastPlayedId, setLastPlayedId] = useState<string | null>(null);
  // プレーヤーの再作成を制御するカウンター
  const [playerKey, setPlayerKey] = useState(0);

  return (
    <SafeAreaView style={styles.safe}>
      <Header
  title="パーリ語日常読誦経典"
  titleStyle={{ fontFamily: 'ZenMaruGothicBold' }} // ← 追加
  hasDivider={true} // 画面限定表示
/>

      <FlatList
        data={suttas}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <AudioPlayer
            key={`${item.id}-${playerKey}`}
            item={item}
            index={index}
            isCurrentPlaying={currentPlayingId === item.id}
            onPlayStateChange={(isPlaying) => {
              if (isPlaying) {
                // 別の経典を再生する場合はプレーヤーを再作成
                if (currentPlayingId !== item.id && lastPlayedId !== item.id) {
                  setPlayerKey(prev => prev + 1);
                }
                setCurrentPlayingId(item.id);
                setLastPlayedId(item.id);
              } else {
                setCurrentPlayingId(null);
              }
            }}
            stopIfOtherPlaying={currentPlayingId !== null && currentPlayingId !== item.id}
            shouldRestartFromBeginning={lastPlayedId !== item.id}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default TimerSutta;

//─── オーディオプレーヤーコンポーネント ───
type AudioPlayerProps = {
  item: SuttaItem;
  index: number;
  isCurrentPlaying: boolean;
  onPlayStateChange: (isPlaying: boolean) => void;
  stopIfOtherPlaying: boolean;
  shouldRestartFromBeginning: boolean;
};

const AudioPlayer: FC<AudioPlayerProps> = ({
  item,
  index,
  isCurrentPlaying,
  onPlayStateChange,
  stopIfOtherPlaying,
  shouldRestartFromBeginning
}) => {
  const player = useAudioPlayer(item.file);
  const status = useAudioPlayerStatus(player);
  const isPlaying = status.playing;
  const loading = status.isBuffering || !status.isLoaded;
  const [isPaused, setIsPaused] = useState(false);

  // 再生終了時の処理
  useEffect(() => {
    if (status.isLoaded && status.didJustFinish) {
      onPlayStateChange(false);
      setIsPaused(false);
    }
  }, [status.didJustFinish]);

  // 他の経典が再生開始されたら停止
  useEffect(() => {
    if (stopIfOtherPlaying && isPlaying) {
      player.pause();
      onPlayStateChange(false);
      setIsPaused(true);
    }
  }, [stopIfOtherPlaying]);

  // 再生状態が変更されたときの処理
  useEffect(() => {
    if (isCurrentPlaying && !isPlaying) {
      player.play();
    }
  }, [isCurrentPlaying]);

  const onPress = () => {
    if (isPlaying) {
      // 同じ経典をタップ: 一時停止
      player.pause();
      onPlayStateChange(false);
      setIsPaused(true);
    } else {
      // 再生開始
      if (!isPaused || shouldRestartFromBeginning) {
        // 新規再生または別の経典から戻ってきた場合は最初から
        player.pause();
        player.play();
        setIsPaused(false);
      } else {
        // 一時停止からの再開
        player.play();
      }
      onPlayStateChange(true);
    }
  };

  // 背景色ロジック
  let backgroundColor: string;
  if (loading)             backgroundColor = '#cccccc';
  else if (isPlaying)      backgroundColor = '#fff095';
  else if (index % 2 === 0) backgroundColor = '#cfe1f9';
  else                     backgroundColor = '#ecf3fd';

  return loading ? (
    <ActivityIndicator
      style={{ height: 58, marginBottom: 12 }}
      color="#000"
    />
  ) : (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginBottom: 10 }}
      disabled={loading}
    >
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
  loading: {
    height: 58,
    marginBottom: 0,
  },
});