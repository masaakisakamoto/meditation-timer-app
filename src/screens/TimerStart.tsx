// src/screens/TimerStart.tsx
import React, { FC, useState, useEffect, ReactNode } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../App';

import { FooterCommon } from '../components/FooterCommon';

interface SectionProps {
  title: string;
  children: ReactNode;
}

type Props = BottomTabScreenProps<RootTabParamList, 'TimerStart'>;

export const TimerStart: FC<Props> = ({ navigation }) => {
  const [elapsedSec, setElapsedSec] = useState<number | null>(null);
  const [isReading, setIsReading]   = useState(false);
  const [alarmTimes] = useState<number[]>([5, 10, 15]);
  const [myCourses]  = useState<number[][]>([
    [5, 10, 15],
    [1, 5, 10],
  ]);

  const toggleReading = () => setIsReading(r => !r);
  const handleStartReset = () => {
    if (elapsedSec === null) setElapsedSec(0);
    else setElapsedSec(null);
  };

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    if (elapsedSec !== null) {
      id = setInterval(() => {
        setElapsedSec(s => (s === null ? 0 : s + 1));
      }, 1000);
    }
    return () => clearInterval(id);
  }, [elapsedSec]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const t = s % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${t.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timer</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Pressable style={styles.diary}>
          <Text style={styles.diaryText}>日記</Text>
        </Pressable>

        <View style={styles.timerBox}>
          <View style={styles.circle}>
            <Text style={styles.timerText}>
              {elapsedSec !== null ? fmt(elapsedSec) : '00:00:00'}
            </Text>
            <Pressable style={styles.startBtn} onPress={handleStartReset}>
              <Image
                source={require('../../assets/Polygon-1.png')}
                style={styles.startIcon}
              />
            </Pressable>
          </View>

          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.toggleBtn, isReading ? styles.onBg : styles.offBg]}
              onPress={toggleReading}
            >
              <Image
                source={require('../../assets/game-icons-speaker-3.png')}
                style={styles.toggleIcon}
              />
              <Text style={styles.toggleText}>
                {`経典読み上げ ${isReading ? 'ON' : 'OFF'}`}
              </Text>
            </Pressable>
          </View>
        </View>

        <Section title="アラーム時間">
          <View style={styles.row}>
            {alarmTimes.map((t, i) => (
              <Text key={i} style={styles.alarmTime}>
                {t.toString().padStart(2, '0')}
              </Text>
            ))}
          </View>
        </Section>

        <Section title="マイコース">
          {myCourses.map((course, idx) => (
            <View key={idx} style={styles.courseItem}>
              <Text style={styles.courseTime}>{course.join(' ')} 分</Text>
              <Pressable style={styles.delBtn}>
                <Text style={styles.delText}>削除</Text>
              </Pressable>
            </View>
          ))}
        </Section>
      </ScrollView>

      <FooterCommon
        onPressTimer={() => navigation.navigate('TimerStart')}
        onPressConfig={() => navigation.navigate('TimerConfig')}
        onPressSutta={() => navigation.navigate('TimerSutta')}
      />
    </SafeAreaView>
  );
};

const Section: FC<SectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.secTitle}>{title}</Text>
    {children}
  </View>
);

const { width } = Dimensions.get('window');
const CIRCLE = width * 0.8;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#e0eef9' },
  header: {
    height: 60,
    backgroundColor: '#9fcaec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 32, fontWeight: '500' },

  body: { paddingVertical: 20, alignItems: 'center' },

  diary: {
    position: 'absolute',
    top: 26,
    right: 16,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  diaryText: { fontSize: 16 },

  timerBox: { alignItems: 'center', marginTop: 100 },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: { fontSize: 72, fontWeight: '400' },
  startBtn: {
    position: 'absolute',
    bottom: 30,
    width: 170,
    height: 52,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#f8cd71',
    backgroundColor: '#fff79a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startIcon: { width: 24, height: 24 },

  toggleRow: { flexDirection: 'row', marginTop: 20 },
  toggleBtn: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  onBg: { backgroundColor: '#feef94' },
  offBg: { backgroundColor: '#dcdedd' },
  toggleIcon: { width: 24, height: 24, marginRight: 8 },
  toggleText: { fontSize: 16, fontWeight: '500' },

  section: { width: '90%', marginTop: 40 },
  secTitle: { fontSize: 20, fontWeight: '500', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  alarmTime: { fontSize: 32, fontWeight: '500' },

  courseItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  courseTime: { flex: 1, fontSize: 20, fontWeight: '500' },
  delBtn: { padding: 8, backgroundColor: '#f8d7da', borderRadius: 8 },
  delText: { color: '#721c24' },
});
