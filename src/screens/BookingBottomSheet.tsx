import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';
import { HeartIcon } from '../../assets/icons/HeartIcon';

const { height: screenHeight } = Dimensions.get('window');

type Lesson = {
	id: string;
	time: string;
	title: string;
	place: string;
};

type Props = {
	dateText: string;
	lessons: Lesson[];
	onSelect: (lesson: Lesson) => void;
	onClose: () => void;
	visible: boolean; // 애니메이션 제어를 위한 visible prop 추가
};

export const BookingBottomSheet: React.FC<Props> = ({ 
	dateText, 
	lessons, 
	onSelect, 
	onClose, 
	visible 
}) => {
	const slideAnim = useRef(new Animated.Value(screenHeight - 100)).current; // 초기값을 달력 아래에 일부 보이도록 설정

	useEffect(() => {
		if (visible) {
			// 바텀시트가 나타날 때: 달력 아래에서 위로 슬라이드
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
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
										<View style={styles.cardThumb} />
										<Text style={styles.availableText}>예약가능</Text>
										<View style={styles.HeartIconcontainer}>
											<HeartIcon size={30} color="#5981FA" />
										</View>
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
		paddingVertical: 60,
	},
	noLessonsTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 8,
		textAlign: 'center',
	},
	noLessonsSubtitle: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
		textAlign: 'center',
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
