import React, { FC } from "react";
import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  View,
  Image,
  Text
} from "react-native";
import TimerBackground from "../../../../assets/TimerBackGround.svg";
import SuttaTrue from "../../../../assets/SuttaTrue.svg";
import SuttaFalse from "../../../../assets/SuttaFalse.svg";
const Polygon1 = require("../../../../assets/Polygon-1.png");

interface TimerProps {
  time: string;
  running: boolean;
  onToggle: () => void;
  isReading: boolean;
  toggleReading: () => void;
}

const TimerStartDisplay: FC<TimerProps> = ({
  time,
  onToggle,
  isReading,
  toggleReading,
}) => {
  return (
    <SafeAreaView style={styles.timer}>
      <TimerBackground width="100%" height="100%" style={styles.timerBackground} />

      {/* スタート／リセット ボタン */}
      <Pressable style={styles.startButton} onPress={onToggle}>
        <View style={styles.startCircle} />
        <Image source={Polygon1} style={styles.startIcon} />
      </Pressable>

            {/* 経典読み上げ SVG ボタン (SVGにテキスト＋アイコン含む) */}
     <Pressable
        style={[
          styles.readingButton,
          isReading ? styles.readingOn : styles.readingOff,
        ]}
        onPress={toggleReading}
      >
        {isReading
          ? <SuttaTrue width="100%" height="100%" />
          : <SuttaFalse width="100%" height="100%" />
        }
      </Pressable>


      {/* 残り時間 */}
      <Text style={styles.timeText}>{time}</Text>
    </SafeAreaView>
  );
};

export default TimerStartDisplay;

const styles = StyleSheet.create({
  timer: { width: "75%", height: 280, position: "relative" },
  timerBackground: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    width: "100%", height: "100%"
  },
  startButton: {
    position: "absolute", top: "70%", left: "26%",
    width: "47%", height: "13%", alignItems: "center", justifyContent: "center",
  },
  startCircle: {
    position: "absolute", top: "-8.6%", left: "-1.8%",
    right: "-1.8%", bottom: "-6.6%",
    backgroundColor: "#fff79a",
    borderWidth: 3,
    borderColor: "#f8cd71",
    borderRadius: 24
  },
  startIcon: { width: 31, height: 25, resizeMode: "contain" },
   readingButton: {
	   position: "absolute", top: "18%", left: "26%",
	   width: "47%", height: "14%", alignItems: "center", justifyContent: "center"
	 },
	 // 横位置は同じなので、On/Off の左右オフセットは不要に
	 readingOn:  {},
	 readingOff: {},
  readingCircleOn: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#feef94", borderRadius: 24
  },
  readingCircleOff: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#dcdedd", borderRadius: 24
  },
  readingText: {
    position: "absolute",
    top: "24%", left: "31%",
    fontFamily: "ZenMaruGothic-Medium",
    fontWeight: "500",
    fontSize: 17,
    color: "#000"
  },
  speakerIcon: {
    position: "absolute"
  },
  timeText: {
    position: "absolute", top: 100, left: 20,
    fontFamily: "DidactGothic-Regular",
    fontSize: 60,
    color: "#000"
  }
});
