// src/components/Body/TimerStart/AlarmTime.tsx
import React, { FC } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { orinList } from '../../../screens/TimerConfig';

type Props = {
  times: number[];
  mode: string;
  ringType: string;
  showSelectCourseMessage?: boolean;
};

const AlarmTime: FC<Props> = ({ times, mode, ringType, showSelectCourseMessage }) => {
  const display = [times[0] ?? 0, times[1] ?? 0, times[2] ?? 0];
  const hasAnyTime = display.some((t) => t > 0);
  const orin = orinList.find((o) => o.id === ringType) ?? orinList[0];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>アラーム時間</Text>
      <View style={styles.container}>
        {showSelectCourseMessage ? (
          <Text style={styles.guidanceText}>マイコースを選択してください</Text>
        ) : (
          <>
            <View style={[styles.timesBlock, !hasAnyTime && styles.timesBlockCentered]}>
              <Text style={styles.timesText}>
                {display
                  .map((t) => (t > 0 && t < 1 ? `${Math.round(t * 60)}秒` : `${t}分`))
                  .join('　')}
              </Text>
            </View>
            {hasAnyTime && (
              <View style={styles.metaBlock}>
                <Text style={styles.modeArrow}>{mode === 'countup' ? '▲' : '▼'}</Text>
                <Image source={orin.image} style={styles.orinThumb} />
              </View>
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  metaBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeArrow: {
    fontSize: 20,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#666',
  },
  orinThumb: {
    width: 28,
    height: 28,
    resizeMode: 'cover',
    borderRadius: 14,
  },
});
