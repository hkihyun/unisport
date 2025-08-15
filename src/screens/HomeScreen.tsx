import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

type Lesson = { id: string; title: string; time: string; place: string };

const todayFeatured: Lesson = {
	id: 'f1',
	title: 'Walking', // 디자인 톤을 살려 예시 텍스트 사용
	time: '12:00 - 14:00',
	place: 'Team / 체육관',
};

const upcoming: Lesson[] = [
	{ id: '1', title: 'Tennis', time: '15:00 - 17:00', place: 'Team' },
	{ id: '2', title: 'Going to the gym', time: '18:00 - 19:00', place: 'Solo' },
	{ id: '3', title: 'Walking', time: '19:30 - 20:30', place: 'Home' },
];

function getHeaderDate(): string {
	const d = new Date();
	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return `${weekdays[d.getDay()]}, ${d.getDate()}`;
}

export const HomeScreen: React.FC = () => {
	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
			{/* 헤더 날짜 */}
			<View style={styles.headerRow}>
				<Text style={styles.headerDate}>{getHeaderDate()}</Text>
				<Text style={styles.headerSub}>2/7</Text>
			</View>

			{/* 오늘의 카드 (모던한 다크 카드) */}
			<View style={styles.featureCard}>
				<View style={styles.featureTopRow}>
					<Text style={styles.featureTitle}>{todayFeatured.title}</Text>
					<View style={styles.checkBadge}>
						<Text style={styles.checkText}>✓</Text>
					</View>
				</View>
				<Text style={styles.featureMeta}>{todayFeatured.time} • {todayFeatured.place}</Text>
				<View style={styles.featureBlocks}>
					<View style={[styles.block, { backgroundColor: '#2D3748' }]} />
					<View style={[styles.block, { backgroundColor: '#4B5563' }]} />
					<View style={[styles.block, { backgroundColor: '#1F2937' }]} />
				</View>
			</View>

			{/* 통계/요약 */}
			<View style={styles.kpisRow}>
				<Text style={styles.kpiMain}>12 lines</Text>
				<Text style={styles.kpiSub}>You cracked 12 lines today, cheer up!</Text>
			</View>

			{/* 곧 시작하는 수업 */}
			<View style={styles.sectionHeader}>
				<Text style={styles.sectionTitle}>Upcoming</Text>
			</View>
			{upcoming.map((l) => (
				<View key={l.id} style={styles.upCard}>
					<View style={styles.upLeft}>
						<Text style={styles.upTitle}>{l.title}</Text>
						<Text style={styles.upMeta}>{l.time} / {l.place}</Text>
					</View>
					<View style={styles.upRight}>
						<TouchableOpacity style={styles.smallCheck}><Text style={styles.smallCheckText}>✓</Text></TouchableOpacity>
					</View>
				</View>
			))}

			{/* 빠른 액션 */}
			<View style={styles.quickRow}>
				<TouchableOpacity style={styles.quickBtn}><Text style={styles.quickText}>홈</Text></TouchableOpacity>
				<TouchableOpacity style={styles.quickBtn}><Text style={styles.quickText}>수업예약</Text></TouchableOpacity>
				<TouchableOpacity style={styles.quickBtn}><Text style={styles.quickText}>내 수업</Text></TouchableOpacity>
				<TouchableOpacity style={styles.quickBtn}><Text style={styles.quickText}>＋</Text></TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.BACKGROUND_SECONDARY },
	content: { padding: 20 },
	headerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 },
	headerDate: { fontSize: 28, fontWeight: '800', color: COLORS.TEXT_PRIMARY, letterSpacing: -0.5 },
	headerSub: { color: COLORS.TEXT_SECONDARY, fontWeight: '700' },
	featureCard: { backgroundColor: '#0F172A', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: COLORS.SHADOW, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
	featureTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
	featureTitle: { color: COLORS.WHITE, fontSize: 22, fontWeight: '800' },
	checkBadge: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#94A3B8', alignItems: 'center', justifyContent: 'center' },
	checkText: { color: '#94A3B8', fontWeight: '700' },
	featureMeta: { color: '#CBD5E1', marginBottom: 12 },
	featureBlocks: { flexDirection: 'row', gap: 8 },
	block: { flex: 1, height: 24, borderRadius: 6, opacity: 0.8 },
	kpisRow: { marginBottom: 8 },
	kpiMain: { fontSize: 28, fontWeight: '800', color: COLORS.TEXT_PRIMARY, marginBottom: 6 },
	kpiSub: { color: COLORS.TEXT_SECONDARY },
	sectionHeader: { marginTop: 12, marginBottom: 8 },
	sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY },
	upCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.BORDER_LIGHT, borderRadius: 14, padding: 14, marginBottom: 10 },
	upLeft: { flex: 1 },
	upTitle: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 4 },
	upMeta: { color: COLORS.TEXT_SECONDARY },
	upRight: {},
	smallCheck: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.BACKGROUND_TERTIARY, alignItems: 'center', justifyContent: 'center' },
	smallCheckText: { color: COLORS.TEXT_PRIMARY, fontWeight: '700' },
	quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
	quickBtn: { flex: 1, backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.BORDER, marginHorizontal: 4, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
	quickText: { color: COLORS.TEXT_PRIMARY, fontWeight: '700' },
});


