// src/components/Body/TimerStop/TimerControls.tsx
import React, { FC, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import TimerBackgroundB from '../../../../assets/TimerBackGroundB.svg';
import PauseIcon from '../../../../assets/PauseButton.svg';
import StopIcon from '../../../../assets/StopButton.svg';

export type TimerControlsProps = {
  time: string;
  isPlaying: boolean;
  onTogglePause: () => void;
  onStop: () => void;
};

// Pick sizes that fit well
const ICON_SIZE_PAUSE = 128;
const ICON_SIZE_STOP = 48;

const TimerControls: FC<TimerControlsProps> = ({
  time,
  isPlaying,
  onTogglePause,
  onStop,
}) => {
  const breathOpacity = useRef(new Animated.Value(1)).current;
  const breathScale = useRef(new Animated.Value(1)).current;
  const stopPressScale = useRef(new Animated.Value(1)).current;
  const stopPressOpacity = useRef(new Animated.Value(1)).current;

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
    // ボタン押下演出 → onStop
    Animated.parallel([
      Animated.timing(stopPressScale, {
        toValue: 0.96,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(stopPressOpacity, {
        toValue: 0.75,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => onStop());
  };

  return (
    <Animated.View style={styles.container}>
      <Animated.View
        style={[
          styles.fillContainer,
          { opacity: breathOpacity, transform: [{ scale: breathScale }] },
        ]}
      >
        <TimerBackgroundB width="100%" height="100%" style={styles.background} />

        <Text style={styles.timeText}>{time}</Text>

        <View style={styles.controls}>
          <Pressable onPress={onTogglePause} style={styles.pauseButton}>
            <PauseIcon width={ICON_SIZE_PAUSE} height={ICON_SIZE_PAUSE} />
          </Pressable>

          <Pressable onPress={handleStop} style={styles.stopButton}>
            <Animated.View
              style={{
                transform: [{ scale: stopPressScale }],
                opacity: stopPressOpacity,
              }}
            >
              <StopIcon width={ICON_SIZE_STOP} height={ICON_SIZE_STOP} />
            </Animated.View>
          </Pressable>
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
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  timeText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 60,
    fontFamily: 'DidactGothic-Regular',
    color: '#000',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center', // center both buttons
    alignItems: 'center',
  },
  pauseButton: {
    marginHorizontal: -20,
  },
  stopButton: {
    marginHorizontal: -10,
  },
});
