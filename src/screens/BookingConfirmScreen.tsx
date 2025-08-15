import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export const BookingConfirmScreen: React.FC<any> = ({ navigation, route }) => {
	const { type } = route.params;
	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Text style={styles.title}>{type === 'book' ? '예약 확인' : '관심등록 확인'}</Text>
				<View style={styles.summary}>
					<Text style={styles.summaryText}>(선택한 수업 요약 정보)</Text>
				</View>
			</View>
			<TouchableOpacity style={styles.cta} onPress={() => navigation.goBack()}>
				<Text style={styles.ctaText}>{type === 'book' ? '예약확인' : '관심등록'}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.BACKGROUND, padding: 16 },
	card: { backgroundColor: COLORS.WHITE, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.BORDER, marginTop: 12 },
	title: { fontSize: 18, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
	summary: { height: 220, borderRadius: 12, backgroundColor: COLORS.BACKGROUND_SECONDARY, alignItems: 'center', justifyContent: 'center' },
	summaryText: { color: COLORS.TEXT_SECONDARY },
	cta: { position: 'absolute', left: 16, right: 16, bottom: 24, height: 52, borderRadius: 12, backgroundColor: COLORS.PRIMARY, alignItems: 'center', justifyContent: 'center' },
	ctaText: { color: COLORS.WHITE, fontSize: 16, fontWeight: '700' },
});

export default BookingConfirmScreen;


