// src/components/Body/TimerConfig/AlermTime.tsx
import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  /** アラーム時間を分単位で３つ並べて渡す */
  times: [number, number, number];
};

const AlermTime: FC<Props> = ({ times }) => {
  return (
    <View style={styles.container}>
      {/* 背景フォーム */}
      <View style={styles.background} />

      {/* 「分」ラベル＋数字を横並び */}
      <View style={styles.row}>
        {times.map((t, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.value}>
              {t > 0 && t < 1 ? String(Math.round(t * 60)) : String(t).padStart(2, '0')}
            </Text>
            <Text style={styles.unit}>{t > 0 && t < 1 ? '秒' : '分'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AlermTime;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 16,
    alignItems: 'center',
  },
  background: {
    width: '80%',
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 15,
    position: 'absolute',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around', // ← space-between → space-around
    width: '80%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: 8, // ← アイテム間に余白
  },
  value: {
    fontSize: 32,
    fontWeight: '500',
    fontFamily: 'ZenMaruGothic-Medium',
    marginRight: 4,
  },
  unit: {
    fontSize: 22,
    marginBottom: 4,
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#797878',
  },
});
