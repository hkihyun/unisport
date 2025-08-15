import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/colors';

export const CreateLessonCompleteScreen: React.FC<any> = ({ navigation, route }) => {
	const { title, date, time, place } = route.params || {};

	const submit = () => {
		Alert.alert('수업 개설', '수업 개설 신청이 접수되었습니다.');
		navigation.goBack();
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
			</View>

			<TouchableOpacity style={styles.cta} onPress={submit}>
				<Text style={styles.ctaText}>수업개설 신청</Text>
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
	cta: { position: 'absolute', left: 20, right: 20, bottom: 24, height: 52, borderRadius: 12, backgroundColor: COLORS.GRAY_300, alignItems: 'center', justifyContent: 'center' },
	ctaText: { color: COLORS.WHITE, fontWeight: '700' },
});

export default CreateLessonCompleteScreen;


