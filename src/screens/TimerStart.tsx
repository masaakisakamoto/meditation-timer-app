// src/screens/TimerStart.tsx
import React, { FC, useState, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootTabParamList, RootStackParamList } from '../../App';

import Header from '../components/Header/Header';
import AlarmTime from '../components/Body/TimerStart/AlarmTime';
import MyCource from '../components/Body/TimerStart/MyCource';
import Timer from '../components/Body/TimerStart/Timer';

import ModalPanel from '../components/ui/ModalPanel';
import { CourseContext } from '../context/CourseContext';
import type { Course } from '../context/CourseContext';
import { ConfigContext } from '../context/ConfigContext';
import type { MeditationType } from '../types/meditation';
import { orinList } from './TimerConfig';

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
  const [courseMeditationTypes, setCourseMeditationTypes] = useState<MeditationType[]>(
    [],
  );
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [showHowTo, setShowHowTo] = useState(false);

  /*─── ハンドラ ───*/
  const handleSelectCourse = (course: Course) => {
    setCourseTimes(course.times);
    setCourseMeditationTypes(course.meditationTypes ?? []);
    setSelectedCourseId(course.id);
    configCtx.setMode((course.mode ?? 'countup') as 'countup' | 'countdown');
    configCtx.setRingType(course.ringType ?? '4');
  };

  const handleDeleteCourse = (id: string) => {
    deleteCourse(id);
    if (id === selectedCourseId) {
      setCourseTimes([]);
      setCourseMeditationTypes([]);
      setSelectedCourseId('');
    }
  };

  const handleNavigateToStop = () => {
    if (!courseTimes.length) {
      Alert.alert('マイコースを選んでください');
      return;
    }
    navigation.navigate('TimerStop', {
      courseTimes,
      mode,
      ringType,
      meditationTypes: courseMeditationTypes,
    });
  };

  /*─── 画面 ───*/
  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="タイマー"
        rightElement={
          <Pressable
            onPress={() => setShowHowTo(true)}
            style={({ pressed }) => [styles.helpButton, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.helpButtonText}>使い方</Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.body}>
        {/* ① 円形タイマー＋読経ボタン */}
        <Timer
          time="00:00:00"
          running={false}
          onToggle={handleNavigateToStop}
          isReading={readingOn} // ← グローバルから
          toggleReading={toggleReading} // ← グローバル setter
          hasSelectedCourse={courseTimes.length > 0}
          mode={mode}
          orinImage={(orinList.find((o) => o.id === ringType) ?? orinList[0]).image}
        />

        {/* ② アラーム時間 */}
        <AlarmTime
          times={courseTimes}
          meditationTypes={courseMeditationTypes}
          showSelectCourseMessage={courses.length > 0 && !courseTimes.some((t) => t > 0)}
        />

        {/* ③ マイコース一覧 */}
        <MyCource
          courses={courses}
          orins={orinList}
          selectedId={selectedCourseId}
          onSelect={handleSelectCourse}
          onDelete={handleDeleteCourse}
        />
      </ScrollView>
      <Modal
        visible={showHowTo}
        animationType="fade"
        transparent
        onRequestClose={() => setShowHowTo(false)}
      >
        <ModalPanel title="タイマー開始の流れ" onClose={() => setShowHowTo(false)}>
          <View style={styles.howToSection}>
            <Text style={styles.howToLabel}>経典読み上げ ON</Text>
            <Text style={styles.howToText}>
              経典読み上げ → おりん終了後にタイマー開始
            </Text>
          </View>
          <View style={styles.howToSection}>
            <Text style={styles.howToLabel}>経典読み上げ OFF</Text>
            <Text style={styles.howToText}>おりん終了後にタイマー開始</Text>
          </View>
        </ModalPanel>
      </Modal>
    </SafeAreaView>
  );
};

export default TimerStart;

/* --- styles --- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#e0eef9' },
  body: { paddingVertical: 20, alignItems: 'center' },
  helpButton: {
    padding: 6,
  },
  helpButtonText: {
    fontSize: 15,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#fff',
  },
  howToSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 6,
  },
  howToLabel: {
    fontSize: 14,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#6b7280',
  },
  howToText: {
    fontSize: 16,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#000',
    lineHeight: 24,
  },
});
