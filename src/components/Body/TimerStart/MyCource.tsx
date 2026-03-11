// src/components/Body/TimerStart/MyCource.tsx
import React, { FC } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import type { Course } from '../../../context/CourseContext';
import { MEDITATION_EMOJI } from '../../../types/meditation';

type OrinItem = { id: string; image: number };
type Props = {
  courses: Course[];
  orins: OrinItem[];
  selectedId?: string;
  onSelect: (course: Course) => void;
  onDelete: (id: string) => void;
};

const deleteIcon = require('../../../../assets/DeleteButton.png');

const MyCource: FC<Props> = ({ courses, orins, selectedId, onSelect, onDelete }) => (
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
          <Pressable
            style={[
              styles.selectButton,
              selectedId === course.id && styles.selectButtonSelected,
            ]}
            onPress={() => onSelect(course)}
          >
            <View style={styles.courseRow}>
              <View style={styles.timesBlock}>
                <Text
                  style={styles.selectText}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  {course.times
                    .map((t, i) => {
                      const emoji =
                        MEDITATION_EMOJI[course.meditationTypes?.[i] ?? 'none'];
                      const timeStr =
                        t > 0 && t < 1 ? `${Math.round(t * 60)}秒` : `${t}分`;
                      return emoji ? `${emoji} ${timeStr}` : timeStr;
                    })
                    .join('　')}
                </Text>
              </View>
              <View style={styles.metaBlock}>
                <Text style={styles.modeArrow}>
                  {(course.mode ?? 'countup') === 'countup' ? '▲' : '▼'}
                </Text>
                <Image
                  source={
                    (orins.find((o) => o.id === (course.ringType ?? '4')) ?? orins[0])
                      .image
                  }
                  style={styles.orinThumb}
                />
              </View>
            </View>
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
    paddingHorizontal: 12,
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
    marginBottom: 0,
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
  selectButtonSelected: {
    backgroundColor: '#fff3d0',
    borderWidth: 2,
    borderColor: '#d97706',
  },
  selectText: {
    fontSize: 18,
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#000',
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
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timesBlock: {
    flex: 1,
  },
  metaBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeArrow: {
    fontSize: 16,
    fontFamily: 'ZenMaruGothicMedium',
    color: '#666',
  },
  orinThumb: {
    width: 24,
    height: 24,
    resizeMode: 'cover',
    borderRadius: 12,
  },
});
