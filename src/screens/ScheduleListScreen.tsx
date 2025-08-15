import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
	navigation: any;
	route: { params: { date: string } };
};

export const ScheduleListScreen: React.FC<Props> = ({ route }) => {
	const date = new Date(route.params?.date);
	const title = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

	const mockLessons = [
		{ id: '1', time: '14:30', title: '요가', place: '고려대학교 체육체육관' },
		{ id: '2', time: '15:30', title: '런닝', place: '고려대학교 체육체육관' },
		{ id: '3', time: '16:30', title: '요가', place: '고려대학교 체육체육관' },
	];

	return (
		<View style={styles.container}>
			<View style={styles.header}> 
				<Text style={styles.headerTitle}>수업예약</Text>
				<Text style={styles.headerDate}>{title}</Text>
			</View>
			<ScrollView style={styles.list}>
				{mockLessons.map((l) => (
					<View key={l.id} style={styles.card}>
						<View style={styles.timelineDot} />
						<View style={styles.cardLeft}>
							<Text style={styles.time}>{l.time}</Text>
							<Text style={styles.title}>{l.title}</Text>
							<Text style={styles.place}>{l.place}</Text>
						</View>
						<TouchableOpacity style={styles.imageBox} />
					</View>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.BACKGROUND_SECONDARY },
	header: { padding: 16, backgroundColor: COLORS.WHITE, borderBottomWidth: 1, borderBottomColor: COLORS.BORDER },
	headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
	headerDate: { fontSize: 16, color: COLORS.TEXT_SECONDARY },
	list: { padding: 16 },
	card: { backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.BORDER_LIGHT, borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', position: 'relative' },
	timelineDot: { position: 'absolute', left: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.GRAY_300 },
	cardLeft: { flex: 1, marginLeft: 12 },
	time: { fontSize: 14, color: COLORS.TEXT_SECONDARY, marginBottom: 4 },
	title: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
	place: { fontSize: 12, color: COLORS.TEXT_SECONDARY },
	imageBox: { width: 64, height: 64, borderRadius: 8, backgroundColor: COLORS.BACKGROUND_TERTIARY },
});

export default ScheduleListScreen;


