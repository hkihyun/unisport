import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { LessonService } from '../services/lessonService';
import { ReservationService } from '../services/reservationService';
import { BackendLessonDetail } from '../types';
import { Header } from '../components/Header';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';
import { useAuth } from '../hooks/useAuth';
const { width } = Dimensions.get('window');

export const BookingConfirmScreen: React.FC<any> = ({ navigation, route }) => {
	const { type, lessonId, reservationId, fromHome, reservation, lessonDetail: homeLessonDetail } = route.params;
	const { user } = useAuth(); // user 정보 추가
	const [lessonDetail, setLessonDetail] = useState<BackendLessonDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// 홈화면에서 온 경우 또는 이미 수업 정보가 전달된 경우
		if ((fromHome && homeLessonDetail) || route.params.lessonDetail) {
			setLessonDetail(fromHome ? homeLessonDetail : route.params.lessonDetail);
			setIsLoading(false);
			return;
		}

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
	}, [lessonId, fromHome, homeLessonDetail, route.params.lessonDetail]);

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
	const formatDate = (dateString: string | undefined) => {
		// dateString이 undefined인 경우 처리
		if (!dateString) {
			return '날짜 정보 없음';
		}
		
		const date = new Date(dateString);
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
		return `${month}.${day}(${dayOfWeek})`;
	};

	const formatTime = (timeString: string | undefined) => {
		// timeString이 undefined인 경우 처리
		if (!timeString) {
			return '시간 정보 없음';
		}
		
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

	// 첫 번째 스케줄 정보 가져오기
	const firstSchedule = lessonDetail.schedules && lessonDetail.schedules.length > 0 ? lessonDetail.schedules[0] : null;

	// 예약 취소 함수
	const handleCancelReservation = async () => {
		// 사용자 정보 확인
		if (!user) {
			Alert.alert('오류', '사용자 정보를 찾을 수 없습니다.');
			return;
		}

		// reservation 정보에서 lessonScheduleId 가져오기
		let targetLessonScheduleId: number;
		if (fromHome && reservation) {
			// 홈화면에서 온 경우: reservation 객체에서 lessonScheduleId 사용
			targetLessonScheduleId = reservation.lessonScheduleId;
		} else {
			// 일반적인 경우: lessonId를 lessonScheduleId로 사용 (임시)
			// 실제로는 reservation 정보가 필요할 수 있음
			targetLessonScheduleId = parseInt(lessonId);
		}

		Alert.alert(
			'예약 취소',
			'정말로 이 수업 예약을 취소하시겠습니까?',
			[
				{
					text: '취소',
					style: 'cancel',
				},
				{
					text: '확인',
					onPress: async () => {
						try {
							// 로딩 상태 표시
							setIsLoading(true);
							
							// 예약 취소 API 호출 (userId와 lessonScheduleId 전달)
							await ReservationService.cancelReservation(parseInt(user.id), targetLessonScheduleId);
							
							// 성공 메시지 표시
							Alert.alert(
								'예약 취소 완료',
								'수업 예약이 성공적으로 취소되었습니다.',
								[
									{
										text: '확인',
										onPress: () => {
											// 홈화면으로 이동
											navigation.navigate('Home');
										}
									}
								]
							);
						} catch (error) {
							console.error('예약 취소 실패:', error);
							Alert.alert(
								'예약 취소 실패',
								'예약 취소 중 오류가 발생했습니다. 다시 시도해주세요.',
								[{ text: '확인' }]
							);
						} finally {
							setIsLoading(false);
						}
					}
				}
			]
		);
	};
	
	return (
		<View style={styles.container}>
			<Header
				title={type === 'book' ? '예약 완료' : '관심 등록하기'}
				showLogo={true}
				customIcon={
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<LeftArrowBlue width={32} height={32} />
					</TouchableOpacity>
				}
			/>
			{/* 메인 콘텐츠 */}
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

				
				{/* 수업 정보 카드 */}
				<View style={styles.lessonCard}>
					<Text style={styles.lessonTitle}>{lessonDetail.title}</Text>
					<Text style={styles.lessonSchedule}>
						일정 {firstSchedule ? formatDate(firstSchedule.date) : '날짜 정보 없음'} {firstSchedule ? formatTime(firstSchedule.startTime) : '시간 정보 없음'}
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
			{fromHome && reservation ? (
				// 홈화면에서 온 경우: 예약취소 버튼 (reservation 정보가 있을 때만)
				<TouchableOpacity 
					style={styles.primaryButton}
					onPress={handleCancelReservation}
				>
					<Text style={styles.primaryButtonText}>예약취소</Text>
				</TouchableOpacity>
			) : (
				// 일반적인 경우: 홈으로 이동 버튼
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
			)}
		</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.BACKGROUND,
		paddingTop: 50,
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


