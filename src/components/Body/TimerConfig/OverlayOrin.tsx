import React, { FC } from 'react';
import { View, Text, Image, Pressable, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type Orin = {
  id: string;
  name: string;
  image: any;
};

type Props = {
  /** 選択可能なおりん一覧 */
  orins: Orin[];
  /** 選択時のコールバック */
  onSelect: (orin: Orin) => void;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
};

const OverLayOrin: FC<Props> = ({ orins, onSelect, onClose }) => {
  return (
    <SafeAreaView style={styles.overlayContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>おりんを選択</Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      </View>
      <FlatList
        data={orins}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => {
              onSelect(item);
              onClose();
            }}
          >
            <Image source={item.image} style={styles.icon} />
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default OverLayOrin;

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: '#fcdfa5',
    justifyContent: 'center',
    alignItems: 'center',
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
  list: {
    width: '100%',
  },
  item: {
    width: 300,                  // ★ 横幅を固定
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#000',
  },
});
