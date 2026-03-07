// src/components/Body/TimerConfig/TimerModeToggle.tsx
import React, { FC, useState } from 'react';
import { Pressable, Text, StyleSheet, Modal, View } from 'react-native';
import ModalPanel from '../../ui/ModalPanel';

export type Mode = 'countdown' | 'countup';

type Props = {
  /** 現在のモード */
  mode: Mode;
  /** モードが選択されたときに呼ばれる */
  onSelect: (mode: Mode) => void;
};

const modeLabel: Record<Mode, string> = {
  countdown: '▼ カウントダウン',
  countup: '▲ カウントアップ',
};

const options: { mode: Mode; label: string; sample: string }[] = [
  { mode: 'countup', label: '▲ カウントアップ', sample: '1, 2, 3… と増える' },
  { mode: 'countdown', label: '▼ カウントダウン', sample: '3, 2, 1… と減る' },
];

const TimerModeToggle: FC<Props> = ({ mode, onSelect }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setShowModal(true)}
        style={({ pressed }) => [
          styles.container,
          pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
        ]}
      >
        <Text style={styles.label}>タイマー方式</Text>
        <View style={styles.right}>
          <Text style={styles.current}>{modeLabel[mode]}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </Pressable>

      <Modal
        visible={showModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <ModalPanel title="タイマー方式" onClose={() => setShowModal(false)}>
          {options.map((opt) => (
            <Pressable
              key={opt.mode}
              onPress={() => {
                onSelect(opt.mode);
                setShowModal(false);
              }}
              style={({ pressed }) => [
                styles.option,
                mode === opt.mode && styles.optionSelected,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.optionTextBlock}>
                <Text style={styles.optionLabel}>{opt.label}</Text>
                <Text style={styles.optionSample}>{opt.sample}</Text>
              </View>
              {mode === opt.mode && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
          ))}
        </ModalPanel>
      </Modal>
    </>
  );
};

export default TimerModeToggle;

const styles = StyleSheet.create({
  container: {
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
  optionTextBlock: {
    gap: 2,
  },
  optionLabel: {
    fontSize: 17,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#000',
  },
  optionSample: {
    fontSize: 13,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#888',
  },
  checkmark: {
    fontSize: 18,
    color: '#4a90d9',
  },
});
