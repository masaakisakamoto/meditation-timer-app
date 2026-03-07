import React, { FC, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  View,
  Image,
  Text,
  Animated,
} from 'react-native';
import TimerBackground from '../../../../assets/TimerBackGround.svg';
import SuttaTrue from '../../../../assets/SuttaTrue.svg';
import SuttaFalse from '../../../../assets/SuttaFalse.svg';
const Polygon1 = require('../../../../assets/Polygon-1.png');

interface TimerProps {
  time: string;
  running: boolean;
  onToggle: () => void;
  isReading: boolean;
  toggleReading: () => void;
}

const TimerStartDisplay: FC<TimerProps> = ({
  time,
  onToggle,
  isReading,
  toggleReading,
}) => {
  const breathOpacity = useRef(new Animated.Value(1)).current;
  const breathScale = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

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

  const handleStart = () => {
    Animated.sequence([
      Animated.timing(pressScale, {
        toValue: 1.03,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pressScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => onToggle());
  };

  return (
    <SafeAreaView style={styles.timer}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: breathOpacity,
            transform: [{ scale: breathScale }, { scale: pressScale }],
          },
        ]}
      >
        <TimerBackground width="100%" height="100%" style={styles.timerBackground} />

        {/* スタート／リセット ボタン */}
        <Pressable style={styles.startButton} onPress={handleStart}>
          <View style={styles.startCircle} />
          <Image source={Polygon1} style={styles.startIcon} />
        </Pressable>

        {/* 経典読み上げ SVG ボタン (SVGにテキスト＋アイコン含む) */}
        <Pressable
          style={[styles.readingButton, isReading ? styles.readingOn : styles.readingOff]}
          onPress={toggleReading}
        >
          {isReading ? (
            <SuttaTrue width="100%" height="100%" />
          ) : (
            <SuttaFalse width="100%" height="100%" />
          )}
        </Pressable>

        {/* 残り時間 */}
        <Text style={styles.timeText}>{time}</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default TimerStartDisplay;

const styles = StyleSheet.create({
  timer: { width: '75%', height: 280, position: 'relative' },
  animatedContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  timerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  startButton: {
    position: 'absolute',
    top: '70%',
    left: '26%',
    width: '47%',
    height: '13%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startCircle: {
    position: 'absolute',
    top: '-8.6%',
    left: '-1.8%',
    right: '-1.8%',
    bottom: '-6.6%',
    backgroundColor: '#fff79a',
    borderWidth: 3,
    borderColor: '#f8cd71',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  startIcon: { width: 31, height: 25, resizeMode: 'contain' },
  readingButton: {
    position: 'absolute',
    top: '18%',
    left: '26%',
    width: '47%',
    height: '14%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 横位置は同じなので、On/Off の左右オフセットは不要に
  readingOn: {},
  readingOff: {},
  readingCircleOn: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#feef94',
    borderRadius: 24,
  },
  readingCircleOff: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#dcdedd',
    borderRadius: 24,
  },
  readingText: {
    position: 'absolute',
    top: '24%',
    left: '31%',
    fontFamily: 'ZenMaruGothic-Medium',
    fontWeight: '500',
    fontSize: 17,
    color: '#000',
  },
  speakerIcon: {
    position: 'absolute',
  },
  timeText: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'DidactGothic-Regular',
    fontSize: 60,
    color: '#000',
  },
});
