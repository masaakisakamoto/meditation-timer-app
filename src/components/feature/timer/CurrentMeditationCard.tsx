// src/components/feature/timer/CurrentMeditationCard.tsx
import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { MeditationType } from '../../../types/meditation';
import { MEDITATION_EMOJI, MEDITATION_LABEL } from '../../../types/meditation';

type Props = {
  meditationTypes: MeditationType[];
  currentIdx: number;
  courseTimes?: number[];
};

const formatDur = (t?: number) => {
  if (t == null || t === 0) return null;
  return t > 0 && t < 1 ? `${Math.round(t * 60)}秒` : `${t}分`;
};

const CurrentMeditationCard: FC<Props> = ({
  meditationTypes,
  currentIdx,
  courseTimes,
}) => {
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

  type SubRow = { label: string; type: MeditationType; idx: number };
  const subRows: SubRow[] = [];
  if (nextType !== null && nextType !== 'none') {
    subRows.push({ label: '次', type: nextType, idx: currentIdx + 1 });
  }
  if (lastType !== null && lastType !== 'none') {
    subRows.push({ label: '最後', type: lastType, idx: lastIdx });
  }

  return (
    <View style={styles.container}>
      {/* 上段: 現在フェーズを大きく（none のときは非表示） */}
      {currentType !== 'none' && (
        <View style={styles.currentBlock}>
          <Text style={styles.currentEmoji}>{MEDITATION_EMOJI[currentType]}</Text>
          <View style={styles.currentLabelRow}>
            <Text style={styles.currentLabel}>{MEDITATION_LABEL[currentType]}</Text>
            {formatDur(courseTimes?.[currentIdx]) != null && (
              <Text style={styles.durText}>
                {' '}
                ({formatDur(courseTimes?.[currentIdx])})
              </Text>
            )}
          </View>
          <Text style={styles.currentCaption}>現在フェーズ</Text>
        </View>
      )}

      {/* 中段: 次 / 最後 */}
      {subRows.length > 0 && (
        <View style={styles.subBlock}>
          {subRows.map(({ label, type, idx }) => (
            <View key={label} style={styles.subRow}>
              <Text style={styles.subLabel}>{label}</Text>
              <View style={styles.subValueRow}>
                <Text style={styles.subValue} numberOfLines={1}>
                  {MEDITATION_EMOJI[type]} {MEDITATION_LABEL[type]}
                </Text>
                {formatDur(courseTimes?.[idx]) != null && (
                  <Text style={styles.durText}> ({formatDur(courseTimes?.[idx])})</Text>
                )}
              </View>
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
  currentLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentLabel: {
    fontSize: 22,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#000',
  },
  durText: {
    fontSize: 12,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#9ca3af',
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
  subValueRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  subValue: {
    fontSize: 15,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#6b7280',
  },
});
