// src/screens/TimerConfig.tsx
import React, { FC, useContext, useState, useMemo } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Modal,
  View,
  Text,
  Switch,
  Pressable,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAudioPlayer } from 'expo-audio';
import Svg, { Path } from 'react-native-svg';
import type { AudioPlayer } from 'expo-audio';

import { CourseContext } from '../context/CourseContext';
import { ConfigContext } from '../context/ConfigContext';
import type { MeditationType } from '../types/meditation';
import { RootStackParamList } from '../../App';

import Header from '../components/Header/Header';
import Timer from '../components/Body/TimerConfig/Timer';
import TimerModeToggle from '../components/Body/TimerConfig/TimerModeToggle';
import AlarmConfigSection from '../components/feature/timer/AlarmConfigSection';
import OrinButton from '../components/Body/TimerConfig/OrinButton';
import OrinPickerModal, {
  Orin as OrinType,
} from '../components/feature/timer/OrinPickerModal';
import ActionButtons from '../components/Body/TimerConfig/SaveButton'; // ← リセット+保存 を 1 つにまとめたもの
import ModalPanel from '../components/ui/ModalPanel';

/* ---------- props 型 ---------- */
type TimerConfigProps = { onFinished?: () => void }; // ★コールバックだけ受け取る

/* ---------- おりん一覧 ---------- */
import placeholderImg from '../../assets/0002-1.png';
export const orinList: OrinType[] = [
  {
    id: '4',
    name: 'おりん1',
    image: require('../../assets/IMG_2153.png'),
    sound: require('../../assets/mp3/senkyoujidairin.mp3'),
  },
  {
    id: '5',
    name: 'おりん2',
    image: require('../../assets/IMG_2154.png'),
    sound: require('../../assets/mp3/orin_housenji.m4a'),
  },
  {
    id: '6',
    name: 'おりん3',
    image: require('../../assets/IMG_2155.png'),
    sound: require('../../assets/mp3/senkyoujiorin1.mp3'),
  },
  {
    id: '8',
    name: 'おりん4',
    image: require('../../assets/IMG_2156.png'),
    sound: require('../../assets/mp3/senkyoujiorin3.mp3'),
  },
  {
    id: '9',
    name: 'おりん5',
    image: require('../../assets/IMG_2157.png'),
    sound: require('../../assets/mp3/senkyoujiorin4.mp3'),
  },
  {
    id: '10',
    name: 'おりん6',
    image: require('../../assets/おりん10.jpg'),
    sound: require('../../assets/mp3/kane1.mp3'),
  },
];

