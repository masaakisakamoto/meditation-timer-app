// src/context/ConfigContext.tsx
import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    FC,
  } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  /* ---------- 型定義 ---------- */
  export type Mode = 'countdown' | 'countup';
  
  export type Config = {
    mode      : Mode;      // カウント方向
    ringType  : string;    // おりん ID
    readingOn : boolean;   // 経典読み上げ ON / OFF
  };
  
  type ConfigContextType = {
    config        : Config;
    setMode       : (m: Mode)       => void;
    setRingType   : (r: string)     => void;
    toggleReading : ()              => void;
  };
  
  export const ConfigContext = createContext<ConfigContextType | null>(null);
  
  /* ---------- Provider ---------- */
  const STORAGE_KEY = '@config';
  
  export const ConfigProvider: FC<{ children: ReactNode }> = ({ children }) => {
    /* ───────── 初期値 ───────── */
    const [config, setConfig] = useState<Config>({
      mode     : 'countdown',
      ringType : '1',          // デフォルトおりん ID
      readingOn: false,
    });
  
    /* ───────── 起動時に復元 ───────── */
    useEffect(() => {
      (async () => {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setConfig(JSON.parse(json));
      })();
    }, []);
  
    /* ───────── 値が変わるたび保存 ───────── */
    useEffect(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }, [config]);
  
    /* ───────── Setter 群 ───────── */
    const setMode = (mode: Mode) =>
      setConfig(prev => ({ ...prev, mode }));
  
    const setRingType = (ringType: string) =>
      setConfig(prev => ({ ...prev, ringType }));
  
    /* ON/OFF をトグルするだけで良いので bool flip に */
    const toggleReading = () =>
      setConfig(prev => ({ ...prev, readingOn: !prev.readingOn }));
  
    /* ───────── Provider ───────── */
    return (
      <ConfigContext.Provider
        value={{ config, setMode, setRingType, toggleReading }}
      >
        {children}
      </ConfigContext.Provider>
    );
  };
  