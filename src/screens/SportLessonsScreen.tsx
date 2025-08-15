import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
	navigation: any;
	route: { params: { sport: string; date?: string } };
};

function formatDate(d: Date): string {
	return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export const SportLessonsScreen: React.FC<Props> = ({ route, navigation }) => {
	const baseDate = route.params?.date ? new Date(route.params.date) : new Date();
	const [selectedDate] = useState<Date>(baseDate);
	const endDate = new Date(selectedDate);
	endDate.setDate(endDate.getDate() + 14);

	// Mock 2주 범위 내 레슨
	const mockLessons = useMemo(() => {
		const lessons = [] as Array<{ id: string; date: Date; time: string; title: string; place: string }>;
		for (let i = 0; i < 8; i++) {
			const d = new Date(selectedDate);
			d.setDate(d.getDate() + Math.floor(Math.random() * 14));
			lessons.push({ id: String(i + 1), date: d, time: `${14 + (i % 4)}:30`, title: route.params.sport, place: '고려대학교 체육체육관' });
		}
		return lessons.sort((a, b) => a.date.getTime() - b.date.getTime());
	}, [route.params.sport, selectedDate]);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>{route.params.sport}</Text>
				<Text style={styles.headerSubtitle}>{formatDate(selectedDate)} 기준 2주 이내</Text>
			</View>
			<ScrollView style={styles.list}>
				{mockLessons.map((l) => (
					<TouchableOpacity key={l.id} style={styles.card} onPress={() => navigation.navigate('LessonDetail' as never, { lessonId: l.id, title: l.title } as never)}>
						<Text style={styles.dateText}>{formatDate(l.date)}</Text>
						<View style={styles.row}>
							<View style={styles.left}>
								<Text style={styles.time}>{l.time}</Text>
								<Text style={styles.title}>{l.title}</Text>
								<Text style={styles.place}>{l.place}</Text>
							</View>
							<TouchableOpacity style={styles.imageBox} />
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.BACKGROUND_SECONDARY },
	header: { padding: 16, backgroundColor: COLORS.WHITE, borderBottomWidth: 1, borderBottomColor: COLORS.BORDER },
	headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 6 },
	headerSubtitle: { fontSize: 14, color: COLORS.TEXT_SECONDARY },
	list: { padding: 16 },
	card: { backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.BORDER_LIGHT, borderRadius: 12, padding: 16, marginBottom: 12 },
	dateText: { fontSize: 12, color: COLORS.TEXT_SECONDARY, marginBottom: 8 },
	row: { flexDirection: 'row', alignItems: 'center' },
	left: { flex: 1 },
	time: { fontSize: 14, color: COLORS.TEXT_SECONDARY, marginBottom: 4 },
	title: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
	place: { fontSize: 12, color: COLORS.TEXT_SECONDARY },
	imageBox: { width: 64, height: 64, borderRadius: 8, backgroundColor: COLORS.BACKGROUND_TERTIARY },
});

export default SportLessonsScreen;


