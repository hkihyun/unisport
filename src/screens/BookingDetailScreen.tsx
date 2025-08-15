import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { SCREENS } from '../constants/screens';

export const BookingDetailScreen: React.FC<any> = ({ navigation, route }) => {
	const { lessonId, title } = route.params;
	return (
		<ScrollView style={styles.container}>
			<View style={styles.gallery} />
			<View style={styles.body}>
				<Text style={styles.title}>{title}</Text>
				<View style={styles.metaRow}>
					<Text style={styles.meta}>수업자리뷰 25</Text>
				</View>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>수업리뷰</Text>
					<View style={styles.reviewCard}><Text style={styles.reviewText}>(수업리뷰)</Text></View>
					<View style={styles.reviewCard}><Text style={styles.reviewText}>(수업리뷰)</Text></View>
				</View>
			</View>
			<View style={styles.bottomBar}>
				<TouchableOpacity style={[styles.bottomBtn, styles.wishBtn]} onPress={() => navigation.navigate(SCREENS.BOOKING_CONFIRM, { type: 'wish', lessonId })}>
					<Text style={styles.wishText}>관심등록</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.bottomBtn, styles.bookBtn]} onPress={() => navigation.navigate(SCREENS.BOOKING_CONFIRM, { type: 'book', lessonId })}>
					<Text style={styles.bookText}>수업 예약하기</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
	gallery: { height: 180, backgroundColor: COLORS.BACKGROUND_TERTIARY },
	body: { padding: 16 },
	title: { fontSize: 20, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
	metaRow: { marginBottom: 12 },
	meta: { color: COLORS.TEXT_SECONDARY },
	section: { marginTop: 8 },
	sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
	reviewCard: { backgroundColor: COLORS.WHITE, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.BORDER_LIGHT, marginBottom: 10 },
	reviewText: { color: COLORS.TEXT_SECONDARY },
	bottomBar: { flexDirection: 'row', gap: 12, padding: 16 },
	bottomBtn: { flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
	wishBtn: { backgroundColor: COLORS.WHITE, borderWidth: 1.5, borderColor: COLORS.PRIMARY },
	bookBtn: { backgroundColor: COLORS.PRIMARY },
	wishText: { color: COLORS.PRIMARY, fontWeight: '700' },
	bookText: { color: COLORS.WHITE, fontWeight: '700' },
});

export default BookingDetailScreen;


