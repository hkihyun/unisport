import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { COLORS } from '../constants/colors';

// 임시 관심수업 데이터
const mockFavoriteLessons = [
  {
    id: '1',
    title: '초급 요가',
    instructor: '김요가',
    time: '월, 수, 금 18:00-19:00',
    location: '체육관 A',
    price: '15,000원',
    category: '요가',
    isActive: true,
  },
  {
    id: '2',
    title: '중급 테니스',
    instructor: '박테니스',
    time: '화, 목 19:00-20:30',
    location: '테니스장',
    price: '25,000원',
    category: '테니스',
    isActive: true,
  },
  {
    id: '3',
    title: '고급 수영',
    instructor: '이수영',
    time: '토, 일 10:00-11:30',
    location: '수영장',
    price: '30,000원',
    category: '수영',
    isActive: false,
  },
];

export const FavoritesScreen: React.FC = () => {
  const [favorites, setFavorites] = useState(mockFavoriteLessons);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(lesson => lesson.id !== id));
  };

  const renderFavoriteLesson = ({ item }: { item: any }) => (
    <View style={styles.lessonCard}>
      <View style={styles.lessonHeader}>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
          <Text style={styles.lessonInstructor}>{item.instructor}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFavorite(item.id)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.lessonDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>시간:</Text>
          <Text style={styles.detailValue}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>장소:</Text>
          <Text style={styles.detailValue}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>가격:</Text>
          <Text style={styles.detailValue}>{item.price}</Text>
        </View>
      </View>
      
      <View style={styles.lessonFooter}>
        <View style={[styles.categoryBadge, { backgroundColor: item.isActive ? COLORS.SUCCESS : COLORS.GRAY_200 }]}>
          <Text style={[styles.categoryText, { color: item.isActive ? COLORS.WHITE : COLORS.TEXT_SECONDARY }]}>
            {item.category}
          </Text>
        </View>
        <TouchableOpacity style={[styles.bookButton, !item.isActive && styles.disabledButton]}>
          <Text style={[styles.bookButtonText, !item.isActive && styles.disabledButtonText]}>
            {item.isActive ? '수업 신청' : '신청 마감'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>관심수업</Text>
          <Text style={styles.headerSubtitle}>
            마음에 드는 수업을 저장하고{'\n'}
            언제든지 확인할 수 있어요!
          </Text>
        </View>

        {/* 통계 카드 */}
        <View style={styles.statsSection}>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{favorites.length}</Text>
              <Text style={styles.statLabel}>저장된 수업</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {favorites.filter(lesson => lesson.isActive).length}
              </Text>
              <Text style={styles.statLabel}>신청 가능</Text>
            </View>
          </View>
        </View>

        {/* 관심수업 목록 */}
        <View style={styles.favoritesSection}>
          <Text style={styles.sectionTitle}>저장된 수업</Text>
          {favorites.length > 0 ? (
            <FlatList
              data={favorites}
              renderItem={renderFavoriteLesson}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💝</Text>
              <Text style={styles.emptyTitle}>아직 관심수업이 없어요</Text>
              <Text style={styles.emptyDescription}>
                홈에서 마음에 드는 수업을 찾아{'\n'}
                하트 버튼을 눌러보세요!
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.WHITE,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsSection: {
    padding: 24,
  },
  statsCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.BORDER_LIGHT,
    marginHorizontal: 20,
  },
  favoritesSection: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  lessonCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  lessonInstructor: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.ERROR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
  lessonDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    width: 50,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: COLORS.GRAY_200,
  },
  bookButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: COLORS.TEXT_SECONDARY,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpace: {
    height: 20,
  },
});
