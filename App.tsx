// App.tsx
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TimerStart } from './src/screens/TimerStart';
import { TimerConfig } from './src/screens/TimerConfig';
import { TimerSutta } from './src/screens/TimerSutta';

export type RootStackParamList = {
  TimerStart: undefined;
  TimerConfig: undefined;
  TimerSutta: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // AsyncStorage まわりはそのまま
  const [entries, setEntries] = useState<{ date: string; text: string }[]>([]);

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

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TimerStart"
        screenOptions={{ headerShown: false }}  // ヘッダーも不要なら隠す
      >
        <Stack.Screen name="TimerStart" component={TimerStart} />
        <Stack.Screen name="TimerConfig" component={TimerConfig} />
        <Stack.Screen name="TimerSutta" component={TimerSutta} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
