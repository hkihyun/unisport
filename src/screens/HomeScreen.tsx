import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import ReservationService from '../services/reservationService';
import { LessonService } from '../services/lessonService';
import { BackendReservation, BackendLessonDetail } from '../types';
import { useAuth } from '../hooks/useAuth';
import { SCREENS } from '../constants/screens';

export const HomeScreen: React.FC<any> = ({ navigation }) => {
	const { isAuthenticated } = useAuth(); // 로그인 상태 확인
	const [reservations, setReservations] = useState<BackendReservation[]>([]);
	const [todayReservations, setTodayReservations] = useState<BackendReservation[]>([]);
	const [lessonDetails, setLessonDetails] = useState<{ [key: number]: BackendLessonDetail }>({});
	const [loading, setLoading] = useState(true);
	const [todayLoading, setTodayLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [todayError, setTodayError] = useState<string | null>(null);

	useEffect(() => {
		if (isAuthenticated) {
			fetchUserReservations();
			fetchTodayReservations();
		} else {
			// 로그인하지 않은 경우 로딩 상태 해제
			setLoading(false);
			setTodayLoading(false);
		}
	}, [isAuthenticated]);

	// 수업 상세 정보 가져오기
	const fetchLessonDetails = async (lessonIds: number[]) => {
		const newLessonDetails: { [key: number]: BackendLessonDetail } = {};
		
		for (const lessonId of lessonIds) {
			try {
				const lessonDetail = await LessonService.getLessonDetail(lessonId);
				newLessonDetails[lessonId] = lessonDetail;
			} catch (err) {
				console.error(`수업 ${lessonId} 상세 정보 조회 실패:`, err);
			}
		}
		
		setLessonDetails(prev => ({ ...prev, ...newLessonDetails }));
	};

	const fetchUserReservations = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await ReservationService.getUserReservations(1); // userId 1 사용
			setReservations(response.content);
			
			// 수업 상세 정보 가져오기
			const lessonIds = response.content.map(reservation => reservation.lessonId);
			if (lessonIds.length > 0) {
				await fetchLessonDetails(lessonIds);
			}
		} catch (err) {
			console.error('예약 정보 조회 실패:', err);
			setError('예약 정보를 불러오는데 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	const fetchTodayReservations = async () => {
		try {
			setTodayLoading(true);
			setTodayError(null);
			const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
			const response = await ReservationService.getReservationsByDate(1, today); // userId 1, 오늘 날짜
			setTodayReservations(response.content);
			
			// 오늘 수업 상세 정보 가져오기
			const lessonIds = response.content.map(reservation => reservation.lessonId);
			if (lessonIds.length > 0) {
				await fetchLessonDetails(lessonIds);
			}
		} catch (err) {
			console.error('오늘 예약 정보 조회 실패:', err);
			setTodayError('오늘 예약 정보를 불러오는데 실패했습니다.');
		} finally {
			setTodayLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? '오후' : '오전';
		const displayHours = hours > 12 ? hours - 12 : hours;
		
		return `${month}.${day} ${ampm}${displayHours}:${minutes.toString().padStart(2, '0')}`;
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? '오후' : '오전';
		const displayHours = hours > 12 ? hours - 12 : hours;
		
		return `${ampm}${displayHours}:${minutes.toString().padStart(2, '0')}`;
	};

	// 오늘의 첫 번째 수업 정보
	const todayFirstLesson = todayReservations.length > 0 ? todayReservations[0] : null;
	const todayFirstLessonDetail = todayFirstLesson ? lessonDetails[todayFirstLesson.lessonId] : null;

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.container}>
				{/* 헤더 */}
				<View style={styles.header}>
					<View style={styles.logoContainer}>
						<View style={styles.logo} />
						<Text style={styles.appName}>UniSportsCard</Text>
					</View>
				</View>
				
				{/* 날짜 헤더 */}
				<View style={styles.dateHeaderContainer}>
					<Text style={styles.dateHeaderText}>8월 2일 토요일</Text>
				</View>
				
				{/* 오늘의 수업 요약 카드 */}
				<View style={styles.todayClassCard}>
					{!isAuthenticated ? (
						// 로그인하지 않은 경우
						<>
							<View style={styles.cardHeader}>
								<Text style={styles.classTitle}>환영합니다!</Text>
								<View style={styles.checkmarkIcon} />
							</View>
							<Text style={styles.classTime}>UniSportsCard에 오신 것을 환영합니다</Text>
							<Text style={styles.classLocation}>로그인하여 개인 맞춤 수업을 확인해보세요</Text>
						</>
					) : todayLoading ? (
						<View style={styles.todayLoadingContainer}>
							<ActivityIndicator size="small" color={COLORS.WHITE} />
							<Text style={styles.todayLoadingText}>오늘 수업 정보를 불러오는 중...</Text>
						</View>
					) : todayError ? (
						<View style={styles.todayErrorContainer}>
							<Text style={styles.todayErrorText}>{todayError}</Text>
						</View>
					) : todayFirstLesson && todayFirstLessonDetail ? (
						<>
							<View style={styles.cardHeader}>
								<Text style={styles.classTitle}>{todayFirstLessonDetail.title}</Text>
								<View style={styles.checkmarkIcon} />
							</View>
							<Text style={styles.classTime}>
								{formatTime(todayFirstLesson.createdAt)}
							</Text>
							<Text style={styles.classLocation}>{todayFirstLessonDetail.location || '위치 정보 없음'}</Text>
						</>
					) : (
						<>
							<View style={styles.cardHeader}>
								<Text style={styles.classTitle}>오늘 예정된 수업 없음</Text>
								<View style={styles.checkmarkIcon} />
							</View>
							<Text style={styles.classLocation}>새로운 수업을 예약해보세요</Text>
						</>
					)}
				</View>
				
				{/* 액션 버튼들 */}
				<View style={styles.actionButtons}>
					<TouchableOpacity style={styles.actionButton}>
						<Text style={styles.actionButtonText}>관심과목</Text>
						<Text style={styles.heartIcon}>♥</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.actionButton}>
						<Text style={styles.actionButtonText}>리뷰쓰기</Text>
						<Text style={styles.editIcon}>✎</Text>
					</TouchableOpacity>
				</View>
				
				{/* 다가오는 일정 섹션 */}
				<View style={styles.upcomingSection}>
					<Text style={styles.sectionTitle}>다가오는 일정</Text>
					
					{!isAuthenticated ? (
						// 로그인하지 않은 경우
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>로그인하여 나만의 수업 일정을 관리해보세요</Text>
							<TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate(SCREENS.LOGIN)}>
								<Text style={styles.loginButtonText}>로그인하기</Text>
							</TouchableOpacity>
						</View>
					) : loading ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="large" color={COLORS.PRIMARY} />
							<Text style={styles.loadingText}>예약 정보를 불러오는 중...</Text>
						</View>
					) : error ? (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>{error}</Text>
							<TouchableOpacity style={styles.retryButton} onPress={fetchUserReservations}>
								<Text style={styles.retryButtonText}>다시 시도</Text>
							</TouchableOpacity>
						</View>
					) : reservations.length === 0 ? (
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>예약된 수업이 없습니다.</Text>
						</View>
					) : (
						<View style={styles.timelineContainer}>
							{reservations.map((reservation, index) => {
								const lessonDetail = lessonDetails[reservation.lessonId];
								return (
									<View key={reservation.id} style={styles.timelineEntry}>
										<View style={styles.timelineContainer}>
											<View style={styles.timelineDot} />
											{index < reservations.length - 1 && <View style={styles.timelineLine} />}
										</View>
										<View style={styles.entryContent}>
											<Text style={styles.entryTitle}>
												{lessonDetail ? lessonDetail.title : `수업 #${reservation.lessonId}`}
											</Text>
											<Text style={styles.entryDateTime}>
												{formatDate(reservation.createdAt)}
											</Text>
											<Text style={styles.entryLocation}>
												{lessonDetail ? lessonDetail.location : '위치 정보 없음'}
											</Text>
										</View>
										<View style={styles.optionsIcon} />
									</View>
								);
							})}
						</View>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	root: { 
		flex: 1, 
		backgroundColor: COLORS.BACKGROUND
	},
	container: { 
		flex: 1,
		paddingBottom: 20,
	},
	
	// 헤더
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderBottomWidth: 1.5,
		borderBottomColor: '#E2E8EE',
		marginBottom: 30,
	},
	logoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	logo: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: COLORS.GRAY_300,
		marginRight: 12,
	},
	appName: {
		fontSize: 21,
		fontWeight: '600',
		color: COLORS.PRIMARY,
	},
	pageIndicator: {
		fontSize: 16,
		fontWeight: '500',
		color: COLORS.GRAY_500,
	},
	
	// 날짜 헤더
	dateHeaderContainer: {
		paddingHorizontal: 20,
		paddingBottom: 16,
	},
	dateHeaderText: {
		fontSize: 21,
		fontWeight: '700',
		color: '#5981FA',
		lineHeight: 24,
		fontFamily: 'Inter',
		fontStyle: 'normal',

	},
	
	// 오늘의 수업 요약 카드
	todayClassCard: {
		backgroundColor: COLORS.PRIMARY,
		marginHorizontal: 11,
		padding: 24,
		borderRadius: 20,
		marginBottom: 24,
		height: 128,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 2,
	},
	classTitle: {
		fontSize: 21,
		fontWeight: '700',
		color: COLORS.WHITE,
		lineHeight: 40,
	},
	checkmarkIcon: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: COLORS.WHITE,
		justifyContent: 'center',
		alignItems: 'center',
	},
	classTime: {
		fontSize: 17,
		color: COLORS.WHITE,
		lineHeight: 21,
		marginBottom: 8,
		fontWeight: '400',
	},
	classLocation: {
		fontSize: 15,
		color: '#FEFEFE',
		lineHeight: 35,
		fontWeight: '500',
	},
	
	// 액션 버튼들
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
		marginBottom: 10,
		gap: 15,
		borderBottomWidth: 1.5,
		borderBottomColor: '#E2E8EE',
		paddingBottom: 25,
	},
	actionButton: {
		width: 174,
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 20,
		borderWidth: 2,
		borderColor: COLORS.PRIMARY,
		backgroundColor:  '#EDF2F8',
	},
	actionButtonText: {
		fontSize: 18,
		fontWeight: '700',
		color: COLORS.PRIMARY,
		marginRight: 5,
	},
	heartIcon: {
		fontSize: 26,
		color: COLORS.PRIMARY,
		fontWeight: '600',
	},
	editIcon: {
		fontSize: 24,
		color: COLORS.PRIMARY,
		fontWeight: '600',
	},
	
	// 다가오는 일정 섹션
	upcomingSection: {
		paddingHorizontal: 16,
		marginTop: 0,
		top: 5
	},
	sectionTitle: {
		fontSize: 21,
		fontWeight: '700',
		color: COLORS.PRIMARY,
		lineHeight: 30,
		marginBottom: 16,
	},
	dateHeader: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.PRIMARY,
		lineHeight: 22,
		marginBottom: 24,
	},
	
	// 타임라인 컨테이너
	timelineContainer: {
		position: 'relative',
		marginRight: 16,
	},
	
	// 타임라인 엔트리
	timelineEntry: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 24,
		position: 'relative',
	},
	timelineDot: {
		width: 21,
		height: 21,
		borderRadius: 10.5,
		backgroundColor: COLORS.PRIMARY,
		marginRight: 16,
		marginTop: 4,
	},
	timelineLine: {
		position: 'absolute',
		width: 2,
		height: 102,
		backgroundColor: COLORS.PRIMARY,
		left: 9.5,
		top: 25,
	},
	entryContent: {
		flex: 1,
	},
	entryTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.TEXT_BRAND,
		lineHeight: 22,
		marginBottom: 8,
	},
	entryDateTime: {
		fontSize: 13,
		color: COLORS.TEXT_BRAND,
		lineHeight: 16,
		marginBottom: 4,
		fontWeight: '400',
	},
	entryLocation: {
		fontSize: 12,
		color: COLORS.TEXT_TERTIARY,
		lineHeight: 15,
		fontWeight: '500',
	},
	optionsIcon: {
		width: 26,
		height: 26,
		borderRadius: 13,
		borderWidth: 1,
		borderColor: COLORS.GRAY_400,
		backgroundColor: 'transparent',
		marginLeft: 16,
		marginTop: 4,
	},
	
	// 로딩 상태
	loadingContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		paddingVertical: 50,
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
		color: COLORS.GRAY_500,
	},
	
	// 에러 상태
	errorContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		paddingVertical: 50,
	},
	errorText: {
		fontSize: 16,
		color: COLORS.ERROR,
		textAlign: 'center',
		marginBottom: 20,
	},
	retryButton: {
		backgroundColor: COLORS.PRIMARY,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
	},
	retryButtonText: {
		color: COLORS.WHITE,
		fontSize: 16,
		fontWeight: '600',
	},
	
	// 빈 상태
	emptyContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		paddingVertical: 50,
	},
	emptyText: {
		fontSize: 16,
		color: COLORS.GRAY_500,
		textAlign: 'center',
	},
	
	// 오늘 수업 로딩 상태
	todayLoadingContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		paddingVertical: 20,
	},
	todayLoadingText: {
		marginTop: 10,
		fontSize: 14,
		color: COLORS.WHITE,
	},
	
	// 오늘 수업 에러 상태
	todayErrorContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		paddingVertical: 20,
	},
	todayErrorText: {
		fontSize: 14,
		color: COLORS.WHITE,
		textAlign: 'center',
	},
	
	// 로그인 버튼
	loginButton: {
		backgroundColor: COLORS.PRIMARY,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 25,
		marginTop: 20,
		alignSelf: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	loginButtonText: {
		color: COLORS.WHITE,
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
	},
	
});

export default HomeScreen;


