// src/components/Body/TimerStop/TimerControls.tsx
import React, { FC, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Image } from 'react-native';
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

// Pick sizes that fit well
const ICON_SIZE_PAUSE = 100;

// 再生ボタン（TimerStart/startCircle）と共通の円スタイル定数
const CIRCLE_BG = '#fff79a';
const CIRCLE_BORDER = '#f8cd71';
const ICON_SIZE_STOP = 48;

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

  return (
    <Animated.View style={styles.container}>
      <Animated.View
        style={[
          styles.fillContainer,
          { opacity: breathOpacity, transform: [{ scale: breathScale }] },
        ]}
      >
        <TimerBackgroundB width="100%" height="100%" style={styles.background} />
        <View style={styles.circleBase} pointerEvents="none" />

        <View style={styles.contentArea}>
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

        <View style={styles.controls}>
          <View style={styles.controlsRow}>
            <Pressable onPress={onTogglePause} style={styles.pauseButton}>
              <PauseIcon width={ICON_SIZE_PAUSE} height={ICON_SIZE_PAUSE} />
            </Pressable>

            <Pressable
              onPress={onStop}
              style={({ pressed }) => [
                styles.stopButton,
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
            >
              <StopIcon width={ICON_SIZE_STOP} height={ICON_SIZE_STOP} />
            </Pressable>
          </View>
          {metaMode != null && metaOrinImage != null && (
            <View style={styles.subtleTag}>
              <Text style={styles.subtleTagText}>
                {metaMode === 'countup' ? '▲' : '▼'}
              </Text>
              <Image source={metaOrinImage} style={styles.subtleTagOrin} />
            </View>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default TimerControls;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 287,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  fillContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  circleBase: {
    position: 'absolute',
    top: 0,
    width: 287,
    height: 287,
    borderRadius: 143.5,
    backgroundColor: CIRCLE_BG,
    borderWidth: 3,
    borderColor: CIRCLE_BORDER,
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  timeText: {
    alignSelf: 'stretch',
    textAlign: 'center',
    fontSize: 60,
    fontFamily: 'DidactGothic-Regular',
    color: '#000',
    marginTop: 60,
  },
  controls: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    opacity: 0.6,
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
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
  pauseButton: {
    marginHorizontal: -20,
  },
  stopButton: {
    marginHorizontal: -10,
  },
  preparingMessage: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 6,
  },
  preparingText: {
    fontSize: 15,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  countdownBlock: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 4,
  },
  countdownText: {
    fontSize: 72,
    fontFamily: 'DidactGothic-Regular',
    color: '#000',
    textAlign: 'center',
  },
  countdownLabel: {
    fontSize: 14,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#666',
    textAlign: 'center',
  },
});
