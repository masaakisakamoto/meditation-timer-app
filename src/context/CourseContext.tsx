// src/context/CourseContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MeditationType } from '../types/meditation';

export type Course = {
  id: string;
  times: number[];
  mode?: string;
  ringType?: string;
  meditationTypes?: MeditationType[];
};

type CourseContextType = {
  courses: Course[];
  addCourse: (
    times: number[],
    mode: string,
    ringType: string,
    meditationTypes?: MeditationType[],
  ) => void;
  deleteCourse: (id: string) => void;
};

export const CourseContext = createContext<CourseContextType | null>(null);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  /* --- 初回マウントで復元 --- */
  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem('@courses');
      if (json) setCourses(JSON.parse(json));
    })();
  }, []);

  /* --- 値が変わるたびに保存 --- */
  useEffect(() => {
    AsyncStorage.setItem('@courses', JSON.stringify(courses));
  }, [courses]);

  /* 追加／削除 Helper */
  const addCourse = (
    times: number[],
    mode: string,
    ringType: string,
    meditationTypes?: MeditationType[],
  ) => {
    const id = `c${Date.now()}`;
    setCourses((prev) => [...prev, { id, times, mode, ringType, meditationTypes }]);
  };
  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse, deleteCourse }}>
      {children}
    </CourseContext.Provider>
  );
};
