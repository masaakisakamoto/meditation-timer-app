// src/components/feature/timer/PhaseProgressBar.tsx
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  total: number; // total phase count
  currentIdx: number; // phases < currentIdx are done, === currentIdx is active, > currentIdx are upcoming
};

const PhaseProgressBar: FC<Props> = ({ total, currentIdx }) => {
  if (total <= 1) return null;

  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, i) => (
        <React.Fragment key={i}>
          {i > 0 && <View style={[styles.line, i <= currentIdx && styles.lineDone]} />}
          <View
            style={[
              styles.dot,
              i === currentIdx && styles.dotActive,
              i < currentIdx && styles.dotDone,
            ]}
          />
        </React.Fragment>
      ))}
    </View>
  );
};

export default PhaseProgressBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    width: '90%',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#b0c8e8',
  },
  dotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4a90d9',
  },
  dotDone: {
    backgroundColor: '#4a90d9',
    opacity: 0.5,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#b0c8e8',
    marginHorizontal: 4,
  },
  lineDone: {
    backgroundColor: '#4a90d9',
    opacity: 0.5,
  },
});
