// src/components/Body/TimerStop/Timer.tsx
import React, { FC, useEffect, useRef } from 'react';
import { Alert, Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import TimerBackgroundB from '../../../../assets/TimerBackGroundB.svg';
import PauseIcon from '../../../../assets/PauseButton.svg';
import StopIcon from '../../../../assets/StopButton.svg';

export type PreparePhase = 'reading' | 'orin' | 'running';

export type TimerControlsProps = {
  time: string;
  isPlaying: boolean;
  onTogglePause: () => void;
  onStop: () => void;
  preparePhase?: PreparePhase;
  orinCountdown?: number | null;
  metaMode?: 'countup' | 'countdown';
  metaOrinImage?: number;
};

// ── サイズ定数 ────────────────────────────────────────────────
const CIRCLE_SIZE = 287;
const CIRCLE_BG = '#fff9b8'; // TimerStart の再生ボタンと共通
const CIRCLE_BORDER = '#f8cd71';
const ICON_SIZE_PAUSE = 130;
const ICON_SIZE_STOP = 62;

// 数字を円の中心基準でどれだけ上に置くか（正 = 上方向）
const TIME_CENTER_OFFSET = 30;

const TimerControls: FC<TimerControlsProps> = ({
  time,
  isPlaying,
  onTogglePause,
  onStop,
  preparePhase = 'running',
  orinCountdown = null,
  metaMode,
  metaOrinImage,
}) => {
  const breathOpacity = useRef(new Animated.Value(1)).current;
  const breathScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const makeLoop = (value: Animated.Value, toValue: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue, duration: 2200, useNativeDriver: true }),
          Animated.timing(value, { toValue: 1, duration: 2200, useNativeDriver: true }),
        ]),
      );
    makeLoop(breathOpacity, 0.9).start();
    makeLoop(breathScale, 0.97).start();
  }, [breathOpacity, breathScale]);

  const handleStop = () => {
    Alert.alert('瞑想を終了しますか？', '', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '終了する', style: 'destructive', onPress: onStop },
    ]);
  };

  return (
    <Animated.View style={styles.container}>
      <Animated.View
        style={[
          styles.fillContainer,
          { opacity: breathOpacity, transform: [{ scale: breathScale }] },
        ]}
      >
        {/* 背景 SVG */}
        <TimerBackgroundB width="100%" height="100%" style={styles.background} />

        {/* 黄色円の実体（absolute, flex レイアウトに影響しない） */}
        <View style={styles.circleBase} pointerEvents="none" />

        {/*
         * timeOverlay
         * ・円と同サイズの absolute レイヤー
         * ・ここだけで数字の縦位置を決める（ボタンに依存しない）
         * ・pointerEvents="none" でボタンのタップを通過させる
         */}
        <View
          style={[
            styles.timeOverlay,
            // orin フェーズだけカウントダウンをボタン直上に配置する
            preparePhase === 'orin' && (orinCountdown ?? 0) > 0 && styles.timeOverlayOrin,
          ]}
          pointerEvents="none"
        >
          {preparePhase === 'orin' && (orinCountdown ?? 0) > 0 ? (
            <View style={styles.countdownBlock}>
              <Text style={styles.countdownText}>{orinCountdown}</Text>
              <Text style={styles.countdownLabel}>おりん終了後に開始</Text>
            </View>
          ) : preparePhase === 'reading' ? (
            <View style={styles.preparingMessage}>
              <Text style={styles.preparingText}>経典を読み上げています…</Text>
              <Text style={styles.preparingText}>おりん終了後にタイマーが始まります</Text>
            </View>
          ) : (
            <Text style={styles.timeText}>{time}</Text>
          )}
        </View>

        {/*
         * bottomContent
         * ・Pause / Stop ボタンとおりんタグを下側に固定するレイヤー
         * ・timeOverlay と独立しているのでサイズ変更の影響を受けない
         */}
        <View style={styles.bottomContent}>
          <View style={styles.controlsSection}>
            <Pressable onPress={onTogglePause}>
              <PauseIcon width={ICON_SIZE_PAUSE} height={ICON_SIZE_PAUSE} />
            </Pressable>
            <Pressable
              onPress={handleStop}
              style={({ pressed }) => [styles.stopButton, pressed && { opacity: 0.55 }]}
            >
              <StopIcon width={ICON_SIZE_STOP} height={ICON_SIZE_STOP} />
            </Pressable>
          </View>
          <View style={styles.bellSection}>
            {metaMode != null && metaOrinImage != null && (
              <View style={styles.subtleTag}>
                <Text style={styles.subtleTagText}>
                  {metaMode === 'countup' ? '▲' : '▼'}
                </Text>
                <Image source={metaOrinImage} style={styles.subtleTagOrin} />
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default TimerControls;

const styles = StyleSheet.create({
  // ── 外枠コンテナ ───────────────────────────────────────────
  container: {
    width: '100%',
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  // absolute で container を覆う。
  // alignItems:'center' が absolute 子要素（circleBase / timeOverlay / bottomContent）を
  // 水平中央に整列させる。
  fillContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // ── 黄色円 ────────────────────────────────────────────────
  circleBase: {
    position: 'absolute',
    top: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: CIRCLE_BG,
    borderWidth: 3,
    borderColor: CIRCLE_BORDER,
  },

  // ── 数字 overlay ──────────────────────────────────────────
  // 円と同サイズ。中心から TIME_CENTER_OFFSET 分上に表示する。
  // paddingTop = CIRCLE_SIZE/2 - contentHeight/2 - TIME_CENTER_OFFSET
  //            ≈ 143.5 - 33 - 30 = 80.5 → 80
  timeOverlay: {
    position: 'absolute',
    top: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    paddingTop: 80,
  },
  // orin フェーズ専用の上書きスタイル。
  // paddingBottom ≈ bottomContent 高さ(177) + gap(5) = 182
  // available = 287 - 0 - 182 = 105px にカウントダウンブロック(≈94px)を収める。
  timeOverlayOrin: {
    paddingTop: 0,
    justifyContent: 'flex-end',
    paddingBottom: 182,
  },
  timeText: {
    textAlign: 'center',
    fontSize: 56,
    lineHeight: 66,
    fontFamily: 'DidactGothic-Regular',
    color: '#111111',
  },
  countdownBlock: {
    alignItems: 'center',
    gap: 4,
  },
  countdownText: {
    fontSize: 60,
    lineHeight: 70,
    fontFamily: 'DidactGothic-Regular',
    color: '#111111',
    textAlign: 'center',
  },
  countdownLabel: {
    fontSize: 14,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#666',
    textAlign: 'center',
  },
  preparingMessage: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
  },
  preparingText: {
    fontSize: 15,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── ボタン + タグ ─────────────────────────────────────────
  // absolute で下端に固定。timeOverlay と完全に独立。
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    width: CIRCLE_SIZE,
    alignItems: 'center',
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  stopButton: {
    opacity: 0.68,
  },
  bellSection: {
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 4,
  },
  subtleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    opacity: 0.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  subtleTagText: {
    fontSize: 14,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#666',
  },
  subtleTagOrin: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    borderRadius: 10,
  },
});
