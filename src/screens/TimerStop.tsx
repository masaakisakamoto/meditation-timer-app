// src/screens/TimerStop.tsx
import React, { FC, useState, useEffect, useMemo, useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import type { AudioPlayer, AudioStatus } from 'expo-audio';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Header     from '../components/Header/Header';
import AlermTime  from '../components/Body/TimerStop/AlermTime';
import Timer      from '../components/Body/TimerStop/Timer';
import { RootStackParamList } from '../../App';
import { ConfigContext }      from '../context/ConfigContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TimerStop'>;

/* -------------------------------------------------- */
/** AudioPlayer を再生し、再生完了まで待つ */
const playAndWait = (player: AudioPlayer) =>
  new Promise<void>(resolve => {
    let hasStarted = false;
    const sub = player.addListener(
      'playbackStatusUpdate',
      (status: AudioStatus) => {
        if (!hasStarted && status.playing) {
          hasStarted = true;
        }
        if (hasStarted && !status.playing) {
          sub.remove();          // 監視解除
          resolve();             // Promise 完了
        }
      }
    );
    player.play();               // 再生スタート
  });

/** おりんを鳴らす */
const playBell = async (player: AudioPlayer) => {
  try {
    await player.play();
  } catch (error) {
    console.error('Bell play error:', error);
  }
};

export const TimerStop: FC<Props> = ({ route, navigation }) => {
  const { courseTimes } = route.params;
  const { config }      = useContext(ConfigContext)!;
  const { mode, ringType, readingOn } = config;

  /* ---------- 時間計算 ---------- */
  const cumulativeSecs = useMemo(
    () =>
      courseTimes
        .map(m => m * 60)
        .reduce<number[]>((a, s, i) => {
          a.push((i ? a[i - 1] : 0) + s);
          return a;
        }, []),
    [courseTimes]
  );
  const totalSec = cumulativeSecs.at(-1) ?? 0;

  /* ---------- カウント状態 ---------- */
  const [sec, setSec]         = useState(mode === 'countup' ? 0 : totalSec);
  const [isPlaying, setPlaying] = useState(false);
  const [nextIdx, setNextIdx] = useState(0);

  useEffect(() => {
    // タイマー開始時に nextIdx をリセット
    if (isPlaying) {
      setNextIdx(0);
    }
  }, [isPlaying]);

  /* ---------- サウンド ---------- */
  const orinAssets: Record<string, any> = {
    '1':  require('../../assets/mp3/horin.mp3'),
    '2':  require('../../assets/mp3/norin.mp3'),
    '3':  require('../../assets/mp3/senkyoujityurin.mp3'),
    '4':  require('../../assets/mp3/senkyoujidairin.mp3'),
    '5':  require('../../assets/mp3/orin_housenji.m4a'),
    '6':  require('../../assets/mp3/senkyoujiorin1.mp3'),
    '7':  require('../../assets/mp3/senkyoujiorin2.mp3'),
    '8':  require('../../assets/mp3/senkyoujiorin3.mp3'),
    '9':  require('../../assets/mp3/senkyoujiorin4.mp3'),
    '10': require('../../assets/mp3/鐘1_20241110_173133.m4a'),
  };

  // 各タイミング用の個別のプレイヤー
  const startOrinPlayer = useAudioPlayer(orinAssets[ringType]);
  const firstOrinPlayer = useAudioPlayer(orinAssets[ringType]);
  const secondOrinPlayer = useAudioPlayer(orinAssets[ringType]);
  const thirdOrinPlayer = useAudioPlayer(orinAssets[ringType]);
  const suttaPlayer = useAudioPlayer(
    readingOn ? require('../../assets/suttas/0001tisarana.mp3') : null
  );

  /* ---------- 起動シーケンス ---------- */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (readingOn) {
          await playAndWait(suttaPlayer);   // 読経
          if (!alive) return;
        }
        if (alive) {
          await playAndWait(startOrinPlayer);      // おりん（1回だけ）
          if (!alive) return;
          setPlaying(true);                   // タイマー開始
        }
      } catch (e) {
        setPlaying(true);                   // エラー時でも進行
      }
    })();

    return () => { alive = false };
  }, []);

  /* ---------- 1 秒ごとカウント ---------- */
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setSec(p => (mode === 'countup' ? p + 1 : p - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, mode]);

  /* ---------- おりん & 終了判定 ---------- */
  useEffect(() => {
    // カウントアップの場合はそのままの秒数、カウントダウンの場合は経過秒数を計算
    const elapsedSec = mode === 'countup' ? sec : totalSec - sec;

    // 次のおりんのタイミングに達したかチェック
    if (nextIdx < cumulativeSecs.length && elapsedSec >= cumulativeSecs[nextIdx]) {
      // インデックスに応じたプレイヤーを選択
      const currentPlayer = nextIdx === 0 ? firstOrinPlayer :
                          nextIdx === 1 ? secondOrinPlayer :
                                        thirdOrinPlayer;

      // おりんを鳴らす
      try {
        currentPlayer.play();
        const newNextIdx = nextIdx + 1;
        setNextIdx(newNextIdx);
      } catch (error) {
        console.error('Bell play error:', error);
      }
    }

    if (
      (mode === 'countup' && sec >= totalSec) ||
      (mode === 'countdown' && sec <= 0)
    ) {
      setPlaying(false);
    }
  }, [sec, nextIdx, mode, totalSec, cumulativeSecs, firstOrinPlayer, secondOrinPlayer, thirdOrinPlayer]);

  // 再生状態の監視
  useEffect(() => {
    const subscription = startOrinPlayer.addListener(
      'playbackStatusUpdate',
      (status) => {
        if (status.didJustFinish) {
          startOrinPlayer.play();
          startOrinPlayer.pause();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [startOrinPlayer]);

  /* ---------- 表示文字列 ---------- */
  const displayTime = new Date(sec * 1000).toISOString().substring(11, 19);

  /* ---------- UI ---------- */
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Timer" />
      <ScrollView contentContainerStyle={styles.body}>
        <Timer
          time={displayTime}
          isPlaying={isPlaying}
          onTogglePause={() => setPlaying(p => !p)}
          onStop={() => navigation.goBack()}
        />
        <AlermTime times={[
          courseTimes[0] ?? 0,
          courseTimes[1] ?? 0,
          courseTimes[2] ?? 0,
        ]}/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0eef9' },
  body:      { paddingVertical: 20, alignItems: 'center' },
});

export default TimerStop;
