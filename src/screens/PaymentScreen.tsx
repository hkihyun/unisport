import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS } from '../constants/colors';

export const PaymentScreen: React.FC = () => {
	const handlePay = () => {
		Alert.alert('결제', '결제 플로우는 추후 PG 연동 시 활성화됩니다.');
	};

	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.headerRow}>
					<Text style={styles.headerTitle}>UniSportsCard 구독</Text>
				</View>

				<View style={styles.card}>
					<View style={styles.cardLeft}>
						<View style={styles.cardLine} />
						<View style={[styles.cardLine, { width: '65%' }]} />
					</View>
					<Text style={styles.price}>60,000원</Text>
				</View>

				<View style={styles.paymentInfoBox}>
					<Text style={styles.paymentInfoText}>결제정보</Text>
				</View>

				<TouchableOpacity style={styles.payButton} onPress={handlePay}>
					<Text style={styles.payButtonText}>결제하기</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.BACKGROUND,
	},
	scrollContainer: {
		flex: 1,
	},
	content: {
		padding: 20,
		gap: 16,
	},
	headerRow: {
		paddingVertical: 4,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: COLORS.TEXT_PRIMARY,
	},
	card: {
		backgroundColor: COLORS.WHITE,
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: COLORS.BORDER,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	cardLeft: {
		flex: 1,
		gap: 8,
	},
	cardLine: {
		height: 16,
		width: '50%',
		backgroundColor: COLORS.BACKGROUND_TERTIARY,
		borderRadius: 8,
	},
	price: {
		fontSize: 18,
		fontWeight: '700',
		color: COLORS.TEXT_PRIMARY,
	},
	paymentInfoBox: {
		height: 260,
		borderRadius: 12,
		backgroundColor: COLORS.BACKGROUND_TERTIARY,
		alignItems: 'center',
		justifyContent: 'center',
	},
	paymentInfoText: {
		color: COLORS.ACCENT,
		fontSize: 16,
		fontWeight: '600',
	},
	payButton: {
		backgroundColor: COLORS.GRAY_200,
		borderRadius: 12,
		height: 56,
		alignItems: 'center',
		justifyContent: 'center',
	},
	payButtonText: {
		color: COLORS.TEXT_PRIMARY,
		fontSize: 16,
		fontWeight: '600',
	},
});




