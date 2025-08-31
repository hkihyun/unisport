import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, Alert, Image } from 'react-native';
import { COLORS } from '../constants/colors';
import { HeartIcon } from '../../assets/icons/HeartIcon';
import { lessonLikeService } from '../services/lessonLikeService';
import { LessonService } from '../services/lessonService';

const { height: screenHeight } = Dimensions.get('window');

type Lesson = {
	id: string;
	time: string;
	title: string;
	place: string;
	imageUrl?: string; // 이미지 URL 추가
};

type Props = {
	dateText: string;
	lessons: Lesson[];
	onSelect: (lesson: Lesson) => void;
	onClose: () => void;
	visible: boolean; // 애니메이션 제어를 위한 visible prop 추가
	userId?: number; // 사용자 ID 추가
};

export const BookingBottomSheet: React.FC<Props> = ({ 
	dateText, 
	lessons, 
	onSelect, 
	onClose, 
	visible,
	userId = 1 // 기본값 설정, 실제로는 props로 전달받아야 함
}) => {
	const slideAnim = useRef(new Animated.Value(screenHeight - 100)).current; // 초기값을 달력 아래에 일부 보이도록 설정
	
	// 각 수업별로 좋아요 상태를 관리하는 state
	const [favoriteLessons, setFavoriteLessons] = useState<Set<string>>(new Set());
	
	// 수업 이미지들을 관리하는 state
	const [lessonImages, setLessonImages] = useState<Record<string, string>>({});

	// 수업 이미지 가져오기 함수
	const fetchLessonImages = async () => {
		try {
			const imagePromises = lessons.map(async (lesson) => {
				try {
					const imageUrl = await LessonService.getLessonImage(lesson.id);
					return { id: lesson.id, imageUrl };
				} catch (error) {
					console.error(`수업 ${lesson.id} 이미지 가져오기 실패:`, error);
					return { id: lesson.id, imageUrl: null };
				}
			});

			const imageResults = await Promise.all(imagePromises);
			const newLessonImages: Record<string, string> = {};
			
			imageResults.forEach((result) => {
				if (result.imageUrl) {
					newLessonImages[result.id] = result.imageUrl;
				}
			});

			setLessonImages(newLessonImages);
		} catch (error) {
			console.error('수업 이미지들 가져오기 실패:', error);
		}
	};

	// 좋아요 토글 함수
	const toggleFavorite = async (lessonId: string) => {
		if (!userId) {
			Alert.alert('오류', '사용자 정보를 찾을 수 없습니다.');
			return;
		}

		try {
			const lessonIdNum = parseInt(lessonId);
			await lessonLikeService.addToFavorites(lessonIdNum, userId);
			
			// 성공 시 로컬 상태 업데이트
			setFavoriteLessons(prev => {
				const newSet = new Set(prev);
				if (newSet.has(lessonId)) {
					newSet.delete(lessonId);
				} else {
					newSet.add(lessonId);
				}
				return newSet;
			});

			Alert.alert('성공', '관심 레슨으로 등록되었습니다.');
		} catch (error: any) {
			Alert.alert('오류', error.message);
		}
	};

	useEffect(() => {
		if (visible) {
			// 바텀시트가 나타날 때: 달력 아래에서 위로 슬라이드
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
			
			// 수업 이미지들 가져오기
			fetchLessonImages();
		} else {
			// 바텀시트가 사라질 때: 달력 아래로 슬라이드 (일부만 보이도록)
			Animated.timing(slideAnim, {
				toValue: screenHeight - 100, // 달력 아래에 100px만큼 보이도록
				duration: 250,
				useNativeDriver: true,
			}).start();
		}
	}, [visible, slideAnim]);

	if (!visible) return null;

	return (
		<>
			{/* 배경 터치 영역 - 화면 터치 시 닫기 */}
			<TouchableOpacity 
				style={styles.backdropTouchable} 
				onPress={onClose}
				activeOpacity={1}
			/>
			
			{/* 바텀시트 */}
			<Animated.View 
				style={[
					styles.sheet,
					{
						transform: [{ translateY: slideAnim }]
					}
				]}
			>
				{/* 수업이 없을 때 메시지 표시 */}
				{lessons.length === 0 ? (
					<View style={styles.noLessonsContainer}>
						<Text style={styles.noLessonsTitle}>해당 날짜에 등록된 수업이 없습니다</Text>
						<Text style={styles.noLessonsSubtitle}>다른 날짜를 선택해보세요</Text>
					</View>
				) : (
					/* 스크롤 가능한 전체 영역 */
					<ScrollView
						showsVerticalScrollIndicator={false}
						nestedScrollEnabled={true}
						contentContainerStyle={{ 
							paddingBottom: 100
						}}
					>
						{lessons.map((l, idx) => (
							<View key={l.id} style={styles.timelineRow}>
								{/* 타임라인 좌측 축 */}
								<View style={styles.timelineCol}>
									{idx !== 0 && <View style={styles.timelineLineTop} />}
									<View style={styles.timelineDot} />
									{idx !== lessons.length - 1 && <View style={styles.timelineLineBottom} />}
								</View>
								{/* 카드 */}
								<TouchableOpacity style={styles.lessonCard} onPress={() => onSelect(l)}>
									<View style={styles.cardLeft}>
										<Text style={styles.cardTime}>{l.time}</Text>
										<Text style={styles.cardTitle}>{l.title}</Text>
										<Text style={styles.cardPlace}>{l.place}</Text>
									</View>
									<View style={styles.cardRight}>
										{lessonImages[l.id] ? (
											<Image 
												source={{ uri: lessonImages[l.id] }} 
												style={styles.cardThumb}
												resizeMode="cover"
											/>
										) : (
											<View style={styles.cardThumb} />
										)}
										<Text style={styles.availableText}>예약가능</Text>
										<TouchableOpacity 
											style={styles.HeartIconcontainer}
											onPress={(e) => {
												e.stopPropagation(); // 카드 클릭 이벤트와 분리
												toggleFavorite(l.id);
											}}
										>
											<HeartIcon 
												size={30} 
												color="#5981FA" 
												filled={favoriteLessons.has(l.id)}
											/>
										</TouchableOpacity>
									</View>
								</TouchableOpacity>
							</View>
						))}
					</ScrollView>
				)}
			</Animated.View>
		</>
	);
};

