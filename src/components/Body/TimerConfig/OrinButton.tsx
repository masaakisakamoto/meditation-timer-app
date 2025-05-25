// src/components/Body/TimerConfig/OrinButton.tsx
import React, { FC } from "react";
import { StyleSheet, Pressable, Text, View, Image } from "react-native";

export type Orin = {
  id: string;
  name: string;
  image: any; // require(...) で渡す
};

type Props = {
  /** 現在選択中のおりん */
  selected: Orin;
  /** タップ時にオーバーレイを開くハンドラ */
  onPress: () => void;
};

const OrinButton: FC<Props> = ({ selected, onPress }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.background} />
      <Text style={styles.label}>＞おりんの種類：{selected.name}</Text>
      {/* 下中央にはみ出す形でアイコンを絶対配置 */}
      <Image source={selected.image} style={styles.icon} />
    </Pressable>
  );
};

export default OrinButton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,               // TimerModeToggle と同じ高さ
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginVertical: 12,
	marginBottom: 40,
  },
  background: {
    position: "absolute",
    top: 0,
    width: "90%",             // Toggle と同様に内側に余白を取るなら 90%
    height: 60,               // Toggle ボタンと同じ高さ
    backgroundColor: "#fcdfa5",
    borderRadius: 15,
	left: "5%",
  },
  label: {
    position: "absolute",
    top: 15,            // 少し下げて中央寄せ
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.4,
    fontWeight: "500",
    fontFamily: "ZenMaruGothic-Medium",
    color: "#000",
    textAlign: "center",
    width: "80%",
  },
  icon: {
    position: "absolute",
    bottom: -60,           // 背景の下にはみ出す
    alignSelf: "center",      // 横方向中央
    width: 80,               // Toggle と同じアイコンサイズ
    height: 80,
    resizeMode: "contain",
  },
});
