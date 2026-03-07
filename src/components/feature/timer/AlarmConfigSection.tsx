// src/components/feature/timer/AlarmConfigSection.tsx
import React, { FC, useState } from 'react';
import { Pressable, Text, StyleSheet, Modal, View, ScrollView } from 'react-native';
import ModalPanel from '../../ui/ModalPanel';

const PROD_OPTIONS = [0, ...Array.from({ length: 12 }, (_, i) => (i + 1) * 5)];
const MINUTE_OPTIONS = __DEV__ ? [0, 0.5, 1, ...PROD_OPTIONS.slice(1)] : PROD_OPTIONS;

const formatMin = (min: number): string => {
  if (min === 0) return '未設定';
  if (min < 1) return `${Math.round(min * 60)}秒`;
  return `${min}分`;
};

type Props = {
  times: [number, number, number];
  onSetTime: (index: number, minutes: number) => void;
};

const AlarmConfigSection: FC<Props> = ({ times, onSetTime }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const currentMinutes = editingIndex !== null ? times[editingIndex] : 0;

  // 先頭から連続する設定済みアラームの数
  const filledCount = times.findIndex((m) => m === 0);
  const displayCount = filledCount === -1 ? times.length : filledCount;

  return (
    <>
      {times.slice(0, displayCount).map((min, idx) => (
        <Pressable
          key={idx}
          onPress={() => setEditingIndex(idx)}
          style={({ pressed }) => [
            styles.cell,
            pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.label}>{`🔔 アラーム ${idx + 1}`}</Text>
          <View style={styles.right}>
            <Text style={styles.current}>{formatMin(min)}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>
      ))}

      {displayCount < times.length && (
        <Pressable
          onPress={() => setEditingIndex(displayCount)}
          style={({ pressed }) => [
            styles.cell,
            pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.addLabel}>＋ アラームを追加</Text>
        </Pressable>
      )}

      <Modal
        visible={editingIndex !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setEditingIndex(null)}
      >
        <ModalPanel
          title={editingIndex !== null ? `アラーム ${editingIndex + 1}` : ''}
          onClose={() => setEditingIndex(null)}
        >
          <ScrollView>
            {MINUTE_OPTIONS.map((min) => (
              <Pressable
                key={min}
                onPress={() => {
                  if (editingIndex !== null) {
                    onSetTime(editingIndex, min);
                    setEditingIndex(null);
                  }
                }}
                style={({ pressed }) => [
                  styles.option,
                  currentMinutes === min && styles.optionSelected,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.optionLabel}>{formatMin(min)}</Text>
                {currentMinutes === min && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
            ))}
          </ScrollView>
        </ModalPanel>
      </Modal>
    </>
  );
};

export default AlarmConfigSection;

const styles = StyleSheet.create({
  cell: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fcdfa5',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#000',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  current: {
    fontSize: 15,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#666',
  },
  chevron: {
    fontSize: 20,
    color: '#C7C7CC',
    lineHeight: 22,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionSelected: {
    backgroundColor: '#fffde7',
  },
  optionLabel: {
    fontSize: 17,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#000',
  },
  checkmark: {
    fontSize: 18,
    color: '#4a90d9',
  },
  addLabel: {
    fontSize: 16,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#4a90d9',
  },
});
