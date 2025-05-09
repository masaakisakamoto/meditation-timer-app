// src/components/PauseMizu.tsx
import React, { FunctionComponent } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';

interface Props {
  saiseiIcon: ImageSourcePropType;
  title: string;
  subtitle: string;
  style?: ViewStyle;
}

export const PauseMizu: FunctionComponent<Props> = ({
  saiseiIcon,
  title,
  subtitle,
  style,
}) => {
  return (
    <View style={[styles.base, style]}>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Image source={saiseiIcon} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecf3fd',
    borderRadius: 15,
    height: 58,
    paddingHorizontal: 16,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
  },
  icon: {
    width: 20,
    height: 23,
    resizeMode: 'contain',
  },
});
export default PauseMizu;
