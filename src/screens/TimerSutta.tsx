// src/screens/TimerSutta.tsx
import React, { FC, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

// フッター共通ナビコンポーネント
import { FooterWrapper } from   '../components/FooterWrapper'

// 色違いコンポーネント
import { Component as SuttaComponent } from '../components/Component'
import { PauseMizu } from '../components/PauseMizu'

type SuttaItem = {
  id: string
  title: string
  subtitle: string
  file: any
}

type Props = NativeStackScreenProps<any, 'TimerSutta'>

export const TimerSutta: FC<Props> = ({ navigation }) => {

  const suttas: SuttaItem[] = [
    {
      id: '1',
      title: '諸仏の教え',
      subtitle: '(Dhammapada Nos. 183-185)',
      file: require('../suttas/buddhanasasana.mp3'),
    },
    {
      id: '2',
      title: '仏法僧（三宝）の徳の偈文',
      subtitle: 'Tisaraṇa Vandanā',
      file: require('../suttas/0003buddhavandana.mp3'),
    },
    {
      id: '3',
      title: '三宝に帰依するための偈文〔日夜の想い〕',
      subtitle: 'Namami Ca Buddham',
      file: require('../suttas/0004namami.mp3'),
    },
    // ... 他の経典も同様に追加してください ...
  ]

  const navigate = (tab: 'timer' | 'config' | 'sutta') => {
    if (tab === 'timer') navigation.navigate('TimerStart')
    else if (tab === 'config') navigation.navigate('TimerConfig')
    else navigation.navigate('TimerSutta')
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerText}>パーリ語日常読誦経典</Text>
      </View>

      {/* 経典リスト */}
      <FlatList
        data={suttas}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <SuttaRow item={item} />}
        contentContainerStyle={styles.list}
      />

      {/* フッター */}
      <FooterWrapper
        current="sutta"
        onNavigate={(tab: 'timer' | 'config' | 'sutta') => {
          if (tab === 'timer') navigation.navigate('TimerStart')
          else if (tab === 'config') navigation.navigate('TimerConfig')
          else navigation.navigate('TimerSutta')
        }}
      />
    </SafeAreaView>
  )
}

// ————— 小コンポーネント —————

const SuttaRow: FC<{ item: SuttaItem }> = ({ item }) => {
  const player = useAudioPlayer(item.file)
  const status = useAudioPlayerStatus(player)
  const isPlaying = status.playing
  const loading = status.isBuffering || !status.isLoaded

  // 再生／一時停止トグル
  const onPress = () => {
    if (isPlaying) player.pause()
    else           player.play()
  }

  // 再生中であれば PauseMizu、停止中であれば SuttaComponent
  const RowComponent = isPlaying ? PauseMizu : SuttaComponent

  return (
    <View style={styles.item}>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={onPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <RowComponent
            one={!isPlaying}
            saiseiIcon={require('../../assets/SaiseiIcon.png')}
            title={item.title}
            subtitle={item.subtitle}
            style={styles.component}
          />
        )}
      </TouchableOpacity>
    </View>
  )
}

// ————— Styles —————

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#90c0e6',
  },
  header: {
    height: 76,
    backgroundColor: '#9fcaec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  item: {
    flexDirection: 'row',
    borderRadius: 15,
    marginBottom: 10,
    height: 72,
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  textGroup: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  btn: {
    width: 58,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  component: {
    width: 58,
    height: 58,
  },
})

export default TimerSutta
