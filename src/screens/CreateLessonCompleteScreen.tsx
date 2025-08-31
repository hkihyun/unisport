import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';
import { LessonService } from '../services/lessonService';
import { COLORS } from '../constants/colors';
import Header from '../components/Header';
import LocationIcon from '../../assets/icons/location';
import { useNavigation } from '@react-navigation/native';

export const CreateLessonCompleteScreen: React.FC<any> = ({ navigation, route }) => {
	const [lessonData, setLessonData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
	// route.params에서 lessonId 가져오기
	const { lessonId } = route.params || {};

	useEffect(() => {
		if (lessonId) {
			fetchLessonData();
		} else {
			setError('수업 ID가 없습니다.');
			setLoading(false);
		}
	}, [lessonId]);

	// 수업 데이터 가져오기
	const fetchLessonData = async () => {
		try {
			setLoading(true);
			setError(null);
			
			console.log('수업 데이터 가져오기 시작:', lessonId);
			const response = await LessonService.getLessonDetail(lessonId);
			
			if (response) {
				setLessonData(response);
				console.log('수업 데이터 로드 성공:', response);
			} else {
				setError('수업 데이터를 가져올 수 없습니다.');
			}
		} catch (err) {
			console.error('수업 데이터 가져오기 오류:', err);
			setError('수업 데이터를 불러오는 중 오류가 발생했습니다.');
		} finally {
			setLoading(false);
		}
	};

	// 날짜를 요일로 변환
	const getDayOfWeek = (dateString: string) => {
		try {
			const date = new Date(dateString);
			const days = ['일', '월', '화', '수', '목', '금', '토'];
			return days[date.getDay()];
		} catch (error) {
			return '';
		}
	};

	// 시간 형식 변환
	const formatTime = (timeString: string) => {
		try {
			const [hours, minutes] = timeString.split(':');
			const hour = parseInt(hours);
			const period = hour < 12 ? '오전' : '오후';
			const displayHour = hour < 12 ? hour : hour - 12;
			return `${period}${displayHour}:${minutes}`;
		} catch (error) {
			return timeString;
		}
	};

	const goBack = () => {
		navigation.goBack();
	};

	const confirmCreation = () => {
		// 수업 개설 확인 로직
		Alert.alert(
			'수업 개설 완료',
			'수업이 성공적으로 개설되었습니다!',
			[
				{
					text: '확인',
					onPress: () => navigation.navigate('Home')
				}
			]
		);
	};

	// 로딩 상태
	if (loading) {
		return (
			<View style={styles.container}>
				<StatusBar barStyle="dark-content" backgroundColor="white" />
				<Header
				title="수업 개설"
				showLogo={false}
				
			/>
				<View style={styles.centerContainer}>
					<ActivityIndicator size="large" color={COLORS.PRIMARY} />
					<Text style={styles.loadingText}>수업 정보를 불러오는 중...</Text>
				</View>
			</View>
		);
	}

	// 에러 상태
	if (error) {
		return (
			<View style={styles.container}>
				<StatusBar barStyle="dark-content" backgroundColor="white" />
				<Header
				title="수업 개설"
				showLogo={false}
				
			/>
				<View style={styles.centerContainer}>
					<Text style={styles.errorText}>{error}</Text>
					<TouchableOpacity style={styles.retryButton} onPress={fetchLessonData}>
						<Text style={styles.retryButtonText}>다시 시도</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="white" />
			
			{/* Header */}
			<Header
				title="수업 개설"
				showLogo={false}
			
			/>


			{/* Instruction Text */}
			<Text style={styles.instructionText}>
				아래 수업이 맞는지 확인해 주세요.
			</Text>

			{/* Lesson Details Card */}
			<View style={styles.lessonCard}>
				{/* Lesson Title */}
				<Text style={styles.lessonTitle}>
					{lessonData?.title || '기초요가'}
				</Text>

				{/* Schedule */}
				<Text style={styles.scheduleText}>
					일정: <Text style={styles.boldText}>매주</Text> <Text style={styles.boldText}>목요일</Text>
				</Text>



				{/* Location */}
				<View style={styles.locationContainer}>
					<LocationIcon width={17} height={17} color="#626262" />
					<Text style={styles.locationText}>
						{lessonData?.location || '위치정보 없음음'}
					</Text>
				</View>

				{/* Separator Line */}
				<View style={styles.cardSeparator} />

				{/* Detailed Information */}
				<View style={styles.detailRow}>
					<Text style={styles.detailLabel}>종목:</Text>
					<Text style={styles.detailValue}>{lessonData?.sport || '요가'}</Text>
				</View>

				<View style={styles.detailRow}>
					<Text style={styles.detailLabel}>난이도:</Text>
					<Text style={styles.detailValue}>{lessonData?.level || '2'}</Text>
				</View>


			</View>

			{/* Confirmation Button */}
			<TouchableOpacity style={styles.confirmButton} onPress={confirmCreation}>
				<Text style={styles.confirmButtonText}>개설확인</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingTop: 56,
	},


	instructionText: {
		fontSize: 16,
		color: '#666',
		paddingHorizontal: 20,
		marginBottom: 24,
		marginTop: 45,
	},
	lessonCard: {
		backgroundColor: '#F0F4F8',
		borderRadius: 16,
		padding: 24,
		marginHorizontal: 20,
		marginBottom: 40,
	},
	lessonTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: '#1E3A8A',
		marginBottom: 16,
	},
	scheduleText: {
		fontSize: 16,
		color: '#374151',
		marginBottom: 12,

	},
	boldText: {
		fontWeight: '600',
		fontSize: 16,
		color: '#2B308B',
	},
	instructorText: {
		fontSize: 20,
		fontWeight: '700',
		color: '#1E3A8A',
		marginBottom: 12,
	},
	locationContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},

	locationText: {
		fontSize: 15,
		color: '#696E83',
		marginLeft: 8,
	},
	cardSeparator: {
		height: 1,
		backgroundColor: '#E5E5E5',
		marginBottom: 20,
	},
	detailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	detailLabel: {
		fontSize: 16,
		color: '#374151',
	},
	detailValue: {
		fontSize: 16,
		color: '#374151',
	},
	confirmButton: {
		backgroundColor: '#5981FA',
		borderRadius: 30,
		paddingVertical: 16,
		paddingHorizontal: 24,
		marginHorizontal: 20,
		alignItems: 'center',
		position: 'absolute',
		bottom: 40,
		left: 0,
		right: 0,
		marginBottom: -10

	},
	confirmButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
		color: '#666',
	},
	errorText: {
		fontSize: 16,
		color: '#FF0000',
		textAlign: 'center',
		marginBottom: 20,
	},
	retryButton: {
		backgroundColor: '#5981FA',
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 24,
	},
	retryButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
});

export default CreateLessonCompleteScreen;


