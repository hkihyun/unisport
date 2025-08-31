import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';
import { BackendLessonDetail } from '../types';

const { width: screenWidth } = Dimensions.get('window');

export const WriteReviewScreen: React.FC<any> = ({ navigation, route }) => {
	const { lessonId, lessonDetail } = route.params;
	const [reviewText, setReviewText] = useState('');

	// 리뷰 제출 함수
	const submitReview = () => {
		if (!reviewText.trim()) {
			Alert.alert('알림', '리뷰를 작성해주세요.');
			return;
		}

		// TODO: 실제 리뷰 제출 API 호출
		console.log('리뷰 제출:', {
			lessonId,
			reviewText: reviewText.trim()
		});

		Alert.alert(
			'리뷰 제출 완료',
			'리뷰가 성공적으로 제출되었습니다.',
			[
				{
					text: '확인',
					onPress: () => navigation.goBack()
				}
			]
		);
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

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
					<LeftArrowBlue width={32} height={32} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>리뷰쓰기</Text>
				<View style={styles.headerSpacer} />
			</View>
			
			<View style={styles.content}>
				{/* 수업 정보 카드 */}
				<View style={styles.lessonInfoCard}>
					<Text style={styles.lessonTitle}>
						{lessonDetail?.title || '수업 제목'}
					</Text>
					<Text style={styles.lessonSchedule}>
						일정 {lessonDetail?.lessonDate && formatDate(lessonDetail.lessonDate)}
						{lessonDetail?.lessonTime && ` ${formatTime(lessonDetail.lessonTime)}`}
					</Text>
					<Text style={styles.lessonInstructor}>
						{lessonDetail?.instructorUserId ? `${lessonDetail.instructorUserId} 강사` : 'XXX 강사'}
					</Text>
					<View style={styles.locationContainer}>
						<Text style={styles.locationIcon}>📍</Text>
						<Text style={styles.lessonLocation}>
							{lessonDetail?.location || '고려대학교 화정체육관'}
						</Text>
					</View>
				</View>

				{/* 리뷰 입력 영역 */}
				<View style={styles.reviewInputContainer}>
					<View style={styles.reviewInputHeader}>
						<Text style={styles.pencilIcon}>✎</Text>
						<Text style={styles.inputLabel}>리뷰를 작성해 주세요.</Text>
					</View>
					<TextInput
						style={styles.reviewInput}
						placeholder="리뷰를 작성해 주세요."
						placeholderTextColor={COLORS.TEXT_SECONDARY}
						value={reviewText}
						onChangeText={setReviewText}
						multiline
						textAlignVertical="top"
						maxLength={500}
					/>
					<Text style={styles.characterCount}>{reviewText.length}/500</Text>
				</View>

				{/* 제출 버튼 */}
				<TouchableOpacity 
					style={[
						styles.submitButton,
						!reviewText.trim() && styles.submitButtonDisabled
					]}
					onPress={submitReview}
					disabled={!reviewText.trim()}
				>
					<Text style={[
						styles.submitButtonText,
						!reviewText.trim() && styles.submitButtonTextDisabled
					]}>
						리뷰 제출
					</Text>
				</TouchableOpacity>
			</View>
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
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	lessonInfoCard: {
		backgroundColor: COLORS.PRIMARY_SUBTLE,
		borderRadius: 12,
		padding: 20,
		marginBottom: 24,
	},
	lessonTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 12,
	},
	lessonSchedule: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
		marginBottom: 8,
	},
	lessonInstructor: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 12,
	},
	locationContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	locationIcon: {
		fontSize: 16,
		marginRight: 8,
		color: COLORS.TEXT_SECONDARY,
	},
	lessonLocation: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
	},
	reviewInputContainer: {
		flex: 1,
		marginBottom: 24,
	},
	reviewInputHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	pencilIcon: {
		fontSize: 18,
		color: COLORS.PRIMARY,
		marginRight: 8,
	},
	inputLabel: {
		fontSize: 16,
		color: COLORS.TEXT_SECONDARY,
		fontWeight: '500',
	},
	reviewInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: COLORS.PRIMARY_SUBTLE,
		borderRadius: 12,
		padding: 16,
		fontSize: 16,
		color: COLORS.TEXT_PRIMARY,
		minHeight: 200,
		backgroundColor: COLORS.WHITE,
	},
	characterCount: {
		textAlign: 'right',
		fontSize: 12,
		color: COLORS.TEXT_SECONDARY,
		marginTop: 8,
	},
	submitButton: {
		backgroundColor: COLORS.PRIMARY,
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 20,
	},
	submitButtonDisabled: {
		backgroundColor: COLORS.BORDER,
	},
	submitButtonText: {
		color: COLORS.WHITE,
		fontSize: 16,
		fontWeight: '600',
	},
	submitButtonTextDisabled: {
		color: COLORS.TEXT_SECONDARY,
	},
});

export default WriteReviewScreen;
