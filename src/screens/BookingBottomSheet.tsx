import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';

type Lesson = {
	id: string;
	time: string;
	title: string;
	place: string;
};

type Props = {
	dateText: string;
	lessons: Lesson[];
	onSelect: (lesson: Lesson) => void;
	onClose: () => void;
};

export const BookingBottomSheet: React.FC<Props> = ({ dateText, lessons, onSelect, onClose }) => {
	return (
		<View style={styles.sheet}>
			<View style={styles.handle} />
			<Text style={styles.title}>{dateText}</Text>
			<ScrollView style={{ maxHeight: 360 }}>
				{lessons.map((l) => (
					<TouchableOpacity key={l.id} style={styles.card} onPress={() => onSelect(l)}>
						<View style={styles.dot} />
						<View style={styles.left}>
							<Text style={styles.time}>{l.time}</Text>
							<Text style={styles.lesson}>{l.title}</Text>
							<Text style={styles.place}>{l.place}</Text>
						</View>
						<View style={styles.thumb} />
					</TouchableOpacity>
				))}
			</ScrollView>
			<TouchableOpacity style={styles.closeBtn} onPress={onClose}>
				<Text style={styles.closeText}>닫기</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	sheet: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: COLORS.WHITE,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		padding: 16,
		borderTopWidth: 1,
		borderColor: COLORS.BORDER,
		shadowColor: COLORS.SHADOW,
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 12,
	},
	handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.GRAY_200, marginBottom: 12 },
	title: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 12 },
	card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.BORDER_LIGHT, borderRadius: 12, padding: 16, marginBottom: 10, position: 'relative' },
	dot: { position: 'absolute', left: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.GRAY_300 },
	left: { flex: 1, marginLeft: 8 },
	time: { fontSize: 12, color: COLORS.TEXT_SECONDARY, marginBottom: 4 },
	lesson: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 6 },
	place: { fontSize: 12, color: COLORS.TEXT_SECONDARY },
	thumb: { width: 56, height: 56, borderRadius: 8, backgroundColor: COLORS.BACKGROUND_TERTIARY },
	closeBtn: { marginTop: 8, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.BACKGROUND_TERTIARY },
	closeText: { color: COLORS.TEXT_PRIMARY, fontWeight: '600' },
});

export default BookingBottomSheet;


