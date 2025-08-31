import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';
import ReservationService from '../services/reservationService';
import { LessonService } from '../services/lessonService';
import { BackendReservation, BackendLessonDetail } from '../types';
import { Header } from '../components/Header';

const { width: screenWidth } = Dimensions.get('window');

export const ReviewScreen: React.FC<any> = ({ navigation }) => {
	const { user } = useAuth();
	const [completedLessons, setCompletedLessons] = useState<BackendReservation[]>([]);
	const [lessonDetails, setLessonDetails] = useState<{ [key: number]: BackendLessonDetail }>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 완료된 수업 목록 가져오기
	const fetchCompletedLessons = async () => {
		if (!user) {
			setError('사용자 정보를 찾을 수 없습니다.');
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			
			// 사용자의 모든 예약 정보 가져오기
			const response = await ReservationService.getUserReservations(parseInt(user.id));
			
			// 임시로 모든 예약을 완료된 수업으로 처리 (실제로는 완료 상태 확인 필요)
			const lessons = response.content || [];
			setCompletedLessons(lessons);
			
			// 수업 상세 정보 가져오기
			if (lessons.length > 0) {
				await fetchLessonDetails(lessons.map(lesson => lesson.lessonId));
			}
		} catch (err: any) {
			console.error('완료된 수업 목록 조회 실패:', err);
			setError(err.message || '완료된 수업 목록을 가져오는데 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

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

	// 리뷰 작성 화면으로 이동
	const navigateToWriteReview = (lessonId: number, lessonDetail: BackendLessonDetail) => {
		navigation.navigate('WriteReview', {
			lessonId,
			lessonDetail
		});
	};

	// 날짜 포맷팅 함수
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const weekday = date.getDay();
		const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
		
		return `${month}.${day}(${weekdays[weekday]})`;
	};

	// 시간 포맷팅 함수
	const formatTime = (timeString: string) => {
		if (!timeString) return '';
		
		// HH:mm 형식으로 가정
		const [hours, minutes] = timeString.split(':');
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? '오후' : '오전';
		const displayHour = hour > 12 ? hour - 12 : hour;
		
		return `${ampm}${displayHour}:${minutes}`;
	};

	useEffect(() => {
		fetchCompletedLessons();
	}, [user]);

	// 새로고침 함수
	const handleRefresh = () => {
		fetchCompletedLessons();
	};

	if (loading) {
		return (
			<View style={styles.container}>
                <Header
                title="리뷰쓰기"
                showLogo={true}
                customIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <LeftArrowBlue width={32} height={32} />
                    </TouchableOpacity>
                }
                />
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={COLORS.PRIMARY} />
					<Text style={styles.loadingText}>수업 목록을 불러오는 중...</Text>
				</View>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.container}>
                <Header
                title="리뷰쓰기"
                showLogo={true}
                customIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <LeftArrowBlue width={32} height={32} />
                    </TouchableOpacity>
                }
                />
				<View style={styles.errorContainer}>
					<Text style={styles.errorTitle}>오류가 발생했습니다</Text>
					<Text style={styles.errorText}>{error}</Text>
					<TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
						<Text style={styles.retryButtonText}>다시 시도</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
                <Header
                title="리뷰쓰기"
                showLogo={true}
                customIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <LeftArrowBlue width={32} height={32} />
                    </TouchableOpacity>
                }
                />
			
			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{completedLessons.length === 0 ? (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyTitle}>완료된 수업이 없습니다</Text>
						<Text style={styles.emptySubtitle}>수업을 수강한 후 리뷰를 작성할 수 있습니다</Text>
					</View>
				) : (
					completedLessons.map((lesson, idx) => {
						const lessonDetail = lessonDetails[lesson.lessonId];
						return (
							<View key={lesson.id} style={styles.timelineRow}>
								{/* 타임라인 축 */}
								<View style={styles.timelineAxis}>
									<View style={styles.timelineDot} />
									{idx < completedLessons.length - 1 && <View style={styles.timelineLine} />}
								</View>
								
								{/* 수업 정보 카드 */}
								<View style={styles.lessonCard}>
									<View style={styles.cardLeft}>
										<Text style={styles.cardTitle}>
											{lessonDetail ? lessonDetail.title : `수업 #${lesson.lessonId}`}
										</Text>
										<Text style={styles.cardTime}>
											{lessonDetail?.lessonDate && formatDate(lessonDetail.lessonDate)}
											{lessonDetail?.lessonTime && ` ${formatTime(lessonDetail.lessonTime)}`}
										</Text>
										<Text style={styles.cardPlace}>
											{lessonDetail ? lessonDetail.location : '위치 정보 없음'}
										</Text>
									</View>
									<View style={styles.cardRight}>
										<TouchableOpacity 
											style={styles.reviewIconContainer}
											onPress={() => lessonDetail && navigateToWriteReview(lesson.lessonId, lessonDetail)}
										>
											<Text style={styles.reviewIcon}>✎</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						);
					})
				)}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.WHITE,
		paddingTop: 48,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 50,
		paddingBottom: 10,
		backgroundColor: COLORS.WHITE,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.BORDER,
	},
	backButton: {
		padding: 10,
	},
	headerTitle: {
		flex: 1,
		textAlign: 'center',
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.TEXT_PRIMARY,
	},
	headerSpacer: {
		width: 50,
	},
	refreshButton: {
		padding: 10,
	},
	refreshText: {
		fontSize: 14,
		color: COLORS.PRIMARY,
		fontWeight: '600',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 100,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: COLORS.TEXT_SECONDARY,
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 100,
		paddingHorizontal: 20,
	},
	errorTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.ERROR,
		marginBottom: 8,
	},
	errorText: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
		textAlign: 'center',
		marginBottom: 20,
	},
	retryButton: {
		backgroundColor: COLORS.PRIMARY,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	retryButtonText: {
		color: COLORS.WHITE,
		fontSize: 14,
		fontWeight: '600',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 100,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 8,
	},
	emptySubtitle: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
		textAlign: 'center',
	},
	timelineRow: {
		flexDirection: 'row',
		marginBottom: 20,
	},
	timelineAxis: {
		alignItems: 'center',
		marginRight: 15,
	},
	timelineDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: COLORS.PRIMARY,
		marginBottom: 8,
	},
	timelineLine: {
		width: 2,
		height: 40,
		backgroundColor: COLORS.PRIMARY,
	},
	lessonCard: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: COLORS.WHITE,
		borderRadius: 12,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	cardLeft: {
		flex: 1,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 8,
	},
	cardTime: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
		marginBottom: 4,
	},
	cardPlace: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
	},
	cardRight: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 15,
	},
	reviewIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: COLORS.PRIMARY_SUBTLE,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: COLORS.PRIMARY,
	},
	reviewIcon: {
		fontSize: 20,
		color: COLORS.PRIMARY,
		fontWeight: 'bold',
	},
});

export default ReviewScreen;
