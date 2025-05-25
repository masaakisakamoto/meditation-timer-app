// src/screens/TimerConfig.tsx
import React, { FC, useContext, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../App';

import { CourseContext }   from '../context/CourseContext';
import { ConfigContext }   from '../context/ConfigContext';

import Header            from '../components/Header/Header';
import Timer             from '../components/Body/TimerConfig/Timer';
import TimerModeToggle   from '../components/Body/TimerConfig/TimerModeToggle';
import AlermConfigButton from '../components/Body/TimerConfig/AlermConfigButton';
import OrinButton, { Orin as OrinType } from '../components/Body/TimerConfig/OrinButton';
import OverlayOrin       from '../components/Body/TimerConfig/OverlayOrin';
import ActionButtons     from '../components/Body/TimerConfig/SaveButton';  // ← リセット+保存 を 1 つにまとめたもの

/* ---------- props 型 ---------- */
type TimerConfigProps = { onFinished?: () => void };      // ★コールバックだけ受け取る

/* ---------- おりん一覧 ---------- */
import placeholderImg from '../../assets/0002-1.png';
const orinList: OrinType[] = [
  { id: '1',  name: 'Hおりん',  image: placeholderImg },
  { id: '2',  name: 'Nおりん',  image: placeholderImg },
  { id: '3',  name: '中りん',   image: placeholderImg },
  { id: '4',  name: '大りん',   image: placeholderImg },
  { id: '5',  name: 'おりん1',  image: placeholderImg },
  { id: '6',  name: 'おりん2',  image: placeholderImg },
  { id: '7',  name: 'おりん3',  image: placeholderImg },
  { id: '8',  name: 'おりん4',  image: placeholderImg },
  { id: '9',  name: 'おりん5',  image: placeholderImg },
  { id: '10', name: 'おりん6',  image: placeholderImg },
];

/* ==================================================================== */
export const TimerConfig: FC<TimerConfigProps> = ({ onFinished }) => {
  /* -------- context -------- */
  const { addCourse }  = useContext(CourseContext)!;   // ← 変更点
  const configCtx      = useContext(ConfigContext)!;

  /* -------- local state -------- */
  const [alarmTimes, setAlarmTimes] = useState<[number, number, number]>(
    [0, 0, 0],
  );
  const [showOverlay, setShowOverlay] = useState(false);

  /* ringType に対応する初期おりんを決定 */
  const initOrin =
    orinList.find(o => o.id === configCtx.config.ringType) ?? orinList[0];
  const [selectedOrin, setSelectedOrin] = useState<OrinType>(initOrin);

  /* -------- handlers -------- */
  /** マイコースとして保存 */
  const handleSaveCourse = () => {
    addCourse(alarmTimes);          // ← CourseContext 経由で永続化
    onFinished?.(); 
  };

  /** アラーム時間を 1 つ追加 */
  const handleAddAlarm = (minutes: number) => {
    setAlarmTimes(prev => {
      const next = [...prev] as [number, number, number];
      const idx  = next.findIndex(v => v === 0);
      if (idx !== -1) next[idx] = minutes;
      return next;
    });
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
          onToggle={() =>
            configCtx.setMode(
              configCtx.config.mode === 'countdown'
                ? 'countup'
                : 'countdown',
            )
          }
        />

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
        animationType="slide"
        transparent
        onRequestClose={() => setShowOverlay(false)}
      >
        <OverlayOrin
          orins={orinList}
          onSelect={orin => {
            setSelectedOrin(orin);
            configCtx.setRingType(orin.id);  // ← 永続化
          }}
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
  body:      { padding: 20, alignItems: 'center' },
});
