import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { HeartIcon } from '../../assets/icons/HeartIcon';
import { lessonLikeService, FavoriteLesson } from '../services/lessonLikeService';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';

const { width: screenWidth } = Dimensions.get('window');

export const SubjectsInterestingScreen: React.FC<any> = ({ navigation }) => {
	const { user } = useAuth();
	const [favoriteLessons, setFavoriteLessons] = useState<FavoriteLesson[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 관심 레슨 목록 가져오기
	const fetchFavoriteLessons = async () => {
		if (!user) {
			setError('사용자 정보를 찾을 수 없습니다.');
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const response = await lessonLikeService.getFavoriteLessons(parseInt(user.id));
			setFavoriteLessons(response || []);
		} catch (err: any) {
			console.error('관심 레슨 목록 조회 실패:', err);
			setError(err.message || '관심 레슨 목록을 가져오는데 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	// 관심과목에서 제거하는 함수
	const removeFromFavorites = async (lessonId: number) => {
		if (!user) {
			Alert.alert('오류', '사용자 정보를 찾을 수 없습니다.');
			return;
		}

			try {
		console.log('관심과목 제거 시작:', lessonId, 'userId:', user.id);
		const response = await lessonLikeService.removeFromFavorites(lessonId, parseInt(user.id));
		console.log('관심과목 제거 성공:', response);
		
		// 성공 시 로컬 상태에서 제거 (NOT_FOUND도 성공으로 처리)
		setFavoriteLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
		
		// 응답에 따른 메시지 표시
		if (response.status === 'REMOVED') {
			Alert.alert('알림', '관심과목이 이미 제거되었습니다.');
		} else {
			Alert.alert('성공', '관심과목에서 제거되었습니다.');
		}
	} catch (err: any) {
		console.error('관심과목 제거 실패:', err);
		Alert.alert('오류', err.message || '관심과목 제거에 실패했습니다.');
	}
	};

	// 날짜 포맷팅 함수
	const formatDate = (dateString: string | undefined) => {
		if (!dateString) return '날짜 정보 없음';
		
		const date = new Date(dateString);
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const weekday = date.getDay();
		const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
		
		return `${month}월${day}일(${weekdays[weekday]})`;
	};

	// 시간 포맷팅 함수
	const formatTime = (timeString: string | undefined) => {
		if (!timeString) return '';
		
		// "HH:MM:SS" 형식을 "오전/오후 H:MM" 형식으로 변환
		const [hours, minutes] = timeString.split(':');
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? '오후' : '오전';
		const displayHour = hour > 12 ? hour - 12 : hour;
		
		return `${ampm} ${displayHour}:${minutes}`;
	};

	useEffect(() => {
		fetchFavoriteLessons();
	}, [user]);

	// 페이지에 포커스가 될 때마다 데이터 새로 가져오기
	useFocusEffect(
		React.useCallback(() => {
			if (user) {
				console.log('관심과목 페이지 포커스 - 데이터 새로 가져오기');
				fetchFavoriteLessons();
			}
		}, [user])
	);

	// 새로고침 함수
	const handleRefresh = () => {
		fetchFavoriteLessons();
	};

	if (loading) {
		return (
			<View style={styles.container}>
            <Header 
            title="관심과목" 
            showLogo={true}
            customIcon={
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <LeftArrowBlue width={32} height={32} />
                </TouchableOpacity>
            }
            />
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={COLORS.PRIMARY} />
					<Text style={styles.loadingText}>관심과목을 불러오는 중...</Text>
				</View>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.container}>
            <Header 
            title="관심과목" 
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
            title="관심과목" 
            showLogo={true}
            customIcon={
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <LeftArrowBlue width={32} height={32} />
                </TouchableOpacity>
            }
            />


			{/* 본문 */}
			<ScrollView 
				style={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{favoriteLessons.length === 0 ? (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyTitle}>관심과목이 없습니다</Text>
						<Text style={styles.emptySubtitle}>하트를 눌러 관심과목을 등록해보세요</Text>
					</View>
				) : (
					favoriteLessons.map((lesson, idx) => (
						<View key={lesson.id} style={styles.timelineRow}>
							{/* 타임라인 좌측 축 */}
							<View style={styles.timelineCol}>
								{idx !== 0 && <View style={styles.timelineLineTop} />}
								<View style={styles.timelineDot} />
								{idx !== favoriteLessons.length - 1 && <View style={styles.timelineLineBottom} />}
							</View>
							
							{/* 수업 카드 */}
							<View style={styles.lessonCard}>
								<View style={styles.cardLeft}>
									<Text style={styles.cardTime}>
										{lesson.schedules && lesson.schedules.length > 0 && (
											<>
												{formatDate(lesson.schedules[0].date)}
												{lesson.schedules[0].startTime && ` ${formatTime(lesson.schedules[0].startTime)}`}
											</>
										)}
									</Text>
									<Text style={styles.cardTitle}>{lesson.title}</Text>
									<Text style={styles.cardPlace}>{lesson.location}</Text>
								</View>
								<View style={styles.cardRight}>
									<TouchableOpacity 
										style={styles.heartContainer}
										onPress={() => removeFromFavorites(lesson.id)}
									>
										<HeartIcon 
											size={30} 
											color="#5981FA" 
											filled={true}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					))
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
	backArrow: {
		fontSize: 24,
		color: COLORS.TEXT_PRIMARY,
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
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 25,
	},
	retryButtonText: {
		color: COLORS.WHITE,
		fontSize: 16,
		fontWeight: '600',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 50,
	},
	emptyTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 10,
	},
	emptySubtitle: {
		fontSize: 16,
		color: COLORS.TEXT_SECONDARY,
		textAlign: 'center',
		paddingHorizontal: 20,
	},
	timelineRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	timelineCol: {
		alignItems: 'center',
		position: 'relative',
		width: 50,
	},
	timelineLineTop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 1,
		backgroundColor: COLORS.BORDER,
	},
	timelineLineBottom: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 1,
		backgroundColor: COLORS.BORDER,
	},
	timelineDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: COLORS.PRIMARY,
		position: 'absolute',
		top: -5,
		zIndex: 1,
	},
	lessonCard: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: COLORS.WHITE,
		borderRadius: 10,
		padding: 15,
		shadowColor: COLORS.SHADOW,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	cardLeft: {
		flex: 1,
	},
	cardTime: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
		marginBottom: 5,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 5,
	},
	cardPlace: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
	},
	cardRight: {
		alignItems: 'center',
		marginRight: 50
	},
	cardThumb: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: COLORS.PRIMARY_SUBTLE,
		marginBottom: 10,
	},
	availableText: {
		fontSize: 14,
		color: COLORS.SECONDARY,
		fontWeight: 'bold',
	},
	heartContainer: {
		padding: 5,
		marginTop: 20
	},
});

export default SubjectsInterestingScreen;
