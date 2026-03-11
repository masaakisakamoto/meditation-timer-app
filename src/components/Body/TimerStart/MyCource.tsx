// src/components/Body/TimerStart/MyCource.tsx
import React, { FC, useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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

const MyCource: FC<Props> = ({ courses, orins, selectedId, onSelect, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setIsEditing(false);
    }, []),
  );
  useEffect(() => {
    if (courses.length === 0) setIsEditing(false);
  }, [courses.length]);
  return (
    <View style={styles.container}>
      <View style={[styles.titleRow, courses.length === 0 && styles.titleRowNoItems]}>
        <View style={styles.titleSpacer} />
        <Text style={styles.titleText}>マイコース</Text>
        <Pressable
          style={[
            styles.editButton,
            isEditing && styles.editButtonActive,
            courses.length === 0 && styles.editButtonDisabled,
          ]}
          disabled={courses.length === 0}
          onPress={() => setIsEditing((v) => !v)}
        >
          <Text style={styles.editButtonText}>{isEditing ? '完了' : '編集'}</Text>
        </Pressable>
      </View>

      {courses.length === 0 ? (
        <View style={styles.guideItem}>
          <View style={styles.guideCard}>
            <Text style={styles.guideText}>
              タイマー設定でマイコースを設定してください
            </Text>
          </View>
        </View>
      ) : (
        courses.map((course) => (
          <View key={course.id} style={styles.courseItem}>
            {/* 編集時マイナスボタン */}
            {isEditing && (
              <Pressable style={styles.minusButton} onPress={() => onDelete(course.id)}>
                <Text style={styles.minusText}>－</Text>
              </Pressable>
            )}
            {/* 選択ボタン */}
            <Pressable
              style={[
                styles.selectButton,
                selectedId === course.id && styles.selectButtonSelected,
              ]}
              onPress={() => !isEditing && onSelect(course)}
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
          </View>
        ))
      )}
    </View>
  );
};

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRowNoItems: {},
  titleText: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'ZenMaruGothic-Medium',
    textAlign: 'center',
  },
  titleSpacer: {
    width: 40,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonActive: {
    backgroundColor: '#fcd34d',
  },
  editButtonDisabled: {
    opacity: 0.4,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'ZenMaruGothic-Medium',
    color: '#d97706',
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  minusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fb923c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  minusText: {
    fontSize: 20,
    color: '#fff',
    lineHeight: 24,
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
