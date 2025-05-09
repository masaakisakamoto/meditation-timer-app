// src/screens/TimerConfig.tsx
import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../App';

import { FooterCommon } from '../components/FooterCommon';
import { OrinButton } from '../components/OrinButton';

// ダミー画像
import OverLayOrin from '../components/OverlayOrin';
import dummyImg from '../../assets/0002-1.png';

// おりんリスト
const orinList = [
  { id: 'horin', name: 'Hおりん', image: dummyImg, sound: require('../mp3/horin.mp3') },
  { id: 'norin', name: 'Nおりん', image: dummyImg, sound: require('../mp3/norin.mp3') },
  { id: 'dairin', name: '大りん', image: dummyImg, sound: require('../mp3/senkyoujidairin.mp3') },
];

interface Course {
  id: string;
  times: number[];
  label: string;
}

type Props = BottomTabScreenProps<RootTabParamList, 'TimerConfig'>;

export const TimerConfig: FC<Props> = ({ navigation }) => {
  const [newTime, setNewTime] = useState('');
  const [alarmTimes, setAlarmTimes] = useState<number[]>([]);
  const [mode, setMode] = useState<'countdown' | 'countup'>('countdown');
  const [selectedOrin, setSelectedOrin] = useState(orinList[0]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showOrinModal, setShowOrinModal] = useState(false);

  const loadCourses = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem('myCourses');
      if (json) setCourses(JSON.parse(json));
    } catch {
      Alert.alert('エラー', 'マイコースの読み込みに失敗しました');
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const saveCourses = async (newCourses: Course[]) => {
    await AsyncStorage.setItem('myCourses', JSON.stringify(newCourses));
  };

  const addAlarm = () => {
    const n = parseInt(newTime, 10);
    if (!n || n <= 0) {
      Alert.alert('無効な時間', '正の整数を入力してください');
      return;
    }
    if (alarmTimes.length >= 3) {
      Alert.alert('エラー', 'アラームは３つまでです');
      return;
    }
    setAlarmTimes(prev => [...prev, n]);
    setNewTime('');
  };

  const resetAll = () => setAlarmTimes([]);

  const saveMyCourse = () => {
    if (alarmTimes.length === 0) {
      Alert.alert('エラー', 'アラームを設定してください');
      return;
    }
    if (courses.length >= 3) {
      Alert.alert('エラー', 'マイコースは３つまでです');
      return;
    }
    const label = alarmTimes.map(t => `${t}分`).join(' ');
    const newCourse: Course = {
      id: `c-${Date.now()}`,
      times: [...alarmTimes],
      label,
    };
    const updated = [...courses, newCourse];
    setCourses(updated);
    saveCourses(updated);
    Alert.alert('保存完了', label);
  };

  const applyCourse = (c: Course) => setAlarmTimes(c.times);
  const deleteCourse = (id: string) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    saveCourses(updated);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.modeRow}>
          {(['countdown', 'countup'] as const).map(m => (
            <TouchableOpacity
              key={m}
              style={[
                styles.modeBtn,
                mode === m ? styles.modeActive : styles.modeInactive,
              ]}
              onPress={() => setMode(m)}
            >
              <Text style={styles.modeText}>
                {m === 'countdown' ? 'カウントダウン' : 'カウントアップ'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="分を入力"
            keyboardType="numeric"
            value={newTime}
            onChangeText={setNewTime}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addAlarm}>
            <Text style={styles.btnText}>アラーム設定</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetBtn} onPress={resetAll}>
            <Text style={styles.btnText}>リセット</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>現在のアラーム</Text>
          <View style={styles.listRow}>
            {alarmTimes.map((t, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.listText}>{t}分</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.orinRow}>
          <OrinButton
            typeLabel={selectedOrin.name}
            onPress={() => setShowOrinModal(true)}
          />
        </View>

        <Modal
          visible={showOrinModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowOrinModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* 選択中のおりんをプレビュー */}
              <OverLayOrin
                name={selectedOrin.name}
                icon={selectedOrin.image}
              />
              {/* リストで切り替え */}
              <FlatList
                data={orinList}
                keyExtractor={i => i.id}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.orinItem}
                    onPress={() => {
                      setSelectedOrin(item);
                    }}
                  >
                    <Image source={item.image} style={styles.orinImage} />
                    <Text style={styles.orinName}>{item.name}</Text>
                  </Pressable>
                )}
              />
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowOrinModal(false)}
              >
                <Text style={styles.btnText}>閉じる</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.saveBtn} onPress={saveMyCourse}>
          <Text style={styles.btnText}>マイコースとして保存</Text>
        </TouchableOpacity>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>マイコース一覧</Text>
          {courses.map(c => (
            <View key={c.id} style={styles.courseRow}>
              <TouchableOpacity
                style={styles.courseBtn}
                onPress={() => applyCourse(c)}
              >
                <Text style={styles.listText}>{c.label}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.delBtn}
                onPress={() => deleteCourse(c.id)}
              >
                <Text style={styles.delText}>削除</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <FooterCommon
        onPressTimer={() => navigation.navigate('TimerStart')}
        onPressConfig={() => navigation.navigate('TimerConfig')}
        onPressSutta={() => navigation.navigate('TimerSutta')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#e0eef9' },
  body: { padding: 16 },
  modeRow: { flexDirection: 'row', marginBottom: 12 },
  modeBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modeActive: { backgroundColor: '#cceeff' },
  modeInactive: { backgroundColor: '#e0e0e0' },
  modeText: { fontSize: 16, fontWeight: '500' },

  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    textAlign: 'center',
  },
  addBtn: { padding: 10, backgroundColor: '#fad179', borderRadius: 8, marginRight: 8 },
  resetBtn: { padding: 10, backgroundColor: '#dcdedd', borderRadius: 8 },

  btnText: { fontSize: 16, fontWeight: '500', textAlign: 'center' },

  listSection: { marginVertical: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  listRow: { flexDirection: 'row', flexWrap: 'wrap' },
  listItem: { backgroundColor: '#fff', padding: 8, borderRadius: 8, margin: 4 },
  listText: { fontSize: 16 },

  orinRow: { alignItems: 'center', marginVertical: 16 },
  saveBtn: {
    padding: 12,
    backgroundColor: '#f9c04c',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },

  courseRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  courseBtn: { flex: 1, backgroundColor: '#fcdfa5', padding: 8, borderRadius: 8 },
  delBtn: { padding: 8, backgroundColor: '#f8d7da', borderRadius: 8, marginLeft: 8 },
  delText: { color: '#721c24' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { width: '80%', maxHeight: '70%', backgroundColor: '#fff', borderRadius: 8, padding: 16 },
  orinItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  orinImage: { width: 32, height: 32, marginRight: 12 },
  orinName: { fontSize: 16 },
  closeBtn: { marginTop: 12, backgroundColor: '#dcdedd', padding: 10, borderRadius: 8 },
});
