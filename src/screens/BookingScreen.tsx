import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

// 임시 예약 데이터
const mockBookings = [
  {
    id: '1',
    lessonTitle: '테니스 기초 레슨',
    instructor: '김철수',
    date: '2024년 3월 15일',
    time: '10:00 - 11:00',
    status: 'confirmed',
    location: '강남 테니스장',
  },
  {
    id: '2',
    lessonTitle: '축구 개인 레슨',
    instructor: '이영희',
    date: '2024년 3월 20일',
    time: '14:00 - 15:00',
    status: 'pending',
    location: '잠실 축구장',
  },
];

// 달력 데이터 (간단한 3월 달력)
const generateCalendarData = () => {
  const calendar = [];
  const daysInMonth = 31;
  const firstDayOfWeek = 5; // 3월 1일이 금요일이라고 가정
  
  // 빈 칸 추가
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendar.push({ day: null, isSelectable: false });
  }
  
  // 날짜 추가
  for (let day = 1; day <= daysInMonth; day++) {
    calendar.push({ 
      day, 
      isSelectable: day >= 15, // 15일부터 선택 가능
      hasBooking: [15, 20].includes(day), // 예약이 있는 날
    });
  }
  
  return calendar;
};

const calendarData = generateCalendarData();
const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export const BookingScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('list');

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '예약 확정';
      case 'pending':
        return '대기중';
      case 'cancelled':
        return '취소됨';
      default:
        return '알 수 없음';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return COLORS.SUCCESS;
      case 'pending':
        return COLORS.WARNING;
      case 'cancelled':
        return COLORS.ERROR;
      default:
        return COLORS.GRAY_500;
    }
  };

  const renderBookingList = () => (
    <ScrollView style={styles.bookingList}>
      {mockBookings.map((booking) => (
        <View key={booking.id} style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle}>{booking.lessonTitle}</Text>
            <View 
              style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(booking.status) }
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {getStatusText(booking.status)}
              </Text>
            </View>
          </View>
          
          <Text style={styles.bookingInstructor}>강사: {booking.instructor}</Text>
          <Text style={styles.bookingDate}>{booking.date}</Text>
          <Text style={styles.bookingTime}>{booking.time}</Text>
          <Text style={styles.bookingLocation}>📍 {booking.location}</Text>
          
          <View style={styles.bookingActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>상세보기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>취소하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderCalendar = () => (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarTitle}>2024년 3월</Text>
      </View>
      
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.calendarGrid}>
        {calendarData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.calendarDay,
              item.day === selectedDate && styles.selectedDay,
              item.hasBooking && styles.dayWithBooking,
              !item.isSelectable && styles.disabledDay,
            ]}
            onPress={() => item.isSelectable && setSelectedDate(item.day)}
            disabled={!item.isSelectable}
          >
            {item.day && (
              <Text 
                style={[
                  styles.calendarDayText,
                  item.day === selectedDate && styles.selectedDayText,
                  item.hasBooking && styles.dayWithBookingText,
                  !item.isSelectable && styles.disabledDayText,
                ]}
              >
                {item.day}
              </Text>
            )}
            {item.hasBooking && <View style={styles.bookingDot} />}
          </TouchableOpacity>
        ))}
      </View>
      
      {selectedDate && (
        <View style={styles.selectedDateInfo}>
          <Text style={styles.selectedDateText}>
            2024년 3월 {selectedDate}일
          </Text>
          <View style={styles.timeSlots}>
            <Text style={styles.timeSlotsTitle}>예약 가능한 시간</Text>
            {['10:00 - 11:00', '13:00 - 14:00', '15:00 - 16:00'].map((time) => (
              <TouchableOpacity key={time} style={styles.timeSlot}>
                <Text style={styles.timeSlotText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 탭 헤더 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
            예약 목록
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
          onPress={() => setActiveTab('calendar')}
        >
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
            달력 보기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 컨텐츠 */}
      {activeTab === 'list' ? renderBookingList() : renderCalendar()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_SECONDARY,
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  bookingList: {
    flex: 1,
    padding: 15,
  },
  bookingCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  bookingInstructor: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 5,
  },
  bookingDate: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 3,
  },
  bookingTime: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
    marginBottom: 5,
  },
  bookingLocation: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 15,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
  },
  cancelButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.ERROR,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.WHITE,
  },
  cancelButtonText: {
    color: COLORS.ERROR,
  },
  calendarContainer: {
    flex: 1,
    padding: 15,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_SECONDARY,
    paddingVertical: 10,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
  },
  dayWithBooking: {
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderRadius: 20,
  },
  disabledDay: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  selectedDayText: {
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  dayWithBookingText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  disabledDayText: {
    color: COLORS.TEXT_TERTIARY,
  },
  bookingDot: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 4,
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 2,
  },
  selectedDateInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 15,
    textAlign: 'center',
  },
  timeSlots: {
    gap: 10,
  },
  timeSlotsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
  },
  timeSlot: {
    padding: 12,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
});
