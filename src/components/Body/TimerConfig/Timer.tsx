// src/components/Body/TimerConfig/Timer.tsx
import React, { FC, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Animated } from 'react-native';
// SVG をコンポーネントとして読み込む
import TimerBackground from '../../../../assets/TimerBackGround.svg';

interface Props {
  /** アラーム時間を "分" で受け取る */
  times: number[];
  topLabel?: string;
  mainLabel?: string;
}

const TimerConfigDisplay: FC<Props> = ({ times, topLabel, mainLabel }) => {
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
    <SafeAreaView style={styles.wrapper}>
      <Animated.View
        style={[
          styles.animatedContainer,
          { opacity: breathOpacity, transform: [{ scale: breathScale }] },
        ]}
      >
        {/* 背景SVG */}
        <TimerBackground
          width="100%"
          height={styles.background.height}
          style={styles.background}
        />

        {/* 背景の上に見出し＋リストを重ねる */}
        <View style={styles.content}>
          {topLabel && mainLabel ? (
            <View style={styles.centerBlock}>
              <Text style={styles.timerLabel}>{topLabel}</Text>
              <Text style={styles.timerValue}>{mainLabel}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.header}>アラーム時間</Text>
              <View style={styles.timesList}>
                {times.map((t, i) => (
                  <View key={i} style={styles.timeItem}>
                    <Text style={styles.timeText}>
                      {t > 0 && t < 1
                        ? String(Math.round(t * 60))
                        : String(t).padStart(2, '0')}
                    </Text>
                    <Text style={styles.unitText}>{t > 0 && t < 1 ? '秒' : '分'}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default TimerConfigDisplay;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    // background の高さ分だけ余白を確保
    height: 200,
    position: 'relative',
  },
  animatedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 200,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 200, // 背景SVG の実際の高さに合わせる
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    paddingTop: 16,
    alignItems: 'center',
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 20,
    color: '#6b7280',
    textAlign: 'center',
  },
  timerValue: {
    fontSize: 34,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#374151',
    textAlign: 'center',
  },
  header: {
    fontSize: 18,
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#000',
    marginTop: 8,
    marginBottom: 0,
  },
  timesList: {
    width: '100%',
    alignItems: 'center',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  timeText: {
    fontSize: 24,
    fontFamily: 'DidactGothic-Regular',
    marginRight: 4,
  },
  unitText: {
    fontSize: 16,
    fontFamily: 'ZenMaruGothic-Medium',
    fontWeight: '500',
    marginBottom: 6,
  },
});
