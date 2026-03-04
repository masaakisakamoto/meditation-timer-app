// src/screens/TimerStart.tsx
import React, { FC, useState, useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Alert } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootTabParamList, RootStackParamList } from '../../App';

import Header from '../components/Header/Header';
import AlarmTime from '../components/Body/TimerStart/AlarmTime';
import MyCource from '../components/Body/TimerStart/MyCource';
import Timer from '../components/Body/TimerStart/Timer';

import { CourseContext } from '../context/CourseContext';
import { ConfigContext } from '../context/ConfigContext';

/* --- 型 --- */
type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'TimerStart'>,
  NativeStackNavigationProp<RootStackParamList, 'TimerStop'>
>;

export const TimerStart: FC = () => {
  const navigation = useNavigation<Nav>();

  /*─── グローバル state 取得 ───*/
  const { courses, deleteCourse } = useContext(CourseContext)!;

  const configCtx = useContext(ConfigContext)!;
  const { config, toggleReading } = configCtx;
  const { mode, ringType, readingOn } = config; // ← readingOn を直接参照

  /*─── ローカル state ───*/
  const [courseTimes, setCourseTimes] = useState<number[]>([]);

  /*─── ハンドラ ───*/
  const handleSelectCourse = (times: number[]) => setCourseTimes(times);

  const handleDeleteCourse = (id: string) => {
    deleteCourse(id);
    if (courseTimes.length && courses.find((c) => c.id === id)?.times === courseTimes) {
      setCourseTimes([]);
    }
  };

  const handleNavigateToStop = () => {
    if (!courseTimes.length) {
      Alert.alert('エラー', 'まずマイコースを選択してください');
      return;
    }
    navigation.navigate('TimerStop', { courseTimes, mode, ringType });
  };

  /*─── 画面 ───*/
  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Timer" />

      <ScrollView contentContainerStyle={styles.body}>
        {/* ① 円形タイマー＋読経ボタン */}
        <Timer
          time="00:00:00"
          running={false}
          onToggle={handleNavigateToStop}
          isReading={readingOn} // ← グローバルから
          toggleReading={toggleReading} // ← グローバル setter
        />

        {/* ② アラーム時間 */}
        <AlarmTime times={courseTimes} />

        {/* ③ マイコース一覧 */}
        <MyCource
          courses={courses}
          onSelect={handleSelectCourse}
          onDelete={handleDeleteCourse}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TimerStart;

/* --- styles --- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#e0eef9' },
  body: { paddingVertical: 20, alignItems: 'center' },
});
