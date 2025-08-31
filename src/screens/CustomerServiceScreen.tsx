import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';

export const CustomerServiceScreen: React.FC = () => {
  const navigation = useNavigation();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqItems = [
    {
      question: '구독 없이 예약할 수 있나요?',
      answer: '구독 없이는 수업을 예약할 수 없습니다. 하지만 구독하지 않아도 수업 목록을 볼 수 있습니다.'
    },
    {
      question: '구독 가격과 기간은?',
      answer: '구독료는 60,000원이며, 구독은 한학기 동안 지속됩니다'
    },
    {
      question: '환불이 가능한가요?',
      answer: '구독 시작 후 7일 이내에는 전액 환불이 가능합니다. 7일 이후에는 잔여 기간에 대한 부분 환불이 가능합니다.'
    },
    {
      question: '예약은 언제 열리나요?',
      answer: '수업 예약은 해당 수업 시작 2주 전부터 가능합니다. 인기 수업의 경우 빠른 예약을 권장합니다.'
    },
    {
      question: '일정은 얼마나 미리 볼 수 있나요?',
      answer: '수업 일정은 최대 3개월 전까지 미리 확인할 수 있습니다. 정확한 일정은 강사와 협의 후 결정됩니다.'
    },
    {
      question: '예약 취소는 어디서 하나요?',
      answer: '마이페이지 > 예약 내역에서 예약 취소가 가능합니다. 수업 시작 24시간 전까지는 무료 취소가 가능합니다.'
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* 헤더 */}
      <Header
        title="고객센터"
        showLogo={true}
        customIcon={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LeftArrowBlue width={32} height={32} />
          </TouchableOpacity>
        }
        />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 메인 제목 */}
        <Text style={styles.mainTitle}>무엇을 도와드릴까요?</Text>

        {/* FAQ 섹션 */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>자주 묻는 질문</Text>
          <View style={styles.divider} />
          
          {faqItems.map((item, index) => (
            <View key={index}>
              <TouchableOpacity 
                style={styles.faqItem} 
                onPress={() => toggleExpanded(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.qIcon}>Q</Text>
                <Text style={styles.faqText}>{item.question}</Text>
                <Text style={[
                  styles.expandIcon, 
                  expandedItems.includes(index) && styles.expandIconExpanded
                ]}>
                  {expandedItems.includes(index) ? '−' : '+'}
                </Text>
              </TouchableOpacity>
              
              {/* 답변 영역 */}
              {expandedItems.includes(index) && (
                <View style={styles.answerContainer}>
                  <Text style={styles.aIcon}>A</Text>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
              
              {index < faqItems.length - 1 && <View style={styles.itemDivider} />}
            </View>
          ))}
        </View>

        {/* 섹션 구분선 */}
        <View style={styles.sectionDivider} />

        {/* 전화 문의 섹션 */}
        <View style={styles.phoneSection}>
          <Text style={styles.phoneTitle}>전화 문의</Text>
          <Text style={styles.phoneNumber}>070-1234-5678</Text>
          <Text style={styles.phoneHours}>평일 오전 10:00 ~ 오후 6:00 (주말 및 공휴일 제외)</Text>
          <Text style={styles.phoneHours}>점심시간(오후 1:00 - 오후 2:00)</Text>
        </View>
      </ScrollView>

      {/* 하단 푸터 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpText}>도움이 필요 하신가요?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
  },
  
  // 헤더 스타일
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  
  backButton: {
    padding: 10,
  },
  
  backIcon: {
    fontSize: 24,
    color: '#3478F6',
    fontWeight: '600',
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3478F6',
  },
  
  headerSpacer: {
    width: 44,
  },
  
  // 메인 콘텐츠 스타일
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  mainTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#3478F6',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  
  // FAQ 섹션 스타일
  faqSection: {
    marginBottom: 30,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 15,
  },
  
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  
  qIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3478F6',
    marginRight: 15,
    width: 20,
    textAlign: 'center',
  },
  
  faqText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#3478F6',
  },
  
  expandIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3478F6',
    marginLeft: 10,
    width: 20,
    textAlign: 'center',
  },
  
  expandIconExpanded: {
    transform: [{ rotate: '0deg' }],
  },
  
  // 답변 영역 스타일
  answerContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  
  aIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#28A745',
    marginRight: 15,
    width: 20,
    textAlign: 'center',
  },
  
  answerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 20,
  },
  
  itemDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  
  // 섹션 구분선
  sectionDivider: {
    height: 8,
    backgroundColor: '#F2F2F7',
    marginVertical: 30,
  },
  
  // 전화 문의 섹션
  phoneSection: {
    marginBottom: 50,
  },
  
  phoneTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  
  phoneNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 15,
  },
  
  phoneHours: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 5,
  },
  
  // 푸터 스타일
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  
  helpIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3478F6',
    marginRight: 8,
  },
  
  helpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3478F6',
  },
});