import React, { FC, useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Keyboard } from 'react-native';

type Props = {
  /** 入力された分数を受け取るコールバック */
  onAdd: (minutes: number) => void;
  /** ボタンラベル（省略時は「アラームを設定」） */
  buttonLabel?: string;
};

const AlarmInputRow: FC<Props> = ({ onAdd, buttonLabel = 'アラーム\nを設定' }) => {
  const [input, setInput] = useState<string>('');

  const handlePress = () => {
    const minutes = parseInt(input, 10);
    if (isNaN(minutes) || minutes <= 0) {
      // 必要に応じてエラー表示など
      setInput('');
      return;
    }
    onAdd(minutes);
    setInput('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="分"
        keyboardType="numeric"
        returnKeyType="done"
        onSubmitEditing={handlePress}
      />
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
};

export default AlarmInputRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 18,
    marginRight: 12,
  },
  button: {
    width: 140,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#fad179',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#000',
  },
});
