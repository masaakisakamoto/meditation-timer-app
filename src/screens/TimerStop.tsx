// src/screens/TimerStop.tsx
import React, { useState, useEffect, FC } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// アセット
import stopIcon  from '../../assets/StopButton.png';
import pauseIcon from '../../assets/PauseButton.png';
import diaryIcon from '../../assets/DiaryButton.png';

// 共通フッター
import { FooterCommon } from '../components/FooterCommon';

type Props = NativeStackScreenProps<any, 'TimerStop'>;

export const TimerStop: FC<Props> = ({ navigation }) => {
  // State: 経過秒と再生状態
  const [elapsed, setElapsed]     = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Timer エフェクト
  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    if (isPlaying) {
      id = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(id);
  }, [isPlaying]);

  // hh:mm:ss に整形
  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const t = s % 60;
    return `${h.toString().padStart(2,'0')}:${m
      .toString()
      .padStart(2,'0')}:${t.toString().padStart(2,'0')}`;
  };

  // ハンドラ
  const onStop   = () => {
    setIsPlaying(false);
    setElapsed(0);
    navigation.navigate('TimerStart');
  };
  const onPause  = () => setIsPlaying(p => !p);

  return (
    <SafeAreaView style={styles.safe}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timer</Text>
      </View>

      {/* 本文 */}
      <View style={styles.body}>
        {/* アラーム時間（固定表示例） */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アラーム時間</Text>
          <View style={styles.alarmRow}>
            <Text style={styles.alarmTxt}>00</Text>
            <Text style={styles.alarmTxt}>00</Text>
            <Text style={styles.alarmTxt}>00</Text>
          </View>
        </View>

        {/* タイマー円 */}
        <View style={styles.timerContainer}>
          <View style={styles.circle}>
            <Text style={styles.timerText}>{fmt(elapsed)}</Text>
            <View style={styles.controls}>
              <Pressable style={styles.ctrlBtn} onPress={onStop}>
                <Image source={stopIcon}  style={styles.ctrlIcon} />
              </Pressable>
              <Pressable style={styles.ctrlBtn} onPress={onPause}>
                <Image source={pauseIcon} style={styles.ctrlIcon} />
              </Pressable>
            </View>
          </View>

          {/* 日記ボタン */}
          <Pressable style={styles.diaryBtn}>
            <Image source={diaryIcon} style={styles.diaryIcon} />
          </Pressable>
        </View>
      </View>

      {/* 共通フッター */}
      <FooterCommon
        onPressTimer={() => navigation.navigate('TimerStart')}
        onPressConfig={() => navigation.navigate('TimerConfig')}
        onPressSutta={() => navigation.navigate('TimerSutta')}
      />
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const C = width * 0.8;  // 円のサイズ

const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor:'#e0eef9' },
  header: { height:92, justifyContent:'flex-end', alignItems:'center' },
  headerTitle:{
    fontSize:32,
    fontWeight:'500',
    color:'#fff',
    backgroundColor:'#9fcaec',
    width:'100%',
    textAlign:'center',
    paddingVertical:16
  },

  body:{ flex:1, alignItems:'center', paddingTop:16 },
  section:{ width:'90%', marginVertical:16 },
  sectionTitle:{ fontSize:20, fontWeight:'500', marginBottom:8 },
  alarmRow:{ flexDirection:'row', justifyContent:'space-between' },
  alarmTxt:{ fontSize:32, fontWeight:'500' },

  timerContainer:{ alignItems:'center', marginTop:24 },
  circle:{
    width:C,
    height:C,
    borderRadius:C/2,
    backgroundColor:'#fefbd0',
    justifyContent:'center',
    alignItems:'center'
  },
  timerText:{
    fontSize:72,
    fontWeight:'400',
    position:'absolute',
    top:C/3
  },
  controls:{ flexDirection:'row', position:'absolute', bottom:40 },
  ctrlBtn:{ marginHorizontal:8, padding:8 },
  ctrlIcon:{ width:32, height:32 },

  diaryBtn:{ position:'absolute', top:-16, right:-16 },
  diaryIcon:{ width:40, height:40 },

  footerBtn:{}, // FooterCommon 側で制御
});
