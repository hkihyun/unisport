import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export const CreateLessonCompleteScreen: React.FC<any> = ({ navigation, route }) => {
	const { title, date, time, place, lessonId } = route.params || {};

	const goBack = () => {
		navigation.navigate('Home'); // 홈 화면으로 이동
	};

	return (
		<View style={styles.container}>
			<View style={styles.steps}>
				<View style={styles.dot} />
				<View style={styles.arrow} />
				<View style={styles.dot} />
				<View style={styles.arrow} />
				<View style={[styles.dot, styles.active]} />
			</View>
			<Text style={styles.caption}>수업 개설 완료</Text>

			<View style={styles.summary}>
				<Text style={styles.summaryText}>{title || '강좌명'}</Text>
				<Text style={styles.summaryMeta}>{date} {time} • {place}</Text>
				{lessonId && (
					<Text style={styles.lessonId}>레슨 ID: {lessonId}</Text>
				)}
			</View>

			<View style={styles.successMessage}>
				<Text style={styles.successIcon}>✅</Text>
				<Text style={styles.successTitle}>레슨이 성공적으로 생성되었습니다!</Text>
				<Text style={styles.successSubtitle}>백엔드 API와 연결되어 실제 데이터베이스에 저장되었습니다.</Text>
			</View>

			<TouchableOpacity style={styles.cta} onPress={goBack}>
				<Text style={styles.ctaText}>홈으로 돌아가기</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.BACKGROUND, padding: 20 },
	steps: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 24 },
	dot: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.GRAY_200 },
	active: { backgroundColor: COLORS.GRAY_400 },
	arrow: { width: 40, height: 2, backgroundColor: COLORS.BORDER, marginHorizontal: 8 },
	caption: { color: '#EC4899', fontWeight: '700', marginBottom: 8 },
	summary: { flex: 1, borderRadius: 12, backgroundColor: COLORS.BACKGROUND_SECONDARY, alignItems: 'center', justifyContent: 'center' },
	summaryText: { fontSize: 18, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
	summaryMeta: { color: COLORS.TEXT_SECONDARY },
	lessonId: { color: COLORS.TEXT_SECONDARY, fontSize: 14, marginTop: 8 },
	successMessage: {
		backgroundColor: COLORS.BACKGROUND_SUCCESS,
		borderRadius: 12,
		padding: 20,
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 24,
	},
	successIcon: { fontSize: 40, marginBottom: 10 },
	successTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: COLORS.TEXT_PRIMARY,
		marginBottom: 5,
	},
	successSubtitle: {
		fontSize: 14,
		color: COLORS.TEXT_SECONDARY,
	},
	cta: { position: 'absolute', left: 20, right: 20, bottom: 24, height: 52, borderRadius: 12, backgroundColor: COLORS.GRAY_300, alignItems: 'center', justifyContent: 'center' },
	ctaText: { color: COLORS.WHITE, fontWeight: '700' },
});

export default CreateLessonCompleteScreen;


