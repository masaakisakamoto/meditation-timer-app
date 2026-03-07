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
    <Text style={[styles.title, courses.length === 0 && styles.titleNoItems]}>
      マイコース
    </Text>

    {courses.length === 0 ? (
      <View style={styles.guideItem}>
        <View style={styles.guideCard}>
          <Text style={styles.guideText}>タイマー設定でマイコースを設定してください</Text>
        </View>
      </View>
    ) : (
      courses.map((course) => (
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
      ))
    )}
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
  titleNoItems: {
    marginTop: -20,
    marginBottom: 8,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -75,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  guideCard: {
    flex: 1,
    backgroundColor: '#fcdfa5',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  guideText: {
    fontSize: 14,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#6b7280',
    textAlign: 'center',
  },
});
