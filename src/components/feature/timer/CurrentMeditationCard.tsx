// src/components/feature/timer/CurrentMeditationCard.tsx
import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { MeditationType } from '../../../types/meditation';
import { MEDITATION_EMOJI, MEDITATION_LABEL } from '../../../types/meditation';

type Props = {
  meditationTypes: MeditationType[];
  currentIdx: number; // current phase index
};

const CurrentMeditationCard: FC<Props> = ({ meditationTypes, currentIdx }) => {
  const total = meditationTypes.length;
  const currentType = meditationTypes[currentIdx] ?? 'none';
  const nextType = total >= 2 ? (meditationTypes[currentIdx + 1] ?? null) : null;
  const lastIdx = total - 1;
  const lastType =
    total >= 3 && currentIdx + 1 < lastIdx ? (meditationTypes[lastIdx] ?? null) : null;

  // 全フェーズが none なら非表示
  const hasAny =
    currentType !== 'none' ||
    (nextType !== null && nextType !== 'none') ||
    (lastType !== null && lastType !== 'none');
  if (!hasAny) return null;

  type SubRow = { label: string; type: MeditationType };
  const subRows: SubRow[] = [];
  if (nextType !== null && nextType !== 'none') {
    subRows.push({ label: '次', type: nextType });
  }
  if (lastType !== null && lastType !== 'none') {
    subRows.push({ label: '最後', type: lastType });
  }

  return (
    <View style={styles.container}>
      {/* 上段: 現在フェーズを大きく（none のときは非表示） */}
      {currentType !== 'none' && (
        <View style={styles.currentBlock}>
          <Text style={styles.currentEmoji}>{MEDITATION_EMOJI[currentType]}</Text>
          <Text style={styles.currentLabel}>{MEDITATION_LABEL[currentType]}</Text>
          <Text style={styles.currentCaption}>現在フェーズ</Text>
        </View>
      )}

      {/* 中段: 次 / 最後 */}
      {subRows.length > 0 && (
        <View style={styles.subBlock}>
          {subRows.map(({ label, type }) => (
            <View key={label} style={styles.subRow}>
              <Text style={styles.subLabel}>{label}</Text>
              <Text style={styles.subValue} numberOfLines={1}>
                {MEDITATION_EMOJI[type]} {MEDITATION_LABEL[type]}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default CurrentMeditationCard;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  currentBlock: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  currentEmoji: {
    fontSize: 40,
  },
  currentLabel: {
    fontSize: 22,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#000',
  },
  currentCaption: {
    fontSize: 12,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#9ca3af',
    marginTop: 2,
  },
  subBlock: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
    gap: 6,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subLabel: {
    width: 36,
    fontSize: 13,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#9ca3af',
  },
  subValue: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#6b7280',
  },
});
