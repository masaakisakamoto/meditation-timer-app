// src/components/Body/TimerConfig/Timer.tsx
import React, { FC } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
// SVG をコンポーネントとして読み込む
import TimerBackground from '../../../../assets/TimerBackGround.svg';

interface Props {
  /** アラーム時間を "分" で受け取る */
  times: number[];
  topLabel?: string;
  mainLabel?: string;
}

const TimerConfigDisplay: FC<Props> = ({ times, topLabel, mainLabel }) => {
  return (
    <SafeAreaView style={styles.wrapper}>
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
                  <Text style={styles.timeText}>{String(t).padStart(2, '0')}</Text>
                  <Text style={styles.unitText}>分</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
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
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  timerValue: {
    fontSize: 22,
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