/* ==================================================================== */
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TimerConfig: FC<TimerConfigProps> = ({ onFinished }) => {
  /* -------- context -------- */
  const { addCourse } = useContext(CourseContext)!;
  const configCtx = useContext(ConfigContext)!;
  const navigation = useNavigation<NavigationProp>();

  /* -------- local state -------- */
  const [alarmTimes, setAlarmTimes] = useState<[number, number, number]>([0, 0, 0]);
  const [meditationTypes, setMeditationTypes] = useState<
    [MeditationType, MeditationType, MeditationType]
  >(['none', 'none', 'none']);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  /* -------- audio players -------- */
  // 各おりんに対して個別のAudioPlayerを作成
  const player4 = useAudioPlayer(orinList[0].sound); // id: '4'
  const player5 = useAudioPlayer(orinList[1].sound); // id: '5'
  const player6 = useAudioPlayer(orinList[2].sound); // id: '6'
  const player8 = useAudioPlayer(orinList[3].sound); // id: '8'
  const player9 = useAudioPlayer(orinList[4].sound); // id: '9'
  const player10 = useAudioPlayer(orinList[5].sound); // id: '10'

  // プレイヤーのマップを作成
  const players = useMemo(
    () =>
      ({
        '4': player4,
        '5': player5,
        '6': player6,
        '8': player8,
        '9': player9,
        '10': player10,
      }) as Record<string, AudioPlayer>,
    [player4, player5, player6, player8, player9, player10],
  );

  /* ringType に対応する初期おりんを決定 */
  const selectedOrin =
    orinList.find((o) => o.id === configCtx.config.ringType) ?? orinList[0];

  /* -------- handlers -------- */
  /** マイコースとして保存 */
  const handleSaveCourse = () => {
    if (alarmTimes[0] === 0) {
      Alert.alert('アラームを選んでください');
      return;
    }
    addCourse(
      alarmTimes,
      configCtx.config.mode,
      configCtx.config.ringType,
      meditationTypes,
    );
    onFinished?.();
    console.log('Course saved:', {
      times: alarmTimes,
      mode: configCtx.config.mode,
      ringType: configCtx.config.ringType,
      meditationTypes,
    });
  };

  /** アラーム時間を設定（0にしたら後続タイプもリセット） */
  const handleSetTime = (idx: number, min: number) => {
    setAlarmTimes((prev) => {
      const next = [...prev] as [number, number, number];
      next[idx] = min;
      if (min === 0) {
        for (let i = idx + 1; i < next.length; i++) next[i] = 0;
      }
      return next;
    });
    if (min === 0) {
      setMeditationTypes((prev) => {
        const t = [...prev] as [MeditationType, MeditationType, MeditationType];
        for (let i = idx; i < t.length; i++) t[i] = 'none';
        return t;
      });
    }
  };

  /** おりん選択時の処理 */
  const handleOrinSelect = async (orin: OrinType) => {
    try {
      // おりんを選択
      configCtx.setRingType(orin.id);
      console.log('Selected orin:', orin.name, 'with ID:', orin.id);

      // モーダルを閉じる
      setShowOverlay(false);

      // 他のおりんをすべて停止してから選択中のおりんを再生
      Object.values(players).forEach((p) => p?.pause?.());
      const player = players[orin.id];
      if (player) {
        player.seekTo(0);
        await player.play();
      }
    } catch (error) {
      console.error('Error playing orin:', error);
    }
  };

  /* -------- render -------- */
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="タイマー設定"
        rightElement={
          <Pressable
            onPress={() => setShowSettings(true)}
            style={({ pressed }) => [styles.settingsButton, pressed && { opacity: 0.6 }]}
          >
            <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96a7.26 7.26 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94L2.86 14.52a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58ZM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2Z"
                fill="#fff"
              />
            </Svg>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.body}>
        {/* 円形タイマー＋コース合計時間 */}
        <Timer
          times={alarmTimes}
          topLabel="瞑想時間"
          mainLabel={(() => {
            const total = alarmTimes.reduce((s, m) => s + m, 0);
            if (total === 0) return '0分';
            const secs = Math.round(total * 60);
            const m = Math.floor(secs / 60);
            const s = secs % 60;
            if (m === 0) return `${s}秒`;
            return s > 0 ? `${m}分${s}秒` : `${m}分`;
          })()}
        />

        {/* アラーム設定 */}
        <AlarmConfigSection
          times={alarmTimes}
          onSetTime={handleSetTime}
          meditationTypes={meditationTypes}
          onSetType={(idx, type) =>
            setMeditationTypes((prev) => {
              const t = [...prev] as [MeditationType, MeditationType, MeditationType];
              t[idx] = type;
              return t;
            })
          }
        />

        {/* カウント方向トグル */}
        <TimerModeToggle
          mode={configCtx.config.mode}
          onSelect={(m) => configCtx.setMode(m)}
        />

        {/* おりん選択 */}
        <OrinButton selected={selectedOrin} onPress={() => setShowOverlay(true)} />

        {/* リセット＋保存ボタン */}
        <ActionButtons
          onReset={() => {
            setAlarmTimes([0, 0, 0]);
            setMeditationTypes(['none', 'none', 'none']);
            configCtx.setMode('countup');
            configCtx.setRingType('4');
          }}
          onSave={handleSaveCourse}
        />
      </ScrollView>

      {/* アプリ設定モーダル */}
      <Modal
        visible={showSettings}
        animationType="fade"
        transparent
        onRequestClose={() => setShowSettings(false)}
      >
        <ModalPanel title="設定" onClose={() => setShowSettings(false)}>
          <Text style={styles.settingSection}>タイマー動作</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>タイマー中は画面をスリープさせない</Text>
            <Switch
              value={configCtx.config.keepAwakeOn}
              onValueChange={configCtx.toggleKeepAwake}
            />
          </View>
          <Text style={[styles.settingSection, { marginTop: 16 }]}>経典読み上げ</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingDescription}>
              {configCtx.config.readingOn
                ? '経典読み上げON選択中　おりん終了後にタイマー開始'
                : '経典読み上げOFF選択中　おりん終了後にタイマー開始'}
            </Text>
          </View>
        </ModalPanel>
      </Modal>

      {/* おりん一覧モーダル */}
      <Modal
        visible={showOverlay}
        animationType="fade"
        transparent
        onRequestClose={() => setShowOverlay(false)}
      >
        <OrinPickerModal
          orins={orinList}
          onSelect={handleOrinSelect}
          onClose={() => setShowOverlay(false)}
        />
      </Modal>
    </SafeAreaView>
  );
};
/* ==================================================================== */

export default TimerConfig;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0eef9' },
  body: { padding: 20, alignItems: 'center', gap: 12 },
  settingsButton: {
    padding: 6,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingSection: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  settingLabel: {
    fontFamily: 'ZenMaruGothicMedium',
    fontSize: 15,
    color: '#000',
    flexShrink: 1,
    marginRight: 12,
  },
  settingDescription: {
    fontFamily: 'ZenMaruGothicMedium',
    fontSize: 14,
    color: '#6b7280',
  },
});
