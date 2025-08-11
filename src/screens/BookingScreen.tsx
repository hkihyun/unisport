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

// 동적 달력 데이터 생성
const generateCalendarData = (year: number, month: number) => {
  const calendar = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  // 빈 칸 추가 (이전 달의 마지막 날짜들)
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendar.push({ day: null, isSelectable: false, isCurrentMonth: false });
  }
  
  // 현재 달의 날짜 추가
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month - 1;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurrentMonth && day === today.getDate();
    const isPast = isCurrentMonth && day < today.getDate();
    
    calendar.push({ 
      day, 
      isSelectable: !isPast, // 과거 날짜는 선택 불가
      hasBooking: [15, 20].includes(day), // 임시 예약 데이터 (나중에 API로 교체)
      isCurrentMonth: true,
      isToday,
    });
  }
  
  // 다음 달의 첫 번째 주를 채우기 위한 빈 칸 추가
  // 각 주가 7일이 되도록 맞춤
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
  const remainingCells = totalCells - calendar.length;
  for (let i = 0; i < remainingCells; i++) {
    calendar.push({ day: null, isSelectable: false, isCurrentMonth: false });
  }
  
  return calendar;
};

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export const BookingScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const calendarData = generateCalendarData(currentYear, currentMonth);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth, 1));
    setSelectedDate(null);
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

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
    <ScrollView style={styles.bookingList} showsVerticalScrollIndicator={false}>
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
          <Text style={styles.bookingLocation}>{booking.location}</Text>
          
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
        <Text style={styles.calendarTitle}>{currentYear}년 {currentMonth}월</Text>
        <View style={styles.calendarNavButtons}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Text style={styles.navButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToCurrentMonth}>
            <Text style={styles.navButtonText}>현재</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextMonth}>
            <Text style={styles.navButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
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
              item.isToday && styles.today,
              !item.isCurrentMonth && styles.otherMonth,
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
                  item.isToday && styles.todayText,
                  !item.isCurrentMonth && styles.otherMonthText,
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
            {currentYear}년 {currentMonth}월 {selectedDate}일
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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    borderBottomWidth: 3,
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
    padding: 24,
  },
  bookingCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginRight: 16,
    letterSpacing: -0.3,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBadgeText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  bookingInstructor: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    lineHeight: 20,
  },
  bookingDate: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  bookingTime: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginBottom: 8,
  },
  bookingLocation: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 20,
    lineHeight: 20,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1.5,
    borderColor: COLORS.ERROR,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  cancelButtonText: {
    color: COLORS.ERROR,
  },
  calendarContainer: {
    flex: 1,
    padding: 24,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  calendarTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  calendarNavButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  calendarDay: {
    width: '14.28%', // 100% / 7 ≈ 14.28%
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    margin: 0,
    minWidth: 40, // 최소 너비 보장
  },
  selectedDay: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dayWithBooking: {
    backgroundColor: COLORS.PRIMARY_SUBTLE,
    borderRadius: 20,
  },
  disabledDay: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  selectedDayText: {
    color: COLORS.WHITE,
    fontWeight: '700',
  },
  dayWithBookingText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  disabledDayText: {
    color: COLORS.TEXT_TERTIARY,
  },
  today: {
    backgroundColor: COLORS.PRIMARY_SUBTLE,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  todayText: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
  },
  otherMonth: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: COLORS.TEXT_TERTIARY,
  },
  bookingDot: {
    position: 'absolute',
    bottom: 6,
    width: 6,
    height: 6,
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 3,
  },
  selectedDateInfo: {
    marginTop: 24,
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  selectedDateText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  timeSlots: {
    gap: 12,
  },
  timeSlotsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  timeSlot: {
    padding: 16,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
});
