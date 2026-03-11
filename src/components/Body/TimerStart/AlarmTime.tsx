// src/components/Body/TimerStart/AlarmTime.tsx
import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { MeditationType } from '../../../types/meditation';
import { MEDITATION_EMOJI } from '../../../types/meditation';

type Props = {
  times: number[];
  showSelectCourseMessage?: boolean;
  meditationTypes?: MeditationType[];
};

const AlarmTime: FC<Props> = ({ times, showSelectCourseMessage, meditationTypes }) => {
  const display = [times[0] ?? 0, times[1] ?? 0, times[2] ?? 0];
  const hasAnyTime = display.some((t) => t > 0);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>アラーム時間</Text>
      <View style={styles.container}>
        {showSelectCourseMessage ? (
          <Text style={styles.guidanceText}>マイコースを選択してください</Text>
        ) : (
          <>
            <View style={[styles.timesBlock, !hasAnyTime && styles.timesBlockCentered]}>
              <Text
                style={styles.timesText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                {display
                  .map((t, i) => {
                    const emoji = MEDITATION_EMOJI[meditationTypes?.[i] ?? 'none'];
                    const timeStr = t > 0 && t < 1 ? `${Math.round(t * 60)}秒` : `${t}分`;
                    return emoji ? `${emoji} ${timeStr}` : timeStr;
                  })
                  .join('　')}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default AlarmTime;

const styles = StyleSheet.create({
  wrapper: {
    width: '95%',
    paddingHorizontal: 18,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'ZenMaruGothic-Medium',
    marginBottom: 0,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  timesBlock: {
    flex: 1,
  },
  timesBlockCentered: {
    alignItems: 'center',
  },
  timesText: {
    fontSize: 26,
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#000',
  },
  guidanceText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
});
