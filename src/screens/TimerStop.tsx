// src/screens/TimerStop.tsx
import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
  useRef,
} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, AppState } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import type { AudioPlayer, AudioStatus } from 'expo-audio';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Header from '../components/Header/Header';
import AlermTime from '../components/Body/TimerStop/AlermTime';
import Timer from '../components/Body/TimerStop/Timer';
import { RootStackParamList } from '../../App';
import { ConfigContext } from '../context/ConfigContext';
import { orinList } from './TimerConfig';
import type { Orin } from '../components/Body/TimerConfig/OverlayOrin';

type Props = NativeStackScreenProps<RootStackParamList, 'TimerStop'>;

/* -------------------------------------------------- */
/** AudioPlayer を再生し、再生完了まで待つ */
const playAndWait = (player: AudioPlayer) =>
  new Promise<void>((resolve) => {
    let hasStarted = false;
    const sub = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      if (!hasStarted && status.playing) {
        hasStarted = true;
      }
      if (hasStarted && !status.playing) {
        sub.remove(); // 監視解除
        resolve(); // Promise 完了
      }
    });
    player.play(); // 再生スタート
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
  const { config } = useContext(ConfigContext)!;
  const { mode, ringType, readingOn } = config;

  // コンポーネントのマウント状態を追跡
  const isMountedRef = useRef(true);

  // ✅ タイマー開始時刻（ms）を保持（JSが止まっても復元するための基準）
  const startAtMsRef = useRef<number | null>(null);

  /* ---------- 時間計算 ---------- */
  const cumulativeSecs = useMemo(
    () =>
      courseTimes
        .map((m) => m * 60) // 分を秒に変換
        .reduce<number[]>((acc, sec, i) => {
          // 累積時間を計算 (例: [60, 120, 180])
          acc.push((i === 0 ? 0 : acc[i - 1]) + sec);
          return acc;
        }, []),
    [courseTimes],
  );
  const totalSec = cumulativeSecs.at(-1) ?? 0;

  const clampSec = useCallback(
    (value: number) => {
      if (mode === 'countup') return Math.max(0, value);
      return Math.max(0, Math.min(totalSec, value));
    },
    [mode, totalSec],
  );

  const computeSecFromNow = useCallback(() => {
    const startAt = startAtMsRef.current;
    if (startAt == null) return null;

    const elapsedSec = Math.floor((Date.now() - startAt) / 1000);

    if (mode === 'countup') {
      return clampSec(elapsedSec);
    }

    // countdown
    return clampSec(totalSec - elapsedSec);
  }, [clampSec, mode, totalSec]);

  /* ---------- カウント状態 ---------- */
  const [sec, setSec] = useState(mode === 'countup' ? 0 : totalSec);
  const [isPlaying, setPlaying] = useState(false);
  const [nextIdx, setNextIdx] = useState(0);

  // ✅ 再生開始した瞬間に「開始時刻」を確定
  useEffect(() => {
    if (!isPlaying) return;
    if (startAtMsRef.current != null) return;

    // もしsecが途中状態なら、そこから逆算して開始時刻を作る（復帰に強い）
    const alreadyElapsed = mode === 'countup' ? sec : Math.max(0, totalSec - sec);

    startAtMsRef.current = Date.now() - alreadyElapsed * 1000;
  }, [isPlaying, mode, sec, totalSec]);

  // ✅ 停止したら開始時刻をリセット（次回スタート時のズレ防止）
  useEffect(() => {
    if (isPlaying) return;
    startAtMsRef.current = null;
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      console.log('Timer started, resetting nextIdx to 0');
      setNextIdx(0);
    }
  }, [isPlaying]);

  /* ---------- サウンド ---------- */
  // 選択されたおりんの音声ファイルを取得
  const selectedOrin = orinList.find((o: Orin) => o.id === ringType) ?? orinList[0];
  const orinSound = selectedOrin.sound;

  // 音声プレイヤーの設定
  const suttaPlayer = useAudioPlayer(
    readingOn ? require('../../assets/suttas/0001tisarana.mp3') : null,
  );
  const suttaStatus = useAudioPlayerStatus(suttaPlayer);

  const sangePlayer = useAudioPlayer(
    readingOn ? require('../../assets/suttas/0002sange.mp3') : null,
  );
  const sangeStatus = useAudioPlayerStatus(sangePlayer);

  // 開始時のおりん
  const orinPlayer = useAudioPlayer(orinSound);
  const orinStatus = useAudioPlayerStatus(orinPlayer);

  // タイマー区切り用のおりんプレイヤー（3つ用意）
  const firstBellPlayer = useAudioPlayer(orinSound);
  const secondBellPlayer = useAudioPlayer(orinSound);
  const thirdBellPlayer = useAudioPlayer(orinSound);

  // プレイヤーの有効性を追跡
  const [isOrinPlayerValid, setOrinPlayerValid] = useState(true);
  const [isSuttaPlayerValid, setSuttaPlayerValid] = useState(true);
  const [isSangePlayerValid, setSangePlayerValid] = useState(true);

  // 安全に音声を停止する関数
  const safeStopAudio = useCallback(() => {
    if (!isMountedRef.current) return;

    console.log('Attempting to stop audio players');

    // 経典の停止
    if (suttaStatus?.playing) {
      try {
        suttaPlayer.pause();
      } catch (error) {
        console.log('Sutra player already released');
      }
    }

    // 唱題の停止
    if (sangeStatus?.playing) {
      try {
        sangePlayer.pause();
      } catch (error) {
        console.log('Sange player already released');
      }
    }

    // 開始時のおりんの停止
    if (orinStatus?.playing) {
      try {
        orinPlayer.pause();
      } catch (error) {
        console.log('Orin player already released');
      }
    }

    // タイマー用のおりんプレイヤーを停止
    const timerPlayers = [firstBellPlayer, secondBellPlayer, thirdBellPlayer];
    for (const player of timerPlayers) {
      try {
        player.pause();
      } catch (error) {
        console.log('Timer bell player already released');
      }
    }

    // プレイヤーの状態を無効化
    setOrinPlayerValid(false);
    setSuttaPlayerValid(false);
    setSangePlayerValid(false);
  }, [suttaStatus, orinStatus, sangeStatus]);

  // コンポーネントのアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (isMountedRef.current) {
        console.log('Component unmounting, cleaning up');
        isMountedRef.current = false;

        // 直接クリーンアップを実行（safeStopAudioの依存関係を避ける）
        try {
          suttaPlayer.pause();
        } catch (error) {
          console.log('Sutra player already released during unmount');
        }
        try {
          sangePlayer.pause();
        } catch (error) {
          console.log('Sange player already released during unmount');
        }
        try {
          orinPlayer.pause();
        } catch (error) {
          console.log('Orin player already released during unmount');
        }
        const timerPlayers = [firstBellPlayer, secondBellPlayer, thirdBellPlayer];
        for (const player of timerPlayers) {
          try {
            player.pause();
          } catch (error) {
            console.log('Timer bell player already released during unmount');
          }
        }
      }
    };
  }, []);

  /* ---------- 起動シーケンス ---------- */
  useEffect(() => {
    if (!isMountedRef.current) return;

    let isActive = true;

    const startSequence = () => {
      if (!isMountedRef.current || !isActive) return;

      if (readingOn && isSuttaPlayerValid) {
        try {
          suttaPlayer.play();
        } catch (error) {
          console.error('Error playing sutra:', error);
          setSuttaPlayerValid(false);
        }
      } else if (isOrinPlayerValid) {
        try {
          orinPlayer.play();
        } catch (error) {
          console.error('Error playing bell:', error);
          setOrinPlayerValid(false);
        }
      }
    };

    startSequence();

    return () => {
      isActive = false;
      if (isMountedRef.current) {
        if (isSuttaPlayerValid) {
          try {
            suttaPlayer.pause();
          } catch (error) {}
          setSuttaPlayerValid(false);
        }
        if (isSangePlayerValid) {
          try {
            sangePlayer.pause();
          } catch (error) {}
          setSangePlayerValid(false);
        }
        if (isOrinPlayerValid) {
          try {
            orinPlayer.pause();
          } catch (error) {}
          setOrinPlayerValid(false);
        }
      }
    };
  }, []);

  // 経典の再生状態を監視
  useEffect(() => {
    if (
      !readingOn ||
      !suttaStatus ||
      !isSuttaPlayerValid ||
      !isSangePlayerValid ||
      !isOrinPlayerValid ||
      !isMountedRef.current
    )
      return;

    if (suttaStatus.didJustFinish) {
      // 経典が完全に終わるまで少し待つ
      setTimeout(() => {
        if (!isMountedRef.current || !isSangePlayerValid) return;

        try {
          sangePlayer.play();
        } catch (error) {
          console.error('Error playing sange:', error);
          setSangePlayerValid(false);
        }
      }, 1000);
    }
  }, [suttaStatus, isSuttaPlayerValid, isSangePlayerValid, isOrinPlayerValid]);

  // 懴悔の再生状態を監視
  useEffect(() => {
    if (
      !readingOn ||
      !sangeStatus ||
      !isSangePlayerValid ||
      !isOrinPlayerValid ||
      !isMountedRef.current
    )
      return;

    if (sangeStatus.didJustFinish) {
      // 懴悔が完全に終わるまで少し待つ
      setTimeout(() => {
        if (!isMountedRef.current || !isOrinPlayerValid) return;

        try {
          orinPlayer.pause(); // 一度停止してから再生
          setTimeout(() => {
            if (!isMountedRef.current || !isOrinPlayerValid) return;
            try {
              orinPlayer.play();
            } catch (error) {
              console.error('Error playing bell after sange:', error);
              setOrinPlayerValid(false);
            }
          }, 100);
        } catch (error) {
          console.error('Error pausing bell:', error);
          setOrinPlayerValid(false);
        }
      }, 1000);
    }
  }, [sangeStatus, isSangePlayerValid, isOrinPlayerValid]);

  // おりんの再生状態を監視
  useEffect(() => {
    if (!orinStatus || !isOrinPlayerValid || !isMountedRef.current) return;

    if (orinStatus.didJustFinish) {
      setTimeout(() => {
        if (isMountedRef.current) {
          setPlaying(true);
        }
      }, 500);
    }
  }, [orinStatus, isOrinPlayerValid]);

  useEffect(() => {
    if (!isPlaying || !isMountedRef.current) return;

    const id = setInterval(() => {
      if (!isMountedRef.current) return;

      const next = computeSecFromNow();
      if (next == null) return;

      setSec(next);
    }, 1000);

    return () => clearInterval(id);
  }, [isPlaying, computeSecFromNow]);

  // ✅ スリープ/バックグラウンド復帰で即座にsecを再計算
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      if (!isMountedRef.current) return;

      const next = computeSecFromNow();
      if (next == null) return;

      setSec(next);

      // ✅ 途中で時間が飛んだ時、次のおりん位置もズレないように合わせる（鳴らし漏れ防止）
      const elapsedSec = mode === 'countup' ? next : Math.max(0, totalSec - next);
      const nextIndex = cumulativeSecs.findIndex((t) => t > elapsedSec);
      setNextIdx(nextIndex === -1 ? cumulativeSecs.length : nextIndex);
    });

    return () => sub.remove();
  }, [computeSecFromNow, mode, totalSec, cumulativeSecs]);

  /* ---------- タイマー区切りのおりん再生 ---------- */
  const playTimerBell = useCallback(
    (index: number) => {
      if (!isMountedRef.current) return;

      try {
        // インデックスに応じたプレイヤーを選択
        const player =
          index === 0
            ? firstBellPlayer
            : index === 1
              ? secondBellPlayer
              : thirdBellPlayer;

        // 一度停止してから再生（確実に再生するため）
        player.pause();
        setTimeout(() => {
          if (isMountedRef.current) {
            try {
              player.play();
            } catch (error) {
              console.error(`Error playing timer bell ${index + 1}:`, error);
            }
          }
        }, 50);
      } catch (error) {
        console.error(`Error preparing timer bell ${index + 1}:`, error);
      }
    },
    [firstBellPlayer, secondBellPlayer, thirdBellPlayer],
  );

  /* ---------- カウント中のおりん再生判定 ---------- */
  useEffect(() => {
    if (!isPlaying || nextIdx >= cumulativeSecs.length || !isMountedRef.current) return;
    const elapsedSec = mode === 'countup' ? sec : totalSec - sec;

    // 次のおりんのタイミングに達したかチェック
    if (elapsedSec >= cumulativeSecs[nextIdx]) {
      playTimerBell(nextIdx);
      setNextIdx((prev) => {
        const newIdx = prev + 1;
        return newIdx;
      });
    }

    // タイマー終了判定
    if ((mode === 'countup' && sec >= totalSec) || (mode === 'countdown' && sec <= 0)) {
      setPlaying(false);
    }
  }, [sec, mode, totalSec, cumulativeSecs, nextIdx, isPlaying, playTimerBell]);

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
          onTogglePause={() => {
            setPlaying((p) => !p);
          }}
          onStop={() => {
            // まずタイマーを停止
            setPlaying(false);
            // 音声を停止してから画面遷移
            safeStopAudio();
            // 少し待ってから画面遷移
            setTimeout(() => {
              if (isMountedRef.current) {
                navigation.goBack();
              }
            }, 100);
          }}
        />
        <AlermTime
          times={[courseTimes[0] ?? 0, courseTimes[1] ?? 0, courseTimes[2] ?? 0]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0eef9' },
  body: { paddingVertical: 20, alignItems: 'center' },
});

export default TimerStop;
