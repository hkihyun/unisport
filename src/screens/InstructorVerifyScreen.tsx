import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export const InstructorVerifyScreen: React.FC<any> = ({ navigation }) => {
	const [verified, setVerified] = useState(false);
	return (
		<View style={styles.container}>
			<View style={styles.steps}>
				<View style={[styles.dot, styles.active]} />
				<View style={styles.arrow} />
				<View style={styles.dot} />
				<View style={styles.arrow} />
				<View style={styles.dot} />
			</View>
			<Text style={styles.caption}>강사인증 확인</Text>
			<View style={{ flex: 1 }} />
			<TouchableOpacity
				style={[styles.cta, verified ? styles.ctaActive : styles.ctaDisabled]}
				onPress={() => {
					setVerified(true);
					navigation.goBack();
				}}
			>
				<Text style={styles.ctaText}>인증</Text>
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
	caption: { color: '#EC4899', fontWeight: '700' },
	cta: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
	ctaActive: { backgroundColor: COLORS.PRIMARY },
	ctaDisabled: { backgroundColor: COLORS.GRAY_200 },
	ctaText: { color: COLORS.WHITE, fontWeight: '700' },
});

export default InstructorVerifyScreen;


