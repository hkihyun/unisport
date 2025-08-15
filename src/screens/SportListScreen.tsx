import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../constants/screens';

const SPORTS = [
	'걷기', '골프', '농구', '런닝', '레이싱', '마라톤', '무에타이', '배드민턴', '수영', '스케이트', '스쿼시', '스키', '스케이트보드', '승마', '야구', '역도', '요가', '우슈', '유도', '자전거', '좁은뜻요가', '주짓수', '축구', '탁구', '테니스', '태권도', '파워요가', '필라테스'
];

export const SportListScreen: React.FC = () => {
	const navigation = useNavigation<any>();
	const grouped = useMemo(() => {
		const sorted = [...SPORTS].sort((a, b) => a.localeCompare(b, 'ko'));
		return sorted.reduce<Record<string, string[]>>((acc, name) => {
			const key = name[0].toUpperCase();
			acc[key] = acc[key] || [];
			acc[key].push(name);
			return acc;
		}, {});
	}, []);

	return (
		<ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
			{Object.keys(grouped).sort().map((letter) => (
				<View key={letter} style={styles.group}>
					<Text style={styles.groupTitle}>{letter}</Text>
					{grouped[letter].map((name) => (
						<TouchableOpacity
							key={name}
							style={styles.item}
							onPress={() => navigation.navigate(SCREENS.SPORT_LESSONS, { sport: name })}
						>
							<Text style={styles.itemText}>{name}</Text>
						</TouchableOpacity>
					))}
				</View>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
	group: { marginBottom: 16 },
	groupTitle: { fontSize: 14, color: COLORS.TEXT_SECONDARY, marginBottom: 8, paddingHorizontal: 8 },
	item: { backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.BORDER_LIGHT, padding: 16, borderRadius: 12, marginBottom: 8 },
	itemText: { fontSize: 16, color: COLORS.TEXT_PRIMARY, fontWeight: '600' },
});

export default SportListScreen;


