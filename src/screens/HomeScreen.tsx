import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

// 임시 수업 데이터
const mockLessons = [
  { id: '1', title: '테니스 기초', instructor: '김철수', price: 30000, category: '구기', level: '초급' },
  { id: '2', title: '축구 개인레슨', instructor: '이영희', price: 25000, category: '구기', level: '중급' },
  { id: '3', title: '배드민턴 클래스', instructor: '박민수', price: 20000, category: '구기', level: '초급' },
  { id: '4', title: '농구 슈팅 연습', instructor: '정수현', price: 35000, category: '구기', level: '고급' },
];

const categories = ['전체', '구기', '수영', '헬스', '요가', '댄스'];

export const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchText, setSearchText] = useState('');

  const filteredLessons = mockLessons.filter(lesson => {
    const matchesCategory = selectedCategory === '전체' || lesson.category === selectedCategory;
    const matchesSearch = lesson.title.includes(searchText) || lesson.instructor.includes(searchText);
    return matchesCategory && matchesSearch;
  });

  const renderLessonCard = ({ item }: { item: typeof mockLessons[0] }) => (
    <TouchableOpacity style={styles.lessonCard}>
      <View style={styles.lessonImagePlaceholder}>
        <Text style={styles.lessonImageText}>수업정보</Text>
      </View>
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTitle}>{item.title}</Text>
        <Text style={styles.lessonInstructor}>강사: {item.instructor}</Text>
        <Text style={styles.lessonPrice}>{item.price.toLocaleString()}원</Text>
        <View style={styles.lessonTags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.level}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.category}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>수업예약</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>수업리스트</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{filteredLessons.length}</Text>
        </View>
      </View>

      {/* 검색바 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="수업 또는 강사를 검색하세요"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* 카테고리 필터 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 수업 목록 */}
      <FlatList
        data={filteredLessons}
        renderItem={renderLessonCard}
        keyExtractor={(item) => item.id}
        style={styles.lessonList}
        showsVerticalScrollIndicator={false}
      />

      {/* 하단 탭바 공간 */}
      <View style={styles.bottomTabSpace} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  headerBadge: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerBadgeText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: COLORS.BACKGROUND,
    fontSize: 16,
  },
  categoryContainer: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryButtonText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: COLORS.WHITE,
  },
  lessonList: {
    flex: 1,
    padding: 15,
  },
  lessonCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: 'hidden',
  },
  lessonImagePlaceholder: {
    height: 120,
    backgroundColor: COLORS.GRAY_200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonImageText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  lessonInfo: {
    padding: 15,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 5,
  },
  lessonInstructor: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 5,
  },
  lessonPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: 10,
  },
  lessonTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: COLORS.PRIMARY,
    margin: 15,
    marginTop: 0,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomTabSpace: {
    height: 10,
  },
});
