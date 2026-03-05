// src/components/Body/TimerStop/TimerControls.tsx
import React, { FC } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
}) => (
  <View style={styles.container}>
    <TimerBackgroundB width="100%" height="100%" style={styles.background} />

    <Text style={styles.timeText}>{time}</Text>

    <View style={styles.controls}>
      <Pressable onPress={onTogglePause} style={styles.pauseButton}>
        <PauseIcon width={ICON_SIZE_PAUSE} height={ICON_SIZE_PAUSE} />
      </Pressable>

      <Pressable onPress={onStop} style={styles.stopButton}>
        <StopIcon width={ICON_SIZE_STOP} height={ICON_SIZE_STOP} />
      </Pressable>
    </View>
  </View>
);

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
