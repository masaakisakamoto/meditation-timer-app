// src/components/Body/TimerStart/AlarmTime.tsx
import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  times: number[];
};

const AlarmTime: FC<Props> = ({ times }) => {
  // always three entries
  const display = [
    times[0] ?? 0,
    times[1] ?? 0,
    times[2] ?? 0,
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>アラーム時間</Text>
      <View style={styles.container}>
        {display.map((t, i) => (
          <View key={i} style={styles.timeBox}>
            <Text style={styles.timeText}>{String(t).padStart(2, '0')}</Text>
            <Text style={styles.unitText}>分</Text>
          </View>
        ))}
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
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 40,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 32,
    fontWeight: '500',
    fontFamily: 'ZenMaruGothic-Medium',
    marginRight: 4,
  },
  unitText: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'ZenMaruGothic-Medium',
    marginBottom: 4,
  },
});
