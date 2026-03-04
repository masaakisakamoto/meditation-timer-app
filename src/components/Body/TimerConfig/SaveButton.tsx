import React, { FC } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  onReset: () => void;
  onSave: () => void;
};

const ActionButtons: FC<Props> = ({ onReset, onSave }) => (
  <View style={styles.container}>
    {/* リセット */}
    <Pressable style={[styles.button, styles.reset]} onPress={onReset}>
      <Text style={styles.resetText}>リセット</Text>
    </Pressable>
    {/* 保存 */}
    <Pressable style={[styles.button, styles.save]} onPress={onSave}>
      <Text style={styles.saveText}>マイコース{'\n'}として保存</Text>
    </Pressable>
  </View>
);

export default ActionButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  button: {
    width: 149,
    height: 66,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  reset: {
    backgroundColor: '#dcdedd',
  },
  save: {
    backgroundColor: '#f9c04c',
  },
  resetText: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -2.8,
    fontWeight: '700',
    fontFamily: 'ZenMaruGothic-Bold',
    color: '#000',
    textAlign: 'center',
  },
  saveText: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -1,
    fontWeight: '700',
    fontFamily: 'ZenMaruGothic-Bold',
    color: '#000',
    textAlign: 'center',
  },
});
