import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';
import { LessonService } from '../services/lessonService';
import { BackendLessonDetail } from '../types';

const { width } = Dimensions.get('window');

export const BookingConfirmScreen: React.FC<any> = ({ navigation, route }) => {
	const { type, lessonId, reservationId } = route.params;
	const [lessonDetail, setLessonDetail] = useState<BackendLessonDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLessonDetail = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const data = await LessonService.getLessonDetail(lessonId);
				setLessonDetail(data);
			} catch (err) {
				console.error('수업 상세 정보 조회 실패:', err);
				setError('수업 정보를 불러오는데 실패했습니다.');
			} finally {
				setIsLoading(false);
			}
		};

		if (lessonId) {
			fetchLessonDetail();
		}
	}, [lessonId]);

	// 로딩 중일 때
	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={COLORS.PRIMARY} />
				<Text style={styles.loadingText}>수업 정보를 불러오는 중...</Text>
			</View>
		);
	}

	// 에러가 있을 때
	if (error || !lessonDetail) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>{error || '수업 정보를 찾을 수 없습니다.'}</Text>
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryButton}>
					<Text style={styles.retryButtonText}>뒤로 가기</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// 날짜와 시간 포맷팅
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
		return `${month}.${day}(${dayOfWeek})`;
	};

	const formatTime = (timeString: string) => {
		// "02:00:00" 형식을 "오후 2:30" 형식으로 변환
		const [hours, minutes] = timeString.split(':');
		const hour = parseInt(hours);
		const minute = parseInt(minutes);
		
		if (hour < 12) {
			return `오전 ${hour}:${minute.toString().padStart(2, '0')}`;
		} else if (hour === 12) {
			return `오후 ${hour}:${minute.toString().padStart(2, '0')}`;
		} else {
			return `오후 ${hour - 12}:${minute.toString().padStart(2, '0')}`;
		}
	};
	
	return (
		<View style={styles.container}>
			{/* 상단 고정 영역 */}
			<View style={styles.fixedTopSection}>
				{/* 뒤로가기 버튼 */}
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
					<Text style={styles.arrow}>‹</Text>
				</TouchableOpacity>
				
				{/* 제목 */}
				<Text style={styles.screenTitle}>
					{type === 'book' ? '예약 완료' : '관심 등록하기'}
				</Text>
			</View>
			
			{/* 구분선 */}
			<View style={styles.headerDivider} />
			
			{/* 메인 콘텐츠 */}
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

				
				{/* 수업 정보 카드 */}
				<View style={styles.lessonCard}>
					<Text style={styles.lessonTitle}>{lessonDetail.title}</Text>
					<Text style={styles.lessonSchedule}>
						일정 {formatDate(lessonDetail.lessonDate)} {formatTime(lessonDetail.lessonTime)}
					</Text>
					<Text style={styles.instructorName}>강사 정보</Text>
					<View style={styles.locationRow}>
						<View style={styles.locationIcon} />
						<Text style={styles.locationText}>{lessonDetail.location}</Text>
					</View>
					
					{/* 추가 정보 */}
					<View style={styles.additionalInfo}>
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>종목:</Text>
							<Text style={styles.infoValue}>{lessonDetail.sport}</Text>
						</View>
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>난이도:</Text>
							<Text style={styles.infoValue}>
								{lessonDetail.level === 1 ? '초보자' : 
								 lessonDetail.level === 2 ? '초급' : 
								 lessonDetail.level === 3 ? '중급' : 
								 lessonDetail.level === 4 ? '고급' : '전문가'}
							</Text>
						</View>
						{type === 'book' && reservationId && (
							<View style={styles.infoRow}>
								<Text style={styles.infoLabel}>예약 번호:</Text>
								<Text style={styles.infoValue}>#{reservationId}</Text>
							</View>
						)}
					</View>
				</View>
				
				{/* 하단 여백 */}
				<View style={styles.bottomSpacing} />
			</ScrollView>
			
			{/* 하단 고정 버튼 */}
			<View style={styles.bottomButtonContainer}>
				<TouchableOpacity 
					style={styles.primaryButton}
					onPress={() => {
						// 홈 화면으로 이동
						navigation.navigate('Home');
					}}
				>
					<Text style={styles.primaryButtonText}>
						{type === 'book' ? '홈으로 이동' : '관심등록확인'}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.BACKGROUND,
	},
	
	// 상단 고정 영역
	fixedTopSection: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 14,
		paddingVertical: 19,
		backgroundColor: COLORS.BACKGROUND,
		marginTop: 45,
	},
	backButton: {
		width: 29,
		height: 29,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 7,
	},
	arrow: {
		fontSize: 28,
		color: COLORS.GRAY_400,
		fontWeight: '600',
		lineHeight: 29,
	},
	screenTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: COLORS.PRIMARY,
		lineHeight: 24,
	},
	
	// 구분선
	headerDivider: {
		height: 1.5,
		backgroundColor: COLORS.BORDER,
		marginHorizontal: 0,
	},
	sectionDivider: {
		height: 8,
		backgroundColor: COLORS.BACKGROUND_SECONDARY,
		opacity: 0.3,
		marginHorizontal: 0,
	},
	
	scrollView: {
		flex: 1,
	},
	
	// 안내 문구 섹션
	instructionSection: {
		alignItems: 'flex-start',
		paddingHorizontal: 32,
		paddingVertical: 24,
		marginTop: 90,
		marginBottom: -55,
	},
	instructionText: {
		fontSize: 13,
		color: '#6A6A6A',
		lineHeight: 20,
		textAlign: 'center',
		fontWeight: '400',
	},
	
	// 수업 정보 카드
	lessonCard: {
		backgroundColor: '#EDF2F8',
		marginHorizontal: 20,
		padding: 24,
		borderRadius: 16,
		marginBottom: 24,
		top: 50,
	},
	lessonTitle: {
		fontSize: 22,
		fontWeight: '700',
		color: COLORS.TEXT_BRAND,
		lineHeight: 27,
		marginBottom: 12,
	},
	lessonSchedule: {
		fontSize: 16,
		color: COLORS.GRAY_500,
		lineHeight: 20,
		marginBottom: 12,
		fontWeight: '400',
	},
	instructorName: {
		fontSize: 18,
		color: COLORS.TEXT_BRAND,
		lineHeight: 22,
		top: 5,
		marginBottom: 16,
		fontWeight: '600',
	},
	locationRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	locationIcon: {
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: COLORS.GRAY_500,
		marginRight: 8,
	},
	locationText: {
		fontSize: 16,
		color: COLORS.GRAY_500,
		lineHeight: 20,
		fontWeight: '400',
	},
	
	// 추가 정보
	additionalInfo: {
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: COLORS.BORDER,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	infoLabel: {
		fontSize: 14,
		color: COLORS.GRAY_500,
		fontWeight: '400',
	},
	infoValue: {
		fontSize: 14,
		color: COLORS.TEXT_BRAND,
		fontWeight: '600',
	},
	
	// 하단 여백
	bottomSpacing: {
		height: 120,
	},
	
	// 하단 버튼 컨테이너
	bottomButtonContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: COLORS.BACKGROUND,
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	primaryButton: {
		backgroundColor: COLORS.PRIMARY,
		paddingVertical: 16,
		borderRadius: 30,
		alignItems: 'center',
		height: 55,
		justifyContent: 'center',
		marginBottom: 12,
	},
	primaryButtonText: {
		color: COLORS.WHITE,
		fontSize: 18,
		fontWeight: '600',
		lineHeight: 22,
	},
	secondaryButton: {
		backgroundColor: 'transparent',
		paddingVertical: 16,
		borderRadius: 30,
		alignItems: 'center',
		height: 55,
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: COLORS.PRIMARY,
	},
	secondaryButtonText: {
		color: COLORS.PRIMARY,
		fontSize: 18,
		fontWeight: '600',
		lineHeight: 22,
	},
	// 로딩 중 화면 스타일
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.BACKGROUND,
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
		color: COLORS.GRAY_500,
	},
	// 에러 화면 스타일
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.BACKGROUND,
		paddingHorizontal: 20,
	},
	errorText: {
		fontSize: 16,
		color: COLORS.GRAY_500,
		textAlign: 'center',
		marginBottom: 20,
	},
	retryButton: {
		backgroundColor: COLORS.PRIMARY,
		paddingVertical: 12,
		paddingHorizontal: 25,
		borderRadius: 30,
	},
	retryButtonText: {
		color: COLORS.WHITE,
		fontSize: 16,
		fontWeight: '600',
	},

});

export default BookingConfirmScreen;


