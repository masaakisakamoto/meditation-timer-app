// src/components/ui/ModalPanel.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

type Props = {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

const ModalPanel: React.FC<Props> = ({ title, onClose, children }) => {
  return (
    <View style={styles.overlayContainer}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <View style={styles.header}>
            {title ? <Text style={styles.headerText}>{title}</Text> : <View />}
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </View>
  );
};

export default ModalPanel;

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  panel: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: colors.panelBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeText: {
    fontSize: 24,
    fontWeight: '600',
  },
});
