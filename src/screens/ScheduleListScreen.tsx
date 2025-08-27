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
				<Text style={styles.headerDate}>{`${date.getFullYear()}.${date.getMonth() + 1}`}</Text>
			</View>
			<ScrollView style={styles.list}>
				{mockLessons.map((l) => (
					<View key={l.id} style={styles.card}>
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
	container: { flex: 1, backgroundColor: '#EDF2F8' },
	header: { padding: 16, backgroundColor: COLORS.WHITE, borderBottomWidth: 1, borderBottomColor: COLORS.BORDER },
	headerTitle: { fontSize: 23, fontWeight: '600', color: '#696E83', marginBottom: 8 },
	headerDate: { fontSize: 26, fontWeight: '500', color: '#2B308B' },
	list: { padding: 16 },
	card: { backgroundColor: '#FEFEFF', borderWidth: 1, borderColor: COLORS.BORDER_LIGHT, borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
	cardLeft: { flex: 1, marginLeft: 12 },
	time: { fontSize: 18, color: '#2B308B', marginBottom: 4 },
	title: { fontSize: 25, fontWeight: '700', color: '#2B308B', marginBottom: 8 },
	place: { fontSize: 13, color: '#696E83' },
	imageBox: { width: 94, height: 94, borderRadius: 8, backgroundColor: '#6A6A6A' },
});

export default ScheduleListScreen;