const styles = StyleSheet.create({
	backdropTouchable: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 999,
	},
	sheet: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: COLORS.WHITE,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		padding: 16,
		borderTopWidth: 1,
		borderColor: COLORS.BORDER,
		shadowColor: COLORS.SHADOW,
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 12,
		maxHeight: '68%',
		zIndex: 1000,
	},
	noLessonsContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 110
	},
	noLessonsTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 8,
		textAlign: 'center',
		top: -70
	},
	noLessonsSubtitle: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
		textAlign: 'center',
		top: -60
	},
	/* 타임라인 레이아웃 */
	timelineRow: { 
		flexDirection: 'row', 
		alignItems: 'stretch', 
		marginBottom: 16, 
		paddingHorizontal: 24 
	},
	timelineCol: { 
		width: 5, 
		alignItems: 'center',
		left: -10
	},
	timelineLineTop: { 
		flex: 1, 
		width: 2, 
		backgroundColor: '#5981FA' 
	},
	timelineLineBottom: { 
		flex: 1, 
		width: 2, 
		backgroundColor: '#5981FA' 
	},
	timelineDot: { 
		width: 21, 
		height: 21, 
		borderRadius: 10.5, 
		backgroundColor: '#5981FA' 
		
	},
	/* 카드 */
	lessonCard: { 
		backgroundColor: '#EDF2F8', 
		borderRadius: 16, 
		padding: 20, 
		flexDirection: 'row', 
		alignItems: 'center',
		height: 125,
		width: 324,
		elevation: 3,
		left: 8,
	},
	cardLeft: { 
		flex: 1 
	},
	cardRight: { 
		width: 110, 
		alignItems: 'flex-end', 
		justifyContent: 'center' 
	},
	cardThumb: { 
		width: 94, 
		height: 94, 
		borderRadius: 0, 
		backgroundColor: '#AEC7EB',
		top: 20,
		left: -30
	},
	heartOutline: { 
		position: 'absolute', 
		top: 35, 
		right: -6,
		width: 28, 
		height: 28, 
		borderWidth: 2, 
		borderColor: '#5981FA', 
		borderRadius: 6 
	},
	cardTime: { 
		fontSize: 15, 
		color: '#2B308B', 
		marginBottom: 15 
	},
	cardTitle: { 
		fontSize: 20, 
		fontWeight: '700', 
		color: '#2B308B', 
		marginBottom: 15 
	},
	cardPlace: { 
		fontSize: 13, 
		color: '#696E83', 
		marginBottom: 5 
	},
	availableText: { 
		fontSize: 15, 
		color: '#5981FA', 
		fontWeight: '400',
		marginTop: 8,
		left: -50,
		top: -10
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
		paddingHorizontal: 24,
	},
	closeIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#E5E7EB',
		justifyContent: 'center',
		alignItems: 'center',
	},
	closeIconInner: {
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: '#6B7280',
	},
	HeartIconcontainer: {
		position: 'absolute',
		top: 39,
		right: -9,
		width: 28,
		height: 28,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1,
	},
});

export default BookingBottomSheet;
