import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { SCREENS } from '../constants/screens';

export const CreateLessonInfoScreen: React.FC<any> = ({ navigation }) => {
	const [title, setTitle] = useState('');
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [place, setPlace] = useState('');

	const goNext = () => {
		if (!title || !date || !time || !place) {
			Alert.alert('입력 필요', '모든 정보를 입력해 주세요.');
			return;
		}
		navigation.navigate(SCREENS.CREATE_LESSON_COMPLETE, { title, date, time, place });
	};

	return (
		<View style={styles.container}>
			<View style={styles.steps}>
				<View style={styles.dot} />
				<View style={styles.arrow} />
				<View style={[styles.dot, styles.active]} />
				<View style={styles.arrow} />
				<View style={styles.dot} />
			</View>
			<Text style={styles.caption}>개설수업 정보입력</Text>

			<View style={styles.form}> 
				<TextInput placeholder="강좌명" value={title} onChangeText={setTitle} style={styles.input} />
				<TextInput placeholder="날짜(예: 2025-08-02)" value={date} onChangeText={setDate} style={styles.input} />
				<TextInput placeholder="시간(예: 14:30)" value={time} onChangeText={setTime} style={styles.input} />
				<TextInput placeholder="장소" value={place} onChangeText={setPlace} style={styles.input} />
			</View>

			<TouchableOpacity style={styles.cta} onPress={goNext}>
				<Text style={styles.ctaText}>다음</Text>
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
	form: { gap: 12 },
	input: { height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.BORDER, paddingHorizontal: 14, backgroundColor: COLORS.WHITE },
	cta: { position: 'absolute', left: 20, right: 20, bottom: 24, height: 52, borderRadius: 12, backgroundColor: COLORS.PRIMARY, alignItems: 'center', justifyContent: 'center' },
	ctaText: { color: COLORS.WHITE, fontWeight: '700' },
});

export default CreateLessonInfoScreen;


