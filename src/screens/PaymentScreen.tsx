import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native';
import { Header } from '../components/Header';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';

export const PaymentScreen: React.FC<any> = ({ navigation }) => {
	const handlePay = () => {
		Alert.alert('결제', '결제 플로우는 추후 PG 연동 시 활성화됩니다.');
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="white" />
			<Header title="UnisportCard 구독" showLogo={true} customIcon={<LeftArrowBlue width={32} height={32} />} />

			<ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
				{/* 구독 정보 섹션 */}
				<View style={styles.firstSection}>
					<Text style={styles.sectionTitle}>멤버십 구독 후 바로 예약</Text>
					<Text style={styles.sectionSubtitle}>수업 예약을 시작하려면 멤버십 구독이 필요합니다.</Text>
		        <View style={styles.secondSection}>
					<Text style={styles.secondsectionTitle}>멤버십으로 할 수 있는 것</Text>
					<Text style={styles.secondsectionSubtitle}>
					• 모든 수업 예약 가능{'\n'}
					• 예약 오픈 즉시 알림(수업 시작 2일 전 00:00 기준){'\n'}
					• 출석 체크 & 기록 리포트{'\n'}
					• 맞춤 추천(관심 종목/시간대 기반){'\n'}
					• 공지/휴강 알림 및 고객센터 빠른 응답
					</Text>
				</View>



					<View style={styles.subscriptionCard}>
						<View style={styles.cardContent}>
							<View style={styles.cardLines}>
								<Text style={styles.firstcardLineText}>학기권 ₩60,000</Text>
								<Text style={styles.secondcardLineText}>학기당 1회 정기 결제</Text>
								<Text style={styles.thirdcardLineText}>학기 시작일 - 학기 종료일 무제한 예약/알림/기록 이용</Text>
							</View>
						</View>
					</View>
				</View>



				{/* 결제하기 버튼 */}
				<TouchableOpacity style={styles.payButton} onPress={handlePay}>
					<Text style={styles.payButtonText}>구독하기</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingTop: 50,
	},
	scrollContainer: {
		flex: 1,
		paddingHorizontal: 20,
	},
	firstSection: {
		marginTop: 20,
		marginBottom: 0,
	},
	sectionTitle: {
		fontSize: 26,
		fontWeight: '800',
		marginBottom: 16,
		lineHeight: 28,
		fontFamily: 'Inter',
		marginTop: 50,
		color: '#2B308B',
		marginLeft: 10,
	},
	sectionSubtitle: {
		fontSize: 15,
		fontWeight: '400',
		color: '#696E83',
		marginBottom: -20,
		lineHeight: 17,
		fontFamily: 'Inter',
		marginLeft: 10,
	},


	secondSection: {
		marginTop: 60,
		marginBottom: 30,
	},
	secondsectionTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#2B308B',
		marginBottom: 16,
		lineHeight: 17,
		fontFamily: 'Inter',
		marginLeft: 10,
		marginTop: 10,
		paddingTop: 10,
	},
	secondsectionSubtitle: {
		fontSize: 16,
		fontWeight: '400',
		color: '#5981FA',
		marginBottom: 16,
		lineHeight: 20,
		fontFamily: 'Inter',
		marginLeft: 10,
		marginTop: -2,
	},











	subscriptionCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: '#EDF2F8',
	},
	cardContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	cardLines: {
		flex: 1,
		gap: 10,
	},


	firstcardLineText: {
		fontSize: 21,
		fontWeight: '700',
		color: '#2B308B',
	},
	secondcardLineText: {
		fontSize: 16,
		fontWeight: '400',
		color: '#696E83',
	},
	thirdcardLineText: {
		fontSize: 15,
		fontWeight: '500',
		color: '#5981FA',
	},




	payButton: {
		backgroundColor: '#5981FA',
		borderRadius: 30,
		height: 55,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
		marginTop: 170,
	},
	payButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
	},
});

export default PaymentScreen;




