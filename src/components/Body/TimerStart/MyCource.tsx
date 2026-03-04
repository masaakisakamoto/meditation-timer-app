// src/components/Body/TimerStart/MyCource.tsx
import React, { FC } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';

type Course = { id: string; times: number[] };
type Props = {
  courses: Course[];
  onSelect: (times: number[]) => void;
  onDelete: (id: string) => void;
};

const deleteIcon = require('../../../../assets/DeleteButton.png');

const MyCource: FC<Props> = ({ courses, onSelect, onDelete }) => (
  <View style={styles.container}>
    <Text style={styles.title}>マイコース</Text>

    {courses.map((course) => (
      <View key={course.id} style={styles.courseItem}>
        {/* 選択ボタン */}
        <Pressable style={styles.selectButton} onPress={() => onSelect(course.times)}>
          <Text style={styles.selectText}>
            {course.times.map((t) => `${t}分`).join('　')}
          </Text>
        </Pressable>

        {/* 削除ボタン */}
        <Pressable style={styles.deleteButton} onPress={() => onDelete(course.id)}>
          <Image source={deleteIcon} style={styles.deleteIcon} />
        </Pressable>
      </View>
    ))}
  </View>
);

export default MyCource;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'ZenMaruGothic-Medium',
    textAlign: 'center',
    marginTop: -20,
    marginBottom: -40,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -75,
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#fcdfa5',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  selectText: {
    fontSize: 18,
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#000',
    textAlign: 'center',
  },
  deleteButton: {
    marginTop: 15,
    marginLeft: 0,
    padding: 8, // make touch area more generous
    borderRadius: 8,
  },
  deleteIcon: {
    width: 100, // match actual asset dimensions
    height: 100,
    resizeMode: 'contain',
  },
});
