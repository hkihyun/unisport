import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

// 구독 플랜 데이터
const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9900,
    originalPrice: null,
    period: '월',
    features: [
      '수업 예약 제한 없음',
      '기본 검색 기능',
      '예약 내역 확인',
      '기본 고객 지원',
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 24900,
    originalPrice: 29900,
    period: '월',
    features: [
      'Basic 플랜의 모든 기능',
      '우선 예약 권한',
      '고급 검색 및 필터',
      '강사 1:1 채팅',
      '무제한 클래스 변경',
      '우선 고객 지원',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49900,
    originalPrice: null,
    period: '월',
    features: [
      'Premium 플랜의 모든 기능',
      '단체 예약 할인',
      '전용 강사 배정',
      '맞춤형 운동 프로그램',
      '무제한 수업 참여',
      '24/7 프리미엄 지원',
    ],
    popular: false,
  },
];

const paymentMethods = [
  { id: 'card', name: '신용/체크카드', icon: '', description: '간편하고 안전한 카드 결제' },
  { id: 'kakao', name: '카카오페이', icon: '', description: '카카오톡으로 간편 결제' },
  { id: 'naver', name: '네이버페이', icon: '', description: '네이버 아이디로 결제' },
  { id: 'toss', name: '토스', icon: '', description: '토스 앱으로 빠른 결제' },
];

export const PaymentScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [selectedPayment, setSelectedPayment] = useState<string>('card');

  const handleSubscribe = () => {
    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
    const payment = paymentMethods.find(p => p.id === selectedPayment);
    
    Alert.alert(
      '구독 확인',
      `${plan?.name} 플랜을 ${payment?.name}로 결제하시겠습니까?\n\n월 ${plan?.price.toLocaleString()}원`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '결제하기', 
          onPress: () => {
            Alert.alert('결제 완료', '구독이 성공적으로 시작되었습니다!');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>구독 상태</Text>
          <Text style={styles.headerSubtitle}>
            수업 신청을 위한 구독을 시작하고{'\n'}
            다양한 혜택을 이용해보세요!
          </Text>
        </View>

        {/* 구독 혜택 미리보기 */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>구독 혜택 미리보기</Text>
          <View style={styles.previewGrid}>
            <View style={styles.previewItem}>
              <Text style={styles.previewIcon}>⚡</Text>
              <Text style={styles.previewText}>수업 신청</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewIcon}>💬</Text>
              <Text style={styles.previewText}>강사 채팅</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewIcon}>🔍</Text>
              <Text style={styles.previewText}>고급 검색</Text>
            </View>
            <View style={styles.previewItem}>
              <Text style={styles.previewIcon}>🎯</Text>
              <Text style={styles.previewText}>맞춤 프로그램</Text>
            </View>
          </View>
        </View>

        {/* 구독 플랜 */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>구독 플랜 선택</Text>
          {subscriptionPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlanCard,
                plan.popular && styles.popularPlanCard,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>인기</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.planPricing}>
                    <Text style={styles.planPrice}>{plan.price.toLocaleString()}원</Text>
                    <Text style={styles.planPeriod}>/{plan.period}</Text>
                    {plan.originalPrice && (
                      <Text style={styles.originalPrice}>
                        {plan.originalPrice.toLocaleString()}원
                      </Text>
                    )}
                  </View>
                </View>
                
                <View style={[
                  styles.radioButton,
                  selectedPlan === plan.id && styles.selectedRadioButton
                ]}>
                  {selectedPlan === plan.id && <View style={styles.radioButtonInner} />}
                </View>
              </View>
              
              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <Text key={index} style={styles.planFeature}>
                    ✓ {feature}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 결제 방법 */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>결제 방법</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPayment === method.id && styles.selectedPaymentMethod,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentMethodLeft}>
                <Text style={styles.paymentIcon}>{method.icon}</Text>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>{method.name}</Text>
                  <Text style={styles.paymentDescription}>{method.description}</Text>
                </View>
              </View>
              
              <View style={[
                styles.radioButton,
                selectedPayment === method.id && styles.selectedRadioButton
              ]}>
                {selectedPayment === method.id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 결제 요약 */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>결제 요약</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>선택한 플랜</Text>
              <Text style={styles.summaryValue}>
                {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>결제 방법</Text>
              <Text style={styles.summaryValue}>
                {paymentMethods.find(p => p.id === selectedPayment)?.name}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>총 결제 금액</Text>
              <Text style={styles.summaryTotalValue}>
                {subscriptionPlans.find(p => p.id === selectedPlan)?.price.toLocaleString()}원/월
              </Text>
            </View>
          </View>
        </View>

        {/* 결제 버튼 */}
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>
            {subscriptionPlans.find(p => p.id === selectedPlan)?.price.toLocaleString()}원으로 구독하기
          </Text>
        </TouchableOpacity>

        {/* 안내 사항 */}
        <View style={styles.noticeSection}>
          <Text style={styles.noticeTitle}>📋 이용 안내</Text>
          <Text style={styles.noticeText}>
            • 구독은 언제든지 취소할 수 있습니다{'\n'}
            • 결제일 3일 전 미리 알림을 보내드립니다{'\n'}
            • 첫 달은 50% 할인 혜택이 적용됩니다{'\n'}
            • 환불은 이용약관에 따라 처리됩니다
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
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
  header: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
  previewSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 15,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  previewItem: {
    backgroundColor: COLORS.WHITE,
    width: '47%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  previewIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
  },
  plansSection: {
    padding: 20,
    paddingTop: 0,
  },
  planCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    position: 'relative',
  },
  selectedPlanCard: {
    borderColor: COLORS.PRIMARY,
  },
  popularPlanCard: {
    borderColor: COLORS.SECONDARY,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 5,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  planPeriod: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textDecorationLine: 'line-through',
  },
  planFeatures: {
    gap: 8,
  },
  planFeature: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  paymentSection: {
    padding: 20,
    paddingTop: 0,
  },
  paymentMethod: {
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
  },
  selectedPaymentMethod: {
    borderColor: COLORS.PRIMARY,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: COLORS.PRIMARY,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY,
  },
  summarySection: {
    padding: 20,
    paddingTop: 0,
  },
  summaryCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: 10,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  subscribeButton: {
    backgroundColor: COLORS.PRIMARY,
    margin: 20,
    marginTop: 0,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
  noticeSection: {
    margin: 20,
    marginTop: 0,
    padding: 15,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderRadius: 12,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  bottomSpace: {
    height: 20,
  },
});
