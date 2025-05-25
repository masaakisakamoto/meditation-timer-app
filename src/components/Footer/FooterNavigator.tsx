// src/components/Footer/FooterNavigator.tsx
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import PatternA from '../../../assets/FooterButtonA.svg';
import PatternB from '../../../assets/FooterButtonB.svg';
import { RootTabParamList } from '../../../App';

type FooterNavigatorProps = {
  activeTab: keyof RootTabParamList;
  onTabChange: (tab: keyof RootTabParamList) => void;
};

const FooterNavigator: React.FC<FooterNavigatorProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: Array<{ name: keyof RootTabParamList; label: string }> = [
    { name: 'TimerStart',  label: 'タイマー'        },
    { name: 'TimerConfig', label: 'タイマー\n設定' },
    { name: 'TimerSutta',  label: '経典'            },
  ];

  // 背景色をタブによって切り替え
  const containerBg =
    activeTab === 'TimerSutta' ? styles.containerSutta : styles.containerDefault;

  return (
    <View style={[styles.container, containerBg]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.name;
        const Icon = isActive ? PatternB : PatternA;
        return (
          <Pressable
            key={tab.name}
            style={styles.button}
            onPress={() => onTabChange(tab.name)}
          >
            <Icon width="100%" height="100%" />
            <Text
              style={[
                styles.label,
                isActive ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default FooterNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
  },
  containerDefault: {
    backgroundColor: '#E0EEF9',
  },
  containerSutta: {
    backgroundColor: '#90C0E6',
  },
  button: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    fontSize: 20,
    fontFamily: 'ZenMaruGothic-Medium',
    textAlign: 'center',
  },
  labelActive: {
    color: '#FEEF94',
  },
  labelInactive: {
    color: '#000',
  },
});
