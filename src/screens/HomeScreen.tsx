import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import ReservationService from '../services/reservationService';
import { LessonService } from '../services/lessonService';
import { BackendReservation, BackendLessonDetail } from '../types';
import { useAuth } from '../hooks/useAuth';
import { SCREENS } from '../constants/screens';
import { SeeMoreIcon } from '../../assets/icons/SeeMore';

// 안전한 데이터 추출 함수 - 백엔드에서 배열을 직접 반환하므로 단순화
const extractReservations = (response: any): BackendReservation[] => {
	if (!response) return [];
	
	// response가 배열인 경우 (백엔드에서 직접 배열 반환)
	if (Array.isArray(response)) {
		return response;
	}
	
	// response.data가 배열인 경우
	if (response.data && Array.isArray(response.data)) {
		return response.data;
	}
	
	// 예상치 못한 구조인 경우
	console.warn('예상치 못한 API 응답 구조:', response);
	return [];
};

export const HomeScreen: React.FC<any> = ({ navigation }) => {
	const { isAuthenticated, user } = useAuth(); // user 정보 추가
	const [reservations, setReservations] = useState<BackendReservation[]>([]);
	const [todayReservations, setTodayReservations] = useState<BackendReservation[]>([]);
	const [lessonDetails, setLessonDetails] = useState<{ [key: number]: BackendLessonDetail }>({});
	const [loading, setLoading] = useState(true);
	const [todayLoading, setTodayLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [todayError, setTodayError] = useState<string | null>(null);

	useEffect(() => {
		if (isAuthenticated && user) {
			fetchUserReservations();
			fetchTodayReservations();
		} else {
			// 로그인하지 않은 경우 로딩 상태 해제
			setLoading(false);
			setTodayLoading(false);
		}
	}, [isAuthenticated, user]);

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
		if (!user) return;
		
		try {
			setLoading(true);
			setError(null);
			const reservations = await ReservationService.getUserReservations(parseInt(user.id));
			
			setReservations(reservations);
			
			// 수업 상세 정보 가져오기
			if (reservations.length > 0) {
				const lessonIds = reservations.map(reservation => reservation.lessonScheduleId);
				await fetchLessonDetails(lessonIds);
			}
		} catch (err) {
			console.error('예약 정보 조회 실패:', err);
			setError('예약 정보를 불러오는데 실패했습니다.');
			setReservations([]); // 에러 시 빈 배열로 설정
		} finally {
			setLoading(false);
		}
	};

	const fetchTodayReservations = async () => {
		if (!user) return;
		
		try {
			setTodayLoading(true);
			setTodayError(null);
			const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
			const todayReservations = await ReservationService.getReservationsByDate(parseInt(user.id), today);
			
			setTodayReservations(todayReservations);
			
			// 오늘 수업 상세 정보 가져오기
			if (todayReservations.length > 0) {
				const lessonIds = todayReservations.map(reservation => reservation.lessonScheduleId);
				await fetchLessonDetails(lessonIds);
			}
		} catch (err) {
			console.error('오늘 예약 정보 조회 실패:', err);
			setTodayError('오늘 예약 정보를 불러오는데 실패했습니다.');
			setTodayReservations([]); // 에러 시 빈 배열로 설정
		} finally {
			setTodayLoading(false);
		}
	};

	// 동적 날짜 포맷팅 함수
	const getCurrentDateText = () => {
		const now = new Date();
		const month = now.getMonth() + 1;
		const day = now.getDate();
		const weekday = now.getDay();
		const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
		
		return `${month}월 ${day}일 ${weekdays[weekday]}요일`;
	};

	const formatDate = (dateString: string | undefined) => {
		// dateString이 undefined인 경우 처리
		if (!dateString) {
			return '날짜 정보 없음';
		}
		
		const date = new Date(dateString);
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const weekday = date.getDay();
		const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
		
		return `${month}.${day}(${weekdays[weekday]})`;
	};

	const formatTime = (timeString: string | undefined) => {
		// timeString이 undefined인 경우 처리
		if (!timeString) {
			return '시간 정보 없음';
		}
		
		// "HH:MM:SS" 형식을 "오전/오후 H:MM" 형식으로 변환
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

	// 날짜 헤더용 포맷팅 함수
	const formatDateHeader = (dateString: string | undefined) => {
		// dateString이 undefined인 경우 처리
		if (!dateString) {
			return '날짜 정보 없음';
		}
		
		const date = new Date(dateString);
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const weekday = date.getDay();
		const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
		
		return `${month}월 ${day}일 ${weekdays[weekday]}`;
	};

	// 오늘의 첫 번째 수업 정보
	const todayFirstLesson = todayReservations && todayReservations.length > 0 ? todayReservations[0] : null;
	const todayFirstLessonDetail = todayFirstLesson ? lessonDetails[todayFirstLesson.lessonScheduleId] : null;

	// 날짜별로 예약을 그룹화하는 함수
	const groupReservationsByDate = (reservations: BackendReservation[]) => {
		const grouped: { [key: string]: BackendReservation[] } = {};
		
		reservations.forEach(reservation => {
			// 수업 상세 정보에서 실제 수업 날짜를 가져옴
			const lessonDetail = lessonDetails[reservation.lessonScheduleId];
			if (lessonDetail && lessonDetail.schedules && lessonDetail.schedules.length > 0) {
				// schedules 배열의 첫 번째 항목에서 날짜 정보 가져오기
				const schedule = lessonDetail.schedules[0];
				const date = new Date(schedule.date);
				const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
				
				if (!grouped[dateKey]) {
					grouped[dateKey] = [];
				}
				grouped[dateKey].push(reservation);
			}
		});
		
		// 날짜순으로 정렬
		return Object.entries(grouped)
			.sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
			.map(([date, reservations]) => ({ date, reservations }));
	};

	// 날짜별로 그룹화된 예약
	const groupedReservations = groupReservationsByDate(reservations);

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.container}>
				{/* 헤더 */}
				<View style={styles.header}>
					<View style={styles.logoContainer}>
						<Image 
							source={require('../../assets/icons/ULogo_small.png')} 
							style={styles.logoIcon}
						/>
						<Text style={styles.appName}>UniSportsCard</Text>
					</View>
				</View>
				
				<ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>


				{/* 날짜 헤더 */}
				<View style={styles.dateHeaderContainer}>
					<Text style={styles.dateHeaderText}>{getCurrentDateText()}</Text>
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
								{todayFirstLessonDetail && todayFirstLessonDetail.lessonDate
									? `${formatDate(todayFirstLessonDetail.lessonDate)} ${todayFirstLessonDetail.lessonTime || ''}`
									: formatTime(todayFirstLesson.createdAt)
								}
							</Text>
							<Text style={styles.classLocation}>{todayFirstLessonDetail.location || '위치 정보 없음'}</Text>
							<Text style={styles.userGreeting}>{user?.name || '사용자'}님의 오늘 수업입니다</Text>
						</>
					) : (
						<>
							<View style={styles.cardHeader}>
								<Text style={styles.classTitle}>오늘 예정된 수업 없음</Text>
							</View>
							<Text style={styles.classLocation}>새로운 수업을 예약해보세요</Text>
						</>
					)}
				</View>
				
				{/* 액션 버튼들 */}
				<View style={styles.actionButtons}>
					<TouchableOpacity 
						style={styles.actionButton}
						onPress={() => navigation.navigate('SubjectsInteresting')}
					>
						<Text style={styles.actionButtonText}>관심과목</Text>
						<Text style={styles.heartIcon}>♥</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={styles.actionButton}
						onPress={() => navigation.navigate('Review')}
					>
						<Text style={styles.actionButtonText}>리뷰쓰기</Text>
						<Image 
							source={require('../../assets/icons/ReviewIcon.png')} 
							style={styles.reviewIcon}
						/>
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
							<Text style={styles.emptyText}>{user?.name || '사용자'}님의 예약된 수업이 없습니다.</Text>
							<TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate(SCREENS.BOOKINGS)}>
								<Text style={styles.loginButtonText}>수업 예약하기</Text>
							</TouchableOpacity>
						</View>
					) : (
						// 예약된 수업이 있을 때: 타임라인 형태로 표시
						<View style={styles.timelineSection}>
							{/* 날짜별로 그룹화된 예약들을 순회하며 렌더링 */}
							{groupedReservations.map((group, groupIndex) => (
								// 각 날짜 그룹을 나타내는 컨테이너
								<View key={group.date} style={styles.dateGroup}>
									{/* 날짜 헤더: "8월 2일 토요일" 같은 형태로 표시 */}
									<View style={styles.dateGroupHeader}>
										<Text style={styles.dateGroupText}>{formatDateHeader(group.date)}</Text>
									</View>
									
									{/* 해당 날짜에 예약된 모든 수업들을 순회하며 렌더링 */}
									{group.reservations.map((reservation, index) => {
										// 현재 예약에 해당하는 수업 상세 정보를 가져옴
										const lessonDetail = lessonDetails[reservation.lessonScheduleId];
										return (
											// 각 수업 항목을 나타내는 타임라인 엔트리
											<View key={reservation.id} style={styles.timelineEntry}>
												{/* 타임라인 축: 왼쪽에 점(현재 수업)과 선(연결선)을 표시 */}
												<View style={styles.timelineAxis}>
													{/* 현재 수업을 나타내는 파란색 점 */}
													<View style={styles.timelineDot} />
													{/* 마지막 수업이 아닌 경우에만 아래로 연결선 표시 */}
													{index < group.reservations.length - 1 && <View style={styles.timelineLine} />}
												</View>
												
												{/* 수업 정보 내용: 제목, 날짜/시간, 장소를 표시 */}
												<View style={styles.entryContent}>
													{/* 수업 제목: 수업 상세 정보가 있으면 제목, 없으면 기본 텍스트 */}
													<Text style={styles.entryTitle}>
														{lessonDetail ? lessonDetail.title : `수업 #${reservation.lessonScheduleId}`}
													</Text>
													{/* 수업 날짜/시간: 실제 수업 날짜가 있으면 해당 날짜+시간, 없으면 예약 생성 날짜 */}
													<Text style={styles.entryDateTime}>
														{lessonDetail && lessonDetail.schedules && lessonDetail.schedules.length > 0
															? `${formatDate(lessonDetail.schedules[0].date)} ${formatTime(lessonDetail.schedules[0].startTime)}`
															: formatDate(reservation.createdAt)
														}
													</Text>
													{/* 수업 장소: 수업 상세 정보가 있으면 장소, 없으면 기본 텍스트 */}
													<Text style={styles.entryLocation}>
														{lessonDetail ? lessonDetail.location : '위치 정보 없음'}
													</Text>
												</View>
												
												{/* 옵션 아이콘: 수업에 대한 추가 액션(수정, 삭제 등)을 위한 버튼 */}
												<TouchableOpacity 
													onPress={() => navigation.navigate(SCREENS.BOOKING_CONFIRM, { 
														type: 'book',
														lessonId: reservation.lessonScheduleId.toString(),
														fromHome: true,
														reservation,
														lessonDetail
													})}
												>
													<SeeMoreIcon width={26} height={26} color="#A7B1CD" />
												</TouchableOpacity>
											</View>
										);
									})}
								</View>
							))}
						</View>
					)}
				</View>
				</ScrollView>
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
	scrollContainer: {
		flex: 1,
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
		marginBottom: 0,
	},
	logoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	logoIcon: {
		width: 24,
		height: 24,
		marginRight: 8,
		resizeMode: 'contain',
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
		paddingTop: 25,
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
	userGreeting: {
		fontSize: 13,
		color: '#FEFEFE',
		lineHeight: 16,
		fontWeight: '400',
		marginTop: 4,
		opacity: 0.9,
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
	reviewIcon: {
		width: 24,
		height: 24,
		tintColor: COLORS.PRIMARY,
	},
	
	// 다가오는 일정 섹션
	upcomingSection: {
		paddingHorizontal: 16,
		marginTop: 0,
		top: 5
	},
	
	// 타임라인 섹션
	timelineSection: {
		paddingHorizontal: 16,
	},
	
	// 날짜 그룹
	dateGroup: {
		marginBottom: 24,
	},
	
	// 날짜 그룹 헤더
	dateGroupHeader: {
		marginBottom: 16,
		paddingHorizontal: 4,
	},
	
	// 날짜 그룹 텍스트
	dateGroupText: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.PRIMARY,
		lineHeight: 22,
		left: -18,
		fontFamily: 'Inter',
		fontStyle: 'normal',
	},
	sectionTitle: {
		fontSize: 21,
		fontWeight: '700',
		color: COLORS.PRIMARY,
		lineHeight: 30,
		marginBottom: 20,
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
	
	// 타임라인 축 (점과 선)
	timelineAxis: {
		width: 20,
		alignItems: 'center',
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
		left: 2,
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
		marginBottom: 14,
		fontWeight: '400',
	},
	entryLocation: {
		fontSize: 12,
		color: COLORS.TEXT_TERTIARY,
		lineHeight: 15,
		fontWeight: '500',
		marginBottom: 14,
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


