// src/components/ui/ModalPanel.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  panel: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#fcdfa5',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    fontWeight: '600',
  },
});
