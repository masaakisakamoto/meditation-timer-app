// src/screens/TimerConfig.tsx
import React, { FC, useContext, useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Modal,
  View,
  Text,
  Switch,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAudioPlayer } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';

import { CourseContext } from '../context/CourseContext';
import { ConfigContext } from '../context/ConfigContext';
import { RootStackParamList } from '../../App';

import Header from '../components/Header/Header';
import Timer from '../components/Body/TimerConfig/Timer';
import TimerModeToggle from '../components/Body/TimerConfig/TimerModeToggle';
import AlermConfigButton from '../components/Body/TimerConfig/AlermConfigButton';
import OrinButton from '../components/Body/TimerConfig/OrinButton';
import OrinPickerModal, {
  Orin as OrinType,
} from '../components/feature/timer/OrinPickerModal';
import ActionButtons from '../components/Body/TimerConfig/SaveButton'; // ← リセット+保存 を 1 つにまとめたもの

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
  const [showOverlay, setShowOverlay] = useState(false);

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
    // マイコースとして保存
    addCourse(alarmTimes);

    // TimerStart画面に戻る
    onFinished?.();

    // 保存完了のログ出力
    console.log('Course saved:', {
      times: alarmTimes,
      mode: configCtx.config.mode,
      ringType: configCtx.config.ringType,
    });
  };

  /** アラーム時間を 1 つ追加 */
  const handleAddAlarm = (minutes: number) => {
    setAlarmTimes((prev) => {
      const next = [...prev] as [number, number, number];
      const idx = next.findIndex((v) => v === 0);
      if (idx !== -1) next[idx] = minutes;
      return next;
    });
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
      <Header title="タイマー設定" />

      <ScrollView contentContainerStyle={styles.body}>
        {/* 円形タイマー＋現在の 3 つの分 */}
        <Timer times={alarmTimes} />

        {/* アラーム追加 */}
        <AlermConfigButton onAdd={handleAddAlarm} />

        {/* カウント方向トグル */}
        <TimerModeToggle
          mode={configCtx.config.mode}
          onSelect={(m) => configCtx.setMode(m)}
        />

        {/* 画面スリープ防止 */}
        <View style={styles.keepAwakeRow}>
          <Text style={styles.keepAwakeLabel}>タイマー中は画面をスリープさせない</Text>
          <Switch
            value={configCtx.config.keepAwakeOn}
            onValueChange={configCtx.toggleKeepAwake}
          />
        </View>

        {/* おりん選択 */}
        <OrinButton selected={selectedOrin} onPress={() => setShowOverlay(true)} />

        {/* リセット＋保存ボタン */}
        <ActionButtons
          onReset={() => setAlarmTimes([0, 0, 0])}
          onSave={handleSaveCourse}
        />
      </ScrollView>

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
  body: { padding: 20, alignItems: 'center' },
  keepAwakeRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fcdfa5',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  keepAwakeLabel: {
    fontFamily: 'ZenMaruGothicMedium',
    fontSize: 15,
    color: '#000',
    flexShrink: 1,
    marginRight: 12,
  },
});
