import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { SCREENS } from '../constants/screens';
import { StarIcon } from 'react-native-heroicons/solid';
import { LessonService } from '../services/lessonService';
import { AuthService, InstructorResponse } from '../services/authService';
import { ReservationService } from '../services/reservationService';
import { lessonLikeService } from '../services/lessonLikeService';
import { BackendLessonDetail, BackendReview, BackendReviewResponse } from '../types';
import { useAuth } from '../hooks/useAuth';
import { DifficultyLevel } from '../../assets/icons/DifficultyIcon';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';
import { HeartIcon } from '../../assets/icons/HeartIcon';
import { Header } from '../components/Header';
import { LeftArrowGray } from '../../assets/icons/LeftArrow_gray';

const { width } = Dimensions.get('window');

export const BookingDetailScreen: React.FC<any> = ({ navigation, route }) => {
	const { lessonId } = route.params;
	const { isAuthenticated, user } = useAuth(); // 로그인 상태와 사용자 정보 확인
	const [selectedSort, setSelectedSort] = useState<'recommended' | 'latest'>('recommended');
	const [isHeartPressed, setIsHeartPressed] = useState(false);
	const [lessonDetail, setLessonDetail] = useState<BackendLessonDetail | null>(null);
	const [instructorInfo, setInstructorInfo] = useState<InstructorResponse | null>(null);
	const [reviews, setReviews] = useState<BackendReview[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isReserving, setIsReserving] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				setError(null);
				
				// 수업 상세 정보, 강사 정보, 리뷰를 병렬로 가져오기

				const normalizeReviews = (reviewsData: any) => {
					if (Array.isArray(reviewsData)) return reviewsData;
					if (Array.isArray(reviewsData?.content)) return reviewsData.content;
					return [];
				};

				const [lessonData, reviewsData] = await Promise.all([
					LessonService.getLessonDetail(lessonId),
					LessonService.getReviewsByRating(lessonId),
				]);

				setLessonDetail(lessonData);
				setReviews(normalizeReviews(reviewsData));

				// 강사 정보 가져오기
				if (lessonData && lessonData.instructorUserId) {
					try {
						const instructorData = await AuthService.getInstructorInfo(lessonData.instructorUserId);
						if (instructorData.success && instructorData.data) {
							setInstructorInfo(instructorData.data);
						}
					} catch (instructorError) {
						console.error('강사 정보 조회 실패:', instructorError);
						// 강사 정보 조회 실패는 전체 화면 에러로 처리하지 않음
					}
				}
			} catch (err) {
				console.error('데이터 조회 실패:', err);
				setError('수업 정보를 불러오는데 실패했습니다.');
			} finally {
				setIsLoading(false);
			}
		};

		if (lessonId) {
			fetchData();
		}
	}, [lessonId]);

	// 정렬 변경 시 리뷰 다시 가져오기
	const handleSortChange = async (sortType: 'recommended' | 'latest') => {
		try {
			setSelectedSort(sortType);
			const reviewsData = sortType === 'recommended' 
				? await LessonService.getReviewsByRating(lessonId)
				: await LessonService.getReviewsByLatest(lessonId);
			setReviews(reviewsData);
		} catch (err) {
			console.error('리뷰 정렬 변경 실패:', err);
		}
	};	

	// 예약 처리
	const handleReservation = async () => {
		// 로그인하지 않은 경우 로그인 안내
		if (!isAuthenticated) {
			Alert.alert(
				'로그인 필요',
				'예약을 위해서는 로그인이 필요합니다.',
				[
					{ text: '취소', style: 'cancel' },
					{ 
						text: '로그인하기', 
						onPress: () => navigation.navigate(SCREENS.LOGIN)
					}
				]
			);
			return;
		}

		if (!lessonDetail) return;

		// lessonDetail.id가 null인 경우 처리
		if (lessonDetail.id === null) {
			Alert.alert('오류', '수업 정보가 올바르지 않습니다.', [{ text: '확인' }]);
			return;
		}

		try {
			setIsReserving(true);
			
			// 로그인된 사용자의 ID 사용
			if (!user) {
				Alert.alert('오류', '사용자 정보를 찾을 수 없습니다.');
				return;
			}
			
			const reservationRequest = {
				userId: parseInt(user.id),
				lessonScheduleId: lessonDetail.id
			};

			const response = await ReservationService.createReservation(reservationRequest);
			
			// 예약 완료 후 BookingConfirmScreen으로 이동
			navigation.navigate('BookingConfirm', {
				type: 'book',
				lessonId: lessonDetail.id,
				reservationId: response.id,
				lessonDetail: lessonDetail // 전체 수업 정보 전달
			});
		} catch (error) {
			console.error('예약 실패:', error);
			Alert.alert('예약 실패', '수업 예약에 실패했습니다. 다시 시도해주세요.', [{ text: '확인' }]);
		} finally {
			setIsReserving(false);
		}
	};

	// 찜 버튼
	const handleHeartPress = async () => {
		// 로그인하지 않은 경우 로그인 안내
		if (!isAuthenticated) {
			Alert.alert(
				'로그인 필요',
				'관심과목을 등록하려면 로그인이 필요합니다.',
				[
					{ text: '취소', style: 'cancel' },
					{ 
						text: '로그인하기', 
						onPress: () => navigation.navigate(SCREENS.LOGIN)
					}
				]
			);
			return;
		}

		try {
			if (isHeartPressed) {
				// 관심과목 해제
				await lessonLikeService.removeFromFavorites(lessonId, parseInt(user.id));
				setIsHeartPressed(false);
				Alert.alert('성공', '관심과목에서 제거되었습니다.', [{ text: '확인' }]);
			} else {
				// 관심과목 등록
				await lessonLikeService.addToFavorites(lessonId, parseInt(user.id));
				setIsHeartPressed(true);
				Alert.alert('성공', '관심과목에 등록되었습니다.', [{ text: '확인' }]);
			}
		} catch (error: any) {
			Alert.alert('오류', error.message || '관심과목 처리에 실패했습니다.', [{ text: '확인' }]);
		}
	};

	// 로딩 중일 때
	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#5981FA" />
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

	// 난이도에 따른 박스 개수 계산 - DifficultyIcon으로 대체됨

	// 난이도 텍스트 변환
	const getDifficultyText = (level: number) => {
		switch (level) {
			case 1: return '초보자';
			case 2: return '초급';
			case 3: return '중급';
			case 4: return '고급';
			case 5: return '전문가';
			default: return '초보자';
		}
	};
	
	return (
		<View style={styles.container}>
			<Header
				title="수업예약"
				showLogo={false}
				customIcon={
					<TouchableOpacity onPress={() => navigation.goBack()}>
					   <LeftArrowBlue width={32} height={32} />
					</TouchableOpacity>
				}
			/>
			
			
			{/* 상단 고정 영역 */}
			<View style={styles.fixedTopSection}>
				{/* 뒤로가기 버튼 */}
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
					<LeftArrowGray width={29} height={29} />
				</TouchableOpacity>
				
				{/* 수업 제목 */}
				<Text style={styles.lessonTitle}>{lessonDetail.sport}</Text>
				
				{/* 태그들 */}
				<View style={styles.tagContainer}>
					<View style={styles.tag}>
						<Text style={styles.tagText}>{getDifficultyText(lessonDetail.level)} 가능</Text>
					</View>
					<View style={styles.tag}>
						<Text style={styles.tagText}>{getDifficultyText(lessonDetail.level)} 추천</Text>
					</View>
				</View>
				
				{/* 찜 버튼 */}
				<TouchableOpacity 
					style={styles.heartButton}
					onPress={handleHeartPress}
				>
					<HeartIcon 
						size={28} 
						color="#5981FA" 
						filled={isHeartPressed}
					/>
				</TouchableOpacity>
			</View>
			
			{/* 구분선 */}
			<View style={styles.sectionDivider} />
			
			{/* 메인 콘텐츠 */}
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				{/* 수업 이미지 */}
				<View style={styles.imageSection}>
					<View style={styles.imageContainer}>
						{lessonDetail.image ? (
							<Text style={styles.imageText}>수업 이미지</Text>
						) : (
							<Text style={styles.noImageText}>이미지 없음</Text>
						)}
					</View>
				</View>
				
				{/* 구분선 */}
				<View style={styles.sectionDivider} />
				
				{/* 수업 난이도 */}
				<View style={styles.difficultySection}>
					<View style={styles.difficultyHeader}>
						<Text style={styles.sectionTitle}>수업 난이도</Text>
						<View style={styles.difficultyIndicator}>
							<DifficultyLevel level={lessonDetail.level as 1 | 2 | 3 | 4 | 5} size={35} color="#5981FA" />
						</View>
					</View>
				</View>
				
				{/* 구분선 */}
				<View style={styles.sectionDivider} />
				
				{/* 수업 설명 */}
				<View style={styles.descriptionSection}>
					<Text style={styles.sectionTitle}>수업 설명</Text>
					<Text style={styles.descriptionText}>
						{lessonDetail.description}
					</Text>
				</View>
				
				{/* 구분선 */}
				<View style={styles.sectionDivider} />
				
				{/* 수업 정보 */}
				<View style={styles.infoSection}>
					<Text style={styles.sectionTitle}>수업 정보</Text>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>장소:</Text>
						<Text style={styles.infoValue}>{lessonDetail.location}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>날짜:</Text>
						<Text style={styles.infoValue}>{lessonDetail.lessonDate}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>시간:</Text>
						<Text style={styles.infoValue}>{lessonDetail.lessonTime}</Text>
					</View>
				</View>
				
				{/* 구분선 */}
				<View style={styles.sectionDivider} />
				
				{/* 강사 소개 */}
				<View style={styles.instructorSection}>
					<Text style={styles.sectionTitle}>강사 소개</Text>
					{instructorInfo ? (
						<>
							<Text style={styles.instructorName}>{instructorInfo.name}</Text>
							<Text style={styles.instructorAffiliation}>
								{instructorInfo.university} • {instructorInfo.studentNumber}
							</Text>
							<Text style={styles.instructorDescription}>
								{instructorInfo.name} 강사는 {instructorInfo.university}에서 활동하고 있으며, 
								{lessonDetail?.sport} 분야의 전문 지식을 바탕으로 체계적이고 효과적인 수업을 제공합니다.
							</Text>
						</>
					) : (
						<>
							<Text style={styles.instructorName}>강사 정보</Text>
							<Text style={styles.instructorAffiliation}>강사 상세 정보는 준비 중입니다</Text>
							<Text style={styles.instructorDescription}>
								강사에 대한 자세한 정보는 추후 업데이트될 예정입니다.
							</Text>
						</>
					)}
				</View>
				
				{/* 구분선 */}
				<View style={styles.sectionDivider} />
				
				{/* 리뷰 섹션 */}
				<View style={styles.reviewSection}>
					<View style={styles.reviewHeader}>
						<Text style={styles.sectionTitle}>수업자 리뷰</Text>
						<Text style={styles.reviewCount}>{reviews.length}</Text>
					</View>
					
					{/* 정렬 옵션 */}
					<View style={styles.sortOptions}>
						<Text style={styles.sortDot}>•</Text>
						<TouchableOpacity 
							onPress={() => handleSortChange('recommended')}
							style={styles.sortOption}
						>
							<Text style={[styles.sortText, selectedSort === 'recommended' && styles.sortTextActive]}>
								추천순
							</Text>
						</TouchableOpacity>
						<Text style={styles.sortDot}>•</Text>
						<TouchableOpacity 
							onPress={() => handleSortChange('latest')}
							style={styles.sortOption}
						>
							<Text style={[styles.sortText, selectedSort === 'latest' && styles.sortTextActive]}>
								최신순
							</Text>
						</TouchableOpacity>
					</View>
					
					{/* 리뷰가 없을 때 */}
					{reviews.length === 0 && (
						<Text style={styles.noReviewText}>아직 리뷰가 없습니다.</Text>
					)}
					
					{/* 리뷰 카드들 */}
					{reviews.map((review, index) => (
						<View key={review.id} style={styles.reviewCard}>
							<View style={styles.reviewerAvatar} />
							<View style={styles.reviewerInfo}>
								<Text style={styles.reviewerName}>사용자 {review.userId}</Text>
								<View style={styles.starRating}>
									{[1, 2, 3, 4, 5].map((star) => (
										<StarIcon 
											key={star} 
											size={28} 
											color={star <= review.rating ? '#5981FA' : '#D0DEEC'} 
										/>
									))}
								</View>
							</View>
							<Text style={styles.reviewText}>
								{review.reviewContent}
							</Text>
							<Text style={styles.reviewDate}>
								{new Date(review.createdAt).toLocaleDateString('ko-KR')}
							</Text>
						</View>
					))}
				</View>
				
				{/* 하단 여백 */}
				<View style={styles.bottomSpacing} />
			</ScrollView>
			
			{/* 예약하기 버튼 - 하단 고정 */}
			<View style={styles.bookingButtonContainer}>
				<TouchableOpacity 
					style={styles.bookingButton}
					onPress={handleReservation}
					disabled={isReserving}
				>
					<Text style={styles.bookingButtonText}>{isReserving ? '예약 중...' : '예약하기'}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FEFEFE',
		paddingTop: 59,
	},
	
	
	// 헤더
	header: {
		paddingHorizontal: 23,
		paddingVertical: 16,
		backgroundColor: '#FEFEFE',
		marginTop: 45,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#5981FA',
		lineHeight: 24,
	},
	
	// 구분선
	headerDivider: {
		height: 1.5,
		backgroundColor: '#E2E8EE',
		marginHorizontal: 0,
	},
	sectionDivider: {
		height: 8,
		backgroundColor: '#E7EDF4',
		opacity: 0.3,
		marginHorizontal: 0,
	},
	
	// 상단 고정 영역
	fixedTopSection: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 14,
		paddingVertical: 19,
		backgroundColor: '#FEFEFE',
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
		color: '#AEABAB',
		fontWeight: '600',
		lineHeight: 29,
	},	
	lessonTitle: {
		fontSize: 22,
		fontWeight: '600',
		color: '#2B308B',
		lineHeight: 27,
		marginRight: 20,
	},
	tagContainer: {
		flexDirection: 'row',
		gap: 10,
	},
	tag: {
		backgroundColor: '#E7EDF4',
		paddingHorizontal: 5,
		paddingVertical: 3,
		borderRadius: 5,
		width: 59,
		height: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	tagText: {
		fontSize: 10,
		color: '#5981FA',
		fontWeight: '400',
		lineHeight: 12,
	},
	heartButton: {
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 'auto',
	},

	
	scrollView: {
		flex: 1,
	},
	
	// 이미지 섹션
	imageSection: {
		paddingHorizontal: 12,
		paddingVertical: 21,
	},
	imageContainer: {
		width: 370,
		height: 130,
		backgroundColor: '#FFFFFF',
		borderRadius: 8,
	},
	imageText: {
		fontSize: 13,
		color: '#6A6A6A',
		lineHeight: 17,
		textAlign: 'center',
		paddingVertical: 50,
	},
	noImageText: {
		fontSize: 13,
		color: '#6A6A6A',
		lineHeight: 17,
		textAlign: 'center',
		paddingVertical: 50,
	},
	
	// 섹션 공통
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#2B308B',
		lineHeight: 35,
		marginBottom: 0,
	},
	
	// 난이도
	difficultySection: {
		paddingHorizontal: 12,
		paddingVertical: 16,
	},
	difficultyHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	difficultyIndicator: {
		flexDirection: 'row',
		gap: 4,
	},
	// difficultyBox 관련 스타일은 DifficultyIcon으로 대체되어 제거됨
	
	// 설명
	descriptionSection: {
		paddingHorizontal: 12,
		paddingVertical: 16,
	},
	descriptionText: {
		paddingTop: 10,
		fontSize: 13,
		color: '#6A6A6A',
		lineHeight: 17,
		fontWeight: '300',
	},
	
	// 수업 정보
	infoSection: {
		paddingHorizontal: 12,
		paddingVertical: 16,
	},
	infoRow: {
		flexDirection: 'row',
		marginBottom: 8,
		paddingTop: 15,
		marginTop: 5,
	},
	infoLabel: {
		fontSize: 15,
		color: '#696E83',
		lineHeight: 18,
		marginRight: 10,
		marginTop: -15,
	},
	infoValue: {
		fontSize: 15,
		color: '#2B308B',
		lineHeight: 18,
		marginTop: -15,
	},
	
	// 강사
	instructorSection: {
		paddingHorizontal: 12,
		paddingVertical: 16,
		backgroundColor: '#FEFEFE',
	},
	instructorName: {
		fontSize: 22,
		fontWeight: '600',
		color: '#2B308B',
		lineHeight: 27,
		marginBottom: 8,
	},
	instructorAffiliation: {
		fontSize: 15,
		color: '#696E83',
		lineHeight: 18,
		marginBottom: 16,
	},
	instructorDescription: {
		fontSize: 13,
		color: '#6A6A6A',
		lineHeight: 17,
		fontWeight: '300',
	},
	
	// 예약 버튼
	bookingButtonContainer: {
		position: 'absolute',
		bottom: 5,
		left: 0,
		right: 0,
		backgroundColor: '#FEFEFE',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderTopWidth: 1,
		borderTopColor: '#E2E8EE',
	},
	bookingButton: {
		backgroundColor: '#5981FA',
		paddingVertical: 16,
		borderRadius: 30,
		alignItems: 'center',
		height: 55,
		justifyContent: 'center',
	},
	bookingButtonText: {
		color: '#FEFEFF',
		fontSize: 20,
		fontWeight: '400',
		lineHeight: 24,
	},
	
	// 리뷰
	reviewSection: {
		paddingHorizontal: 12,
		paddingVertical: 16,
	},
	reviewHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	reviewCount: {
		fontSize: 18,
		color: '#696E83',
		lineHeight: 22,
		marginLeft: 8,
		marginTop: 0,
	},
	sortOptions: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
		left: -10,

	},
	sortOption: {
		marginRight: 0,
	},
	sortText: {
		fontSize: 12,
		color: '#2B308B',
		lineHeight: 12,
		marginLeft: -5,
	},
	sortTextActive: {
		color: '#5981FA',
	},
	sortDot: {
		fontSize: 15,
		color: '#5981FA',
		marginHorizontal: 8,
	},
	
	// 리뷰 카드
	reviewCard: {
		backgroundColor: '#EDF2F8',
		padding: 16,
		borderRadius: 20,
		marginBottom: 16,
		height: 142,
	},
	reviewerAvatar: {
		width: 31,
		height: 31,
		borderRadius: 15.5,
		backgroundColor: '#D9D9D9',
		marginBottom: 8,
	},
	reviewerInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	reviewerName: {
		fontSize: 15,
		color: '#2B308B',
		lineHeight: 18,
		marginRight: 16,
	},
	starRating: {
		flexDirection: 'row',
		gap: 4,
	},
	reviewText: {
		fontSize: 13,
		color: '#6A6A6A',
		lineHeight: 16,
		fontWeight: '400',
	},
	reviewDate: {
		fontSize: 12,
		color: '#999999',
		lineHeight: 14,
		marginTop: 8,
	},
	noReviewText: {
		fontSize: 13,
		color: '#6A6A6A',
		lineHeight: 16,
		fontWeight: '300',
		marginTop: 10,
		textAlign: 'center',
	},
	
	// 하단 여백
	bottomSpacing: {
		height: 120,
	},
	
	// 로딩 중 화면
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FEFEFE',
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
		color: '#6A6A6A',
	},
	
	// 에러 화면
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FEFEFE',
		paddingHorizontal: 20,
	},
	errorText: {
		fontSize: 16,
		color: '#6A6A6A',
		textAlign: 'center',
		marginBottom: 20,
	},
	retryButton: {
		backgroundColor: '#5981FA',
		paddingVertical: 12,
		paddingHorizontal: 25,
		borderRadius: 30,
	},
	retryButtonText: {
		color: '#FEFEFF',
		fontSize: 16,
		fontWeight: '400',
	},
});

export default BookingDetailScreen;


