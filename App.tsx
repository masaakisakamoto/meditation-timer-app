import React, { useState, useEffect } from 'react';
import { Alert, View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CourseProvider } from './src/context/CourseContext';
import { ConfigProvider } from './src/context/ConfigContext';

import TimerStart from './src/screens/TimerStart';
import TimerConfig from './src/screens/TimerConfig';
import TimerSutta from './src/screens/TimerSutta';
import TimerStop from './src/screens/TimerStop';
import FooterNavigator from './src/components/Footer/FooterNavigator';

export type RootTabParamList = {
  TimerStart: undefined;
  TimerConfig: undefined;
  TimerSutta: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  TimerStop: {
    courseTimes: number[];
    mode: 'countdown' | 'countdown';
    ringType: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  type ActiveScreen = 'TimerStart' | 'TimerConfig' | 'TimerSutta';
  const [active, setActive] = useState<ActiveScreen>('TimerStart');

  const renderScreen = () => {
    switch (active) {
      case 'TimerStart':
        return <TimerStart />;
      case 'TimerConfig':
        return <TimerConfig onFinished={() => setActive('TimerStart')} />;
      case 'TimerSutta':
        return <TimerSutta />;
      default:
        return <TimerStart />;
    }
  };

  return (
    <View style={styles.flex}>
      {renderScreen()}
      <FooterNavigator activeTab={active} onTabChange={setActive} />
    </View>
  );
}

export default function App() {
  const [entries, setEntries] = useState<{ date: string; text: string }[]>([]);

  // ✅ 先に useEffect（フォント未ロードでも毎回同じHook数になる）
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('entries');
        if (json) setEntries(JSON.parse(json));
      } catch {
        Alert.alert('エラー', 'データの読み込みに失敗しました');
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('entries', JSON.stringify(entries)).catch(() => {});
  }, [entries]);

  // ✅ useFonts も Hook なので、ここも毎回同じ位置で必ず呼ぶ
  const [fontsLoaded, fontError] = useFonts({
    Yomogi: require('./assets/ttf/Yomogi-Regular.ttf'),
    ZenMaruGothicRegular: require('./assets/ttf/ZenMaruGothic-Regular.ttf'),
    ZenMaruGothicBold: require('./assets/ttf/ZenMaruGothic-Bold.ttf'),
    ZenMaruGothicBlack: require('./assets/ttf/ZenMaruGothic-Black.ttf'),
    ZenMaruGothicMedium: require('./assets/ttf/ZenMaruGothic-Medium.ttf'),
    ZenMaruGothicLight: require('./assets/ttf/ZenMaruGothic-Light.ttf'),
  });

  if (fontError) {
    console.log('FONT ERROR:', fontError);
  }

  if (!fontsLoaded) {
    return (
      <View style={[styles.flex, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <ConfigProvider>
      <CourseProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="TimerStop" component={TimerStop} />
          </Stack.Navigator>
        </NavigationContainer>
      </CourseProvider>
    </ConfigProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});