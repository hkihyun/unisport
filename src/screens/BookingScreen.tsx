import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../constants/screens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { LessonService } from '../services/lessonService';
import { BackendLesson } from '../types';
import { BookingBottomSheet } from './BookingBottomSheet';
import { Header } from '../components/Header';


// 임시 예약 데이터 (기존 예약 목록용)
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
      hasBooking: false,
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false); // 바텀시트 표시 상태 추가
  const navigation = useNavigation<any>();
  const [dailyLessons, setDailyLessons] = useState(
    [] as Array<{ id: string; time: string; title: string; place: string; available?: boolean }>
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  
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

  // 날짜 선택 시 수업 리스트 표시 및 애니메이션
  const handleDateSelect = async (day: number) => {
    if (day && day > 0) {
      setSelectedDate(day);
      setLoading(true);
      setError(null);
      
      try {
        // 날짜 형식을 YYYY-MM-DD로 변환
        const formattedDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const lessons = await LessonService.getLessonsByDate(formattedDate);
        
        // BackendLesson을 UI에 맞는 형태로 변환
        const convertedLessons = lessons.map(lesson => ({
          id: lesson.id.toString(),
          time: lesson.lessonTime,
          title: lesson.title,
          place: lesson.location,
          available: true, // 기본적으로 예약 가능으로 설정
        }));
        
        console.log('변환된 레슨 데이터:', convertedLessons);
        console.log('변환된 레슨 개수:', convertedLessons.length);
        
        setDailyLessons(convertedLessons);
        
        // 수업이 있든 없든 바텀시트 표시 (수업이 없으면 "수업이 없습니다" 메시지 표시)
        setBottomSheetVisible(true);
      } catch (err) {
        setError('수업 데이터를 불러올 수 없습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
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
    <ScrollView style={styles.bookingList} showsVerticalScrollIndicator={true}>
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
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.monthNavArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.calendarTitle}>{currentYear}.{currentMonth}</Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.monthNavArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      
      {/* 통합된 달력 배경 */}
      <View style={styles.unifiedCalendarBackground}>
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
                !item.isSelectable && styles.disabledDay,
                !item.isCurrentMonth && styles.otherMonth,
              ]}
              onPress={() => {
                if (!item.isSelectable || !item.day) return;
                handleDateSelect(item.day);
              }}
              disabled={!item.isSelectable}
            >
              {item.day && (
                <View style={[styles.dayCircle, item.day === selectedDate ? styles.dayCircleSelected : styles.dayCircleDefault]}>
                  <Text 
                    style={[
                      styles.calendarDayText,
                      item.day === selectedDate && styles.selectedDayText,
                      !item.isSelectable && styles.disabledDayText,
                      !item.isCurrentMonth && styles.otherMonthText,
                    ]}
                  >
                    {item.day}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

        	const renderTimeline = () => {
      // BookingBottomSheet는 항상 렌더링하되, visible prop으로 제어
      return (
        <BookingBottomSheet
          visible={bottomSheetVisible}
          dateText={selectedDate ? `${currentMonth}월 ${selectedDate}일` : ''}
          lessons={dailyLessons}
          onSelect={(lesson) => {
            navigation.navigate(SCREENS.LESSON_DETAIL, { 
              lessonId: lesson.id, 
              title: lesson.title,
              time: lesson.time,
              date: `${currentMonth}월${selectedDate}일`,
              place: lesson.place
            });
          }}
          onClose={() => {
            setBottomSheetVisible(false); // 바텀시트만 내리기
          }}
        />
      );
    };

  return (
    <View style={styles.container}>
      <SafeAreaView>      
        <Header title="수업예약" showLogo={false} />
      </SafeAreaView>
      
      {/* 달력은 항상 고정 */}
      <View style={styles.fixedCalendarContainer}>
        {renderCalendar()}
      </View>
      
      {/* 수업 리스트는 별도로 렌더링 */}
      {renderTimeline()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 20,
    paddingVertical: 10,
    marginBottom: -17,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8EE',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  scrollContent: { paddingBottom: 24 },
  bookingList: {
    flex: 1,
    padding: 30,
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
  calendarContainer: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 16 },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarTitle: {
    fontSize: 26,
    fontWeight: '500',
    color: '#2B308B',
    marginHorizontal: 16,
  },
  monthNavArrow: { fontSize: 24, fontWeight: '300', color: COLORS.PRIMARY },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '400',
    color: '#2B308B',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  unifiedCalendarBackground: {
    backgroundColor: '#EDF2F8',
    borderRadius: 20,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  calendarDay: {
    width: '14.28%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 6,
  },
  dayCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dayCircleDefault: { backgroundColor: '#AEC7EB' },
  dayCircleSelected: { backgroundColor: COLORS.PRIMARY },
  selectedDay: {},
  dayWithBooking: {
    backgroundColor: '#F2F4FF',
    borderRadius: 20,
  },
  disabledDay: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#FEFEFE',
    fontWeight: '400',
  },
  selectedDayText: {
    color: '#FEFEFE',
    fontWeight: '400',
  },
  dayWithBookingText: {
    color: '#2B308B',
    fontWeight: '400',
  },
  disabledDayText: {
    color: COLORS.TEXT_TERTIARY,
  },
  today: {},
  todayText: {},
  otherMonth: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: COLORS.TEXT_TERTIARY,
  },
     /* Timeline */
   timelineWrap: { paddingTop: 8, paddingBottom: 24 },
     timelineRow: { flexDirection: 'row', alignItems: 'stretch', marginBottom: 16, paddingHorizontal: 24 },
  timelineCol: { width: 32, alignItems: 'center' },
  timelineLineTop: { flex: 1, width: 2, backgroundColor: '#A7B1CD' },
  timelineLineBottom: { flex: 1, width: 2, backgroundColor: '#A7B1CD' },
  timelineDot: { width: 21, height: 21, borderRadius: 10.5, backgroundColor: '#A7B1CD' },
  lessonCard: { flex: 1, backgroundColor: '#EDF2F8', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center' },
  cardLeft: { flex: 1 },
  cardRight: { width: 110, alignItems: 'flex-end', justifyContent: 'center' },
  cardThumb: { width: 94, height: 94, borderRadius: 12, backgroundColor: '#AEC7EB' },
  heartOutline: { position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderWidth: 2, borderColor: COLORS.PRIMARY, borderRadius: 6 },
  cardTime: { fontSize: 15, color: '#2B308B', marginBottom: 6 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#2B308B', marginBottom: 8 },
  cardPlace: { fontSize: 13, color: '#696E83', marginBottom: 8 },
  cardAvailable: { fontSize: 15, color: COLORS.PRIMARY },
  
                 // 새로 추가된 스타일들
     timelineHeader: {
       flexDirection: 'row',
       justifyContent: 'center',
       alignItems: 'center',
       marginBottom: 20,
       paddingHorizontal: 24,
       paddingVertical: 12,
       backgroundColor: COLORS.WHITE,
       borderRadius: 16,
     },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B308B',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  
     // 화살표 관련 스타일들 (피그마 디자인 적용)
   arrowContainer: {
     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 4,
     paddingHorizontal: 8, // 터치 영역 확대
     width: '100%', // 전체 너비 사용
   },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#5981FA', // 피그마의 파란색
    transform: [{ rotate: '0deg' }], // 기본: 아래쪽 화살표
  },
  arrowUp: {
    transform: [{ rotate: '180deg' }], // 위쪽 화살표 (180도 회전)
  },
  
               // 수업 리스트 컨테이너
    lessonListContainer: {
      flex: 1,
      backgroundColor: COLORS.WHITE, // 배경색 추가
      width: '100%', // 화면 전체 너비
    },
  
  // 고정된 달력 컨테이너
  fixedCalendarContainer: {
    paddingHorizontal: 10,
    paddingBottom: 16,
    paddingTop: -30,
  },
  
  // 스크롤 가능한 수업 리스트
  scrollableLessonList: {
    flex: 1,
  },
  
  // 접힌 상 태의 수업 리스트
  collapsedLessonList: {
    height: 80,
    overflow: 'hidden',
    },
  
  // 접힌 상태 텍스트
  collapsedText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  errorText: {
    color: COLORS.ERROR,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noDataContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B308B',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
