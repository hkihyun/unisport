import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

// 임시 수업 데이터 (기존 HomeScreen 내용)
const mockLessons = [
	{ id: '1', title: '테니스 기초', instructor: '김철수', price: 30000, category: '구기', level: '초급' },
	{ id: '2', title: '축구 개인레슨', instructor: '이영희', price: 25000, category: '구기', level: '중급' },
	{ id: '3', title: '배드민턴 클래스', instructor: '박민수', price: 20000, category: '구기', level: '초급' },
	{ id: '4', title: '농구 슈팅 연습', instructor: '정수현', price: 35000, category: '구기', level: '고급' },
];

const categories = ['전체', '구기', '수영', '헬스', '요가', '댄스'];

export const LessonListScreen: React.FC = () => {
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
				<View style={styles.lessonImageIcon}>
					<Text style={styles.lessonImageText}>수업</Text>
				</View>
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
		<View style={styles.container}>
			<ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
				{/* 헤더 */}
				<View style={styles.header}>
					<View style={styles.headerContent}>
						<Text style={styles.headerTitle}>수업 리스트</Text>
						<View style={styles.headerBadge}>
							<Text style={styles.headerBadgeText}>{filteredLessons.length}</Text>
						</View>
					</View>
					<Text style={styles.headerSubtitle}>원하는 스포츠 수업을 찾아보세요</Text>
				</View>

				{/* 검색바 */}
				<View style={styles.searchContainer}>
					<View style={styles.searchWrapper}>
						<TextInput
							style={styles.searchInput}
							placeholder="수업 또는 강사를 검색하세요"
							placeholderTextColor={COLORS.TEXT_MUTED}
							value={searchText}
							onChangeText={setSearchText}
						/>
					</View>
				</View>

				{/* 카테고리 필터 */}
				<View style={styles.categorySection}>
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
				</View>

				{/* 수업 목록 */}
				<View style={styles.lessonSection}>
					<FlatList
						data={filteredLessons}
						renderItem={renderLessonCard}
						keyExtractor={(item) => item.id}
						style={styles.lessonList}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.lessonListContent}
						contentInsetAdjustmentBehavior="never"
						scrollEnabled={false}
					/>
				</View>

				{/* 하단 탭바 공간 */}
				<View style={styles.bottomTabSpace} />
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.BACKGROUND_SECONDARY,
	},
	scrollContainer: {
		flex: 1,
	},
	header: {
		backgroundColor: COLORS.WHITE,
		paddingHorizontal: 24,
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.BORDER_LIGHT,
		shadowColor: COLORS.SHADOW,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	headerContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: COLORS.TEXT_PRIMARY,
		letterSpacing: -0.5,
	},
	headerSubtitle: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
		lineHeight: 20,
	},
	headerBadge: {
		backgroundColor: COLORS.PRIMARY,
		borderRadius: 16,
		minWidth: 28,
		height: 28,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 10,
		shadowColor: COLORS.SHADOW,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	headerBadgeText: {
		color: COLORS.WHITE,
		fontSize: 12,
		fontWeight: '600',
	},
	searchContainer: {
		paddingHorizontal: 24,
		paddingVertical: 12,
		backgroundColor: COLORS.WHITE,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.BORDER_LIGHT,
	},
	searchWrapper: {
		shadowColor: COLORS.SHADOW,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	searchInput: {
		height: 48,
		borderWidth: 1.5,
		borderColor: COLORS.BORDER,
		borderRadius: 12,
		paddingHorizontal: 16,
		backgroundColor: COLORS.WHITE,
		fontSize: 16,
		color: COLORS.TEXT_PRIMARY,
	},
	categorySection: {
		backgroundColor: COLORS.WHITE,
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.BORDER_LIGHT,
		shadowColor: COLORS.SHADOW,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 1,
		marginBottom: 0,
	},
	categoryContainer: {
		paddingVertical: 8,
	},
	categoryButton: {
		backgroundColor: COLORS.BACKGROUND_SECONDARY,
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 24,
		marginRight: 12,
		borderWidth: 1,
		borderColor: COLORS.BORDER_LIGHT,
	},
	categoryButtonActive: {
		backgroundColor: COLORS.PRIMARY,
		borderColor: COLORS.PRIMARY,
	},
	categoryButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: COLORS.TEXT_SECONDARY,
	},
	categoryButtonTextActive: {
		color: COLORS.WHITE,
	},
	lessonSection: {
		backgroundColor: COLORS.BACKGROUND_SECONDARY,
		paddingHorizontal: 24,
		paddingTop: 20,
		paddingBottom: 20,
		marginTop: 0,
	},
	lessonList: {
		backgroundColor: COLORS.BACKGROUND_SECONDARY,
	},
	lessonListContent: {
		paddingBottom: 24,
	},
	lessonCard: {
		backgroundColor: COLORS.WHITE,
		borderRadius: 16,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: COLORS.BORDER_LIGHT,
		overflow: 'hidden',
		shadowColor: COLORS.SHADOW,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 3,
	},
	lessonImagePlaceholder: {
		height: 140,
		backgroundColor: COLORS.GRAY_100,
		justifyContent: 'center',
		alignItems: 'center',
	},
	lessonImageIcon: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: COLORS.PRIMARY_SUBTLE,
		justifyContent: 'center',
		alignItems: 'center',
	},
	lessonImageText: {
		fontSize: 14,
		color: COLORS.PRIMARY,
		fontWeight: '600',
	},
	lessonInfo: {
		padding: 20,
	},
	lessonTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 8,
		letterSpacing: -0.3,
	},
	lessonInstructor: {
		fontSize: 15,
		color: COLORS.TEXT_SECONDARY,
		marginBottom: 12,
		lineHeight: 20,
	},
	lessonPrice: {
		fontSize: 18,
		fontWeight: '700',
		color: COLORS.PRIMARY,
		marginBottom: 16,
	},
	lessonTags: {
		flexDirection: 'row',
		gap: 8,
		marginBottom: 16,
	},
	tag: {
		backgroundColor: COLORS.BACKGROUND_SECONDARY,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
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
		marginHorizontal: 20,
		marginBottom: 20,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: 'center',
		shadowColor: COLORS.SHADOW,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 4,
	},
	bookButtonText: {
		color: COLORS.WHITE,
		fontSize: 16,
		fontWeight: '600',
	},
	bottomTabSpace: {
		height: -100,
	},
});

export default LessonListScreen;


