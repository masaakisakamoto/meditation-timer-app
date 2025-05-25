// src/screens/TimerSutta.tsx
import React, { FC } from 'react';
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
  { id: '1',  title: '諸仏の教え',            subtitle: '(Dhammapada Nos. 183-185)', file: require('../../assets/suttas/buddhanasasana.mp3') },
  { id: '2',  title: '仏法僧（三宝）の徳の偈文', subtitle: '',                           file: require('../../assets/suttas/0003buddhavandana.mp3') },
  { id: '3',  title: '三宝に帰依するための偈文', subtitle: 'Tisaraṇa Vandanā',            file: require('../../assets/suttas/0004namami.mp3') },
  { id: '4',  title: '因縁の教え',              subtitle: 'Paticca Samuppādo',            file: require('../../assets/suttas/0006paticcasamuppado.mp3') },
  { id: '5',  title: '宝経',                    subtitle: 'Ratana Suttaṃ',                file: require('../../assets/suttas/0008ratanasutta.mp3') },
  { id: '6',  title: '慈経',                    subtitle: 'Metta Suttaṃ',                 file: require('../../assets/suttas/0009mettasutta.mp3') },
  { id: '7',  title: '勝利の経',                subtitle: 'Vijaya suttaṃ (Sutta nipāta I_11)', file: require('../../assets/suttas/0010vijayasutta.mp3') },
  { id: '8',  title: '箭経',                    subtitle: 'Salla suttaṃ',                 file: require('../../assets/suttas/0011sallasutta.mp3') },
  { id: '9',  title: '偉大なる人の思考',        subtitle: 'Mahā purisa vitakka',           file: require('../../assets/suttas/0012mahapurisavitakka.mp3') },
  { id: '10', title: '吉祥経',                  subtitle: 'Mangala suttaṃ',               file: require('../../assets/suttas/0013mangalasutta.mp3') },
  { id: '11', title: '戒め',                    subtitle: 'Sallekha suttaṃ',              file: require('../../assets/suttas/0014sallekhasutta.mp3') },
  { id: '12', title: '「日々是好日」偈',        subtitle: 'Bhaddekaratta gāthā',          file: require('../../assets/suttas/0015bhaddekarattasutta.mp3') },
  { id: '13', title: '祝福の偈',                subtitle: 'Āsiṃsanā',                     file: require('../../assets/suttas/0019asimsana.mp3') },
  { id: '14', title: '慈悲の瞑想',              subtitle: '',                           file: require('../../assets/suttas/metta_bhavana128.mp3') },
  { id: '15', title: '慈悲の瞑想-ショート',      subtitle: '',                           file: require('../../assets/suttas/jihi_short.mp3') },
  { id: '16', title: '慈悲の瞑想-フル',         subtitle: '',                           file: require('../../assets/suttas/metta_full.mp3') },
  { id: '17', title: '日常読誦経典',            subtitle: '',                           file: require('../../assets/suttas/0099nitiyoudokuzyukeiten.mp3') },
];

const TimerSutta: FC<Props> = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <Header title="パーリ語日常読誦経典" />

      <FlatList
        data={suttas}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => <Row item={item} index={index} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

    </SafeAreaView>
  );
};

export default TimerSutta;

//─── リスト行コンポーネント ───
const Row: FC<{ item: SuttaItem; index: number }> = ({ item, index }) => {
  const player = useAudioPlayer(item.file);
  const status = useAudioPlayerStatus(player);
  const isPlaying = status.playing;
  const loading  = status.isBuffering || !status.isLoaded;

  const onPress = () => {
    isPlaying ? player.pause() : player.play();
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
      style={{ marginBottom: 12 }}
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
    // 上端と下端の余白も PDF に合わせて調整
    paddingTop: 8,
    paddingBottom: 16,
  },
  separator: {
    height: 0, // アイテム間の間隔
  },
  loading: {
    height: 58,
    marginBottom: 0, // 読み込み中インジケータの下マージンも同じに
  },
});

const footerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});