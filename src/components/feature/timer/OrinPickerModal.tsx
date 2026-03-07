// src/components/feature/timer/OrinPickerModal.tsx
import React, { FC } from 'react';
import { Text, Image, Pressable, StyleSheet, FlatList } from 'react-native';
import ModalPanel from '../../ui/ModalPanel';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';

export type Orin = {
  id: string;
  name: string;
  image: any;
  sound: any; // 音声ファイルを require(...) で指定
};

type Props = {
  /** 選択可能なおりん一覧 */
  orins: Orin[];
  /** おりん選択時のコールバック（再生含む処理は呼び出し元が担う） */
  onSelect: (orin: Orin) => void;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
};

const OrinPickerModal: FC<Props> = ({ orins, onSelect, onClose }) => {
  return (
    <ModalPanel title="おりんを選択" onClose={onClose}>
      {/* おりんリスト */}
      <FlatList
        data={orins}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onSelect(item)}
            style={({ pressed }) => [
              styles.item,
              pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Image source={item.image} style={styles.icon} />
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
      />
    </ModalPanel>
  );
};

export default OrinPickerModal;

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  item: {
    width: 300, // 横幅は固定
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: spacing.sm,
    resizeMode: 'cover',
    borderRadius: 25, // 円形にする
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'ZenMaruGothic-Medium',
    color: colors.textPrimary,
  },
});
