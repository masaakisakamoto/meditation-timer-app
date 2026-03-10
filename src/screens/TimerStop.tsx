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
import { SafeAreaView, ScrollView, StyleSheet, AppState, Image } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Notifications from 'expo-notifications';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Header from '../components/Header/Header';
import Timer from '../components/Body/TimerStop/Timer';
import PhaseProgressBar from '../components/feature/timer/PhaseProgressBar';
import CurrentMeditationCard from '../components/feature/timer/CurrentMeditationCard';
import type { MeditationType } from '../types/meditation';
import { RootStackParamList } from '../../App';
import { ConfigContext } from '../context/ConfigContext';
import { orinList } from './TimerConfig';
import type { Orin } from '../components/feature/timer/OrinPickerModal';

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
  const { courseTimes, meditationTypes: paramMeditationTypes } = route.params;
  const meditationTypes = paramMeditationTypes ?? ([] as MeditationType[]);
  const { config } = useContext(ConfigContext)!;
  const { mode, ringType, readingOn, keepAwakeOn } = config;

  // コンポーネントのマウント状態を追跡
  const isMountedRef = useRef(true);

  // ✅ タイマー開始時刻（ms）を保持（JSが止まっても復元するための基準）
  const startAtMsRef = useRef<number | null>(null);

  // 終了通知管理
  const notificationIdsRef = useRef<string[]>([]); // スケジュール済み通知IDの配列
  const endsAtRef = useRef<number | null>(null); // 最終区切りの絶対時刻(ms)・AppState復帰判定用
  const isPlayingRef = useRef(false); // AppStateハンドラ内でのstale防止

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
  // 開始前シーケンス（経典/おりん再生）中のフラグ
  const [isPreparingSequence, setIsPreparingSequence] = useState(false);

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
    firedSegmentsRef.current = new Set<number>();
    if (isPlaying) {
      setNextIdx(0);
    }
  }, [isPlaying]);

  // isPlayingRef を最新値に同期（AppStateハンドラのクロージャ対策）
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // 発火済み区切りインデックスを管理する Set（通知による誤上書きを防ぐ）
  const firedSegmentsRef = useRef(new Set<number>());
  // バックグラウンド中フラグ: 非 active 遷移でセット、syncFromNowWithoutBell 完了でリセット
  // catch-up より先に bell effect が走っても鐘を抑止するためのガード
  const wasBackgroundedRef = useRef(false);

  /* ---------- 区切り・終了通知スケジュール管理 ---------- */
  useEffect(() => {
    if (!isPlaying) {
      // 停止・一時停止: 全通知キャンセル＆endsAtクリア
      endsAtRef.current = null;
      const ids = notificationIdsRef.current;
      if (ids.length > 0) {
        ids.forEach((id) =>
          Notifications.cancelScheduledNotificationAsync(id).catch(() => {}),
        );
        notificationIdsRef.current = [];
      }
      return;
    }

    // 再生開始: startAtMsRef は直前の useEffect で確定済み
    const startAt = startAtMsRef.current;
    if (startAt == null) return;

    // 最終区切りの絶対時刻をAppState復帰判定用に保存
    endsAtRef.current = startAt + totalSec * 1000;

    // 既存の通知があれば先にキャンセル（重複防止）
    const prevIds = notificationIdsRef.current;
    if (prevIds.length > 0) {
      prevIds.forEach((id) =>
        Notifications.cancelScheduledNotificationAsync(id).catch(() => {}),
      );
      notificationIdsRef.current = [];
    }

    const now = Date.now();
    const total = cumulativeSecs.length;

    // このeffectで作成したID群（cleanup用のローカル配列）
    const scheduledIds: string[] = [];
    let cancelled = false;

    // cumulativeSecs の各区切りに通知をスケジュール
    const promises = cumulativeSecs.map((segSec, idx) => {
      const triggerAt = startAt + segSec * 1000;
      if (triggerAt <= now) return Promise.resolve(); // 過去はスキップ

      const isFinal = idx === total - 1;
      return Notifications.scheduleNotificationAsync({
        content: {
          title: isFinal ? '瞑想タイマー終了' : '区切り終了',
          body: isFinal ? '瞑想が完了しました' : `${idx + 1}/${total} セット完了`,
          sound: true,
          data: { segmentIndex: idx },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(triggerAt),
        },
      }).then((id) => {
        if (!cancelled) {
          scheduledIds.push(id);
          notificationIdsRef.current.push(id);
        } else {
          // cleanup 後に resolve した場合: ref には書かず即キャンセル
          Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
        }
      });
    });

    Promise.all(promises).catch((e) => console.error('通知スケジュール失敗:', e));

    return () => {
      cancelled = true;
      if (scheduledIds.length > 0) {
        scheduledIds.forEach((id) =>
          Notifications.cancelScheduledNotificationAsync(id).catch(() => {}),
        );
        // refからはこのeffectで作ったIDだけを除去（新サイクル分は残す）
        notificationIdsRef.current = notificationIdsRef.current.filter(
          (id) => !scheduledIds.includes(id),
        );
      }
      // then()未解決分は cancelled=true で then()側がキャンセル
    };
  }, [isPlaying, totalSec, cumulativeSecs]);

  /* ---------- 画面スリープ防止 ---------- */
  useEffect(() => {
    if ((isPlaying && keepAwakeOn) || isPreparingSequence) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
    return () => {
      deactivateKeepAwake();
    };
  }, [isPlaying, keepAwakeOn, isPreparingSequence]);

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

    // 経典の停止
    if (suttaStatus?.playing) {
      try {
        suttaPlayer.pause();
      } catch (error) {}
    }

    // 唱題の停止
    if (sangeStatus?.playing) {
      try {
        sangePlayer.pause();
      } catch (error) {}
    }

    // 開始時のおりんの停止
    if (orinStatus?.playing) {
      try {
        orinPlayer.pause();
      } catch (error) {}
    }

    // タイマー用のおりんプレイヤーを停止
    const timerPlayers = [firstBellPlayer, secondBellPlayer, thirdBellPlayer];
    for (const player of timerPlayers) {
      try {
        player.pause();
      } catch (error) {}
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
        isMountedRef.current = false;

        // 直接クリーンアップを実行（safeStopAudioの依存関係を避ける）
        try {
          suttaPlayer.pause();
        } catch (error) {}
        try {
          sangePlayer.pause();
        } catch (error) {}
        try {
          orinPlayer.pause();
        } catch (error) {}
        const timerPlayers = [firstBellPlayer, secondBellPlayer, thirdBellPlayer];
        for (const player of timerPlayers) {
          try {
            player.pause();
          } catch (error) {}
        }

        // スケジュール済み通知を全てキャンセル
        const notifIds = notificationIdsRef.current;
        if (notifIds.length > 0) {
          notifIds.forEach((id) =>
            Notifications.cancelScheduledNotificationAsync(id).catch(() => {}),
          );
          notificationIdsRef.current = [];
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

      setIsPreparingSequence(true);
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
        setIsPreparingSequence(false);
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
      !suttaStatus?.didJustFinish ||
      !isSuttaPlayerValid ||
      !isSangePlayerValid ||
      !isOrinPlayerValid ||
      !isMountedRef.current
    )
      return;

    // 経典が完全に終わるまで少し待つ
    const tid = setTimeout(() => {
      if (!isMountedRef.current || !isSangePlayerValid) return;

      try {
        sangePlayer.play();
      } catch (error) {
        console.error('Error playing sange:', error);
        setSangePlayerValid(false);
      }
    }, 1000);
    return () => clearTimeout(tid);
  }, [
    readingOn,
    suttaStatus?.didJustFinish,
    isSuttaPlayerValid,
    isSangePlayerValid,
    isOrinPlayerValid,
  ]);

  // 懴悔の再生状態を監視
  useEffect(() => {
    if (
      !readingOn ||
      !sangeStatus?.didJustFinish ||
      !isSangePlayerValid ||
      !isOrinPlayerValid ||
      !isMountedRef.current
    )
      return;

    // 懴悔が完全に終わるまで少し待つ
    let innerTid: ReturnType<typeof setTimeout> | null = null;
    const tid = setTimeout(() => {
      if (!isMountedRef.current || !isOrinPlayerValid) return;

      try {
        orinPlayer.pause(); // 一度停止してから再生
        innerTid = setTimeout(() => {
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
    return () => {
      clearTimeout(tid);
      if (innerTid !== null) clearTimeout(innerTid);
    };
  }, [readingOn, sangeStatus?.didJustFinish, isSangePlayerValid, isOrinPlayerValid]);

  // おりんの再生状態を監視
  useEffect(() => {
    if (!orinStatus?.didJustFinish || !isOrinPlayerValid || !isMountedRef.current) return;

    const tid = setTimeout(() => {
      if (isMountedRef.current) {
        setIsPreparingSequence(false);
        setPlaying(true);
      }
    }, 500);
    return () => clearTimeout(tid);
  }, [orinStatus?.didJustFinish, isOrinPlayerValid]);

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

  // ✅ バックグラウンド/画面離脱からの復帰時に sec・nextIdx・スキップフラグを同期する共通処理
  // AppState active と useFocusEffect の両経路から呼ばれる
  const syncFromNowWithoutBell = useCallback(() => {
    if (!isMountedRef.current) return;
    if (!isPlayingRef.current) return;

    // バックグラウンドでタイマーが終了していた場合: 鐘を鳴らさず finished 状態にするだけ
    // （通知がシステムで既に鳴動済みのため二重鳴動を防ぐ）
    if (endsAtRef.current !== null && Date.now() >= endsAtRef.current) {
      setSec(mode === 'countdown' ? 0 : totalSec);
      setNextIdx(cumulativeSecs.length);
      setPlaying(false);
      setIsFinished(true);
      return;
    }

    const next = computeSecFromNow();
    if (next == null) return;

    setSec(next);

    // ✅ 途中で時間が飛んだ時、次のおりん位置もズレないように合わせる（鳴らし漏れ防止）
    const elapsedSec = mode === 'countup' ? next : Math.max(0, totalSec - next);
    const nextIndex = cumulativeSecs.findIndex((t) => t > elapsedSec);
    const resolvedNextIdx = nextIndex === -1 ? cumulativeSecs.length : nextIndex;
    setNextIdx(resolvedNextIdx);

    // バックグラウンド中に経過した区切りをスキップ済みとしてマーク（catch-up 鳴動防止）
    let anyNewlySkipped = false;
    for (let i = 0; i < resolvedNextIdx; i++) {
      if (!firedSegmentsRef.current.has(i)) {
        firedSegmentsRef.current.add(i);
        anyNewlySkipped = true;
      }
    }
    // catch-up 完了: bell effect のガードを解除
    wasBackgroundedRef.current = false;
  }, [computeSecFromNow, mode, totalSec, cumulativeSecs]);

  // ✅ AppState active 経路（通常のバックグラウンド復帰）
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        // background/inactive 遷移: bell effect ガードをセット
        wasBackgroundedRef.current = true;
        return;
      }
      syncFromNowWithoutBell();
    });
    return () => sub.remove();
  }, [syncFromNowWithoutBell]);

  // ✅ 画面フォーカス経路（ロック解除→ホームからアプリを開く場合など AppState が発火しない経路）
  useFocusEffect(
    useCallback(() => {
      syncFromNowWithoutBell();
    }, [syncFromNowWithoutBell]),
  );

  // 通知タップでアプリ復帰した場合: タップされた区切りまでを発火済みとしてマーク
  // （syncFromNowWithoutBell も走るが、こちらで先に Set に入れておく）
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown>;
      const rawIndex = data?.segmentIndex;
      if (typeof rawIndex === 'number' && rawIndex >= 0) {
        for (let i = 0; i <= rawIndex; i++) {
          firedSegmentsRef.current.add(i);
        }
      }
    });
    return () => sub.remove();
  }, []);

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
    // バックグラウンド復帰の catch-up が完了するまで bell 処理を抑止
    if (wasBackgroundedRef.current) return;
    const elapsedSec = mode === 'countup' ? sec : totalSec - sec;

    // 次のおりんのタイミングに達したかチェック（未発火インデックスのみ鳴らす）
    if (elapsedSec >= cumulativeSecs[nextIdx] && !firedSegmentsRef.current.has(nextIdx)) {
      firedSegmentsRef.current.add(nextIdx);
      const nextIndex = cumulativeSecs.findIndex((t) => t > elapsedSec);
      const resolvedNextIdx = nextIndex === -1 ? cumulativeSecs.length : nextIndex;
      setNextIdx(resolvedNextIdx);
      playTimerBell(nextIdx);
    }

    // タイマー終了判定
    if ((mode === 'countup' && sec >= totalSec) || (mode === 'countdown' && sec <= 0)) {
      setPlaying(false);
    }
  }, [sec, mode, totalSec, cumulativeSecs, nextIdx, isPlaying, playTimerBell]);

  /* ---------- フェーズ表示用 ---------- */
  const currentPhaseIdx = Math.min(nextIdx, Math.max(0, meditationTypes.length - 1));

  /* ---------- 表示文字列 ---------- */
  const displayTime = new Date(sec * 1000).toISOString().substring(11, 19);

  /* おりん残り秒数（準備中かつおりん再生中かつ duration 確定済みの場合のみ） */
  const orinCountdown =
    isPreparingSequence &&
    (orinStatus?.playing ?? false) &&
    (orinStatus?.duration ?? 0) > 0
      ? Math.max(0, Math.ceil(orinStatus!.duration - orinStatus!.currentTime))
      : null;

  /* 準備フェーズ: isPreparingSequence の遅延を吸収し、再生中の状態を明示 */
  const preparePhase: 'reading' | 'orin' | 'running' = !isPreparingSequence
    ? 'running'
    : (orinStatus?.playing ?? false)
      ? 'orin'
      : readingOn && ((suttaStatus?.playing ?? false) || (sangeStatus?.playing ?? false))
        ? 'reading'
        : 'running'; // おりん終了〜isPreparingSequence解除の間もrunningとして扱う

  /* ---------- UI ---------- */
  return (
    <SafeAreaView style={styles.container}>
      <Header title="タイマー" />
      <ScrollView contentContainerStyle={styles.body}>
        {meditationTypes.length > 1 && (
          <PhaseProgressBar total={meditationTypes.length} currentIdx={nextIdx} />
        )}
        <Timer
          time={displayTime}
          isPlaying={isPlaying}
          preparePhase={preparePhase}
          orinCountdown={orinCountdown}
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
        <CurrentMeditationCard
          meditationTypes={meditationTypes}
          currentIdx={currentPhaseIdx}
        />
        {/* mode▲/▼ + おりん補助行 */}
        <View style={styles.subtleRow}>
          <Text style={styles.subtleMeta}>{mode === 'countup' ? '▲' : '▼'}</Text>
          <Image source={selectedOrin.image} style={styles.subtleOrin} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0eef9' },
  body: { paddingVertical: 20, alignItems: 'center' },
  subtleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    opacity: 0.5,
  },
  subtleMeta: {
    fontSize: 14,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#666',
  },
  subtleOrin: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    borderRadius: 10,
  },
});

export default TimerStop;
