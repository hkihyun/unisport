import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Header } from '../components/Header';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';
import { LessonService } from '../services/lessonService';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants/colors';
import { BackendLessonDetail } from '../types';

interface Lesson {
  id: number;
  title: string;
  lessonDate: string;
  lessonTime: string;
  location: string;
  sport: string;
  level: number;
  capacity: number;
  reserved_count: number;
  status?: 'active' | 'completed' | 'cancelled';
}

export const OpenLessonsScreen: React.FC<any> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'completed'>('scheduled');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // 유저가 개설한 수업 데이터 가져오기
  const fetchMyLessons = async () => {
    if (!isAuthenticated || !user) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 백엔드 API: 사용자별 수업 조회 (GET /lessons/by-userId?userId={userId})
      const response = await LessonService.getLessonsByUserId(parseInt(user.id));

             if (response.success) {
         // 백엔드에서 성공적으로 응답했지만 데이터가 없는 경우 (수업이 없는 경우)
         // response.data가 null, undefined이거나 빈 배열인 경우
         if (!response.data || response.data.length === 0) {
           setLessons([]);
           setError(null); // 에러 상태 초기화
           console.log('개설한 수업이 없습니다.');
           return;
         }
         
         // 백엔드 응답 데이터를 UI에 맞는 형태로 변환
         const convertedLessons = response.data.map((lesson: BackendLessonDetail) => {
           // schedules 배열의 첫 번째 항목에서 날짜와 시간 정보 가져오기
           const firstSchedule = lesson.schedules && lesson.schedules.length > 0 ? lesson.schedules[0] : null;
           
           // 예약 상태에 따라 상태 결정
           let status: 'active' | 'completed' | 'cancelled';
           if (firstSchedule) {
             if (firstSchedule.reservedCount >= firstSchedule.capacity) {
               status = 'completed';
             } else {
               status = 'active';
             }
           } else {
             status = 'active'; // 기본값
           }

           // schedules가 null이거나 비어있는 경우 기본값 설정
           const lessonDate = firstSchedule ? firstSchedule.date : new Date().toISOString().split('T')[0];
           const lessonTime = firstSchedule ? firstSchedule.startTime : '10:00:00';
           const capacity = firstSchedule ? firstSchedule.capacity : lesson.capacity;
           const reservedCount = firstSchedule ? firstSchedule.reservedCount : 0;

           return {
             id: lesson.id,
             title: lesson.title,
             lessonDate: lessonDate,
             lessonTime: lessonTime,
             location: lesson.location,
             sport: lesson.sport,
             level: lesson.level,
             capacity: capacity,
             reserved_count: reservedCount,
             status: status
           };
         });

         setLessons(convertedLessons);
         console.log('개설한 수업 데이터:', convertedLessons);
       } else {
         // 실제 API 오류인 경우에만 에러 메시지 설정
         setError(response.message || '수업 데이터를 불러올 수 없습니다.');
       }
    } catch (err) {
      console.error('수업 데이터 가져오기 오류:', err);
      setError('수업 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLessons();
  }, [isAuthenticated, user]);

  // 레슨 삭제 처리
  const handleDeleteLesson = async (lessonId: number) => {
    Alert.alert(
      '레슨 삭제',
      '정말로 이 레슨을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await LessonService.deleteLesson(lessonId.toString());
              
              if (response.success) {
                Alert.alert('성공', '레슨이 삭제되었습니다.');
                // 삭제된 레슨을 로컬 상태에서 제거
                setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
              } else {
                Alert.alert('오류', response.message || '레슨 삭제에 실패했습니다.');
              }
            } catch (error) {
              console.error('레슨 삭제 오류:', error);
              Alert.alert('오류', '레슨 삭제 중 오류가 발생했습니다.');
            }
          }
        }
      ]
    );
  };

  // 날짜를 한국어 형식으로 변환
  const formatDate = (dateString: string) => {
    try {
      if (!dateString || dateString.trim() === '') {
        return '날짜 정보 없음';
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '날짜 정보 없음';
      }
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
      return `${month}.${day}(${dayOfWeek})`;
    } catch (error) {
      return '날짜 정보 없음';
    }
  };

  // 날짜 그룹 헤더 형식
  const formatDateGroup = (dateString: string) => {
    try {
      if (!dateString || dateString.trim() === '') {
        return '날짜 정보 없음';
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '날짜 정보 없음';
      }
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
      return `${month}월 ${day}일 ${dayOfWeek}`;
    } catch (error) {
      return '날짜 정보 없음';
    }
  };

  // 시간 형식 변환 (백엔드 API: "HH:MM:SS" 형식)
  const formatTime = (timeString: string) => {
    try {
      if (!timeString || timeString.trim() === '') {
        return '시간 정보 없음';
      }
      
      // "HH:MM:SS" 형식을 "오전/오후 H:MM" 형식으로 변환
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      if (isNaN(hour)) {
        return '시간 정보 없음';
      }
      const period = hour < 12 ? '오전' : '오후';
      const displayHour = hour < 12 ? hour : hour - 12;
      return `${period}${displayHour}:${minutes}`;
    } catch (error) {
      return '시간 정보 없음';
    }
  };

  // 탭에 따른 수업 필터링
  const filteredLessons = lessons.filter(lesson => {
    // 유효하지 않은 날짜는 건너뛰기
    if (!lesson.lessonDate || lesson.lessonDate.trim() === '') {
      return false;
    }
    
    try {
      const lessonDate = new Date(lesson.lessonDate);
      if (isNaN(lessonDate.getTime())) {
        return false;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (activeTab === 'scheduled') {
        // 예정된 수업: 오늘 이후의 수업
        return lessonDate >= today;
      } else {
        // 완료된 수업: 오늘 이전의 수업
        return lessonDate < today;
      }
    } catch (error) {
      console.warn('날짜 파싱 오류:', error);
      return false;
    }
  });

  // 날짜별로 그룹화
  const groupedLessons = filteredLessons.reduce((groups: any, lesson) => {
    const dateGroup = formatDateGroup(lesson.lessonDate);
    const group = groups.find((g: any) => g.dateGroup === dateGroup);
    if (group) {
      group.lessons.push(lesson);
    } else {
      groups.push({ dateGroup, lessons: [lesson] });
    }
    return groups;
  }, []);

  const renderLessonItem = (lesson: Lesson, index: number, isLastInGroup: boolean) => (
    <View key={lesson.id} style={styles.lessonItem}>
      <View style={styles.timelineContainer}>
        <View style={styles.timelineDot} />
        {!isLastInGroup && <View style={styles.timelineLine} />}
      </View>
      <View style={styles.lessonContent}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonDateTime}>
          {formatDate(lesson.lessonDate)} {formatTime(lesson.lessonTime)}
        </Text>
        <Text style={styles.lessonLocation}>{lesson.location}</Text>
        <Text style={styles.lessonDetails}>
          {lesson.sport} • 레벨 {lesson.level} • {lesson.reserved_count}/{lesson.capacity}명
        </Text>
      </View>
             <TouchableOpacity 
         style={styles.optionsButton}
         onPress={() => {
           Alert.alert(
             '수업 관리',
             '수업을 수정하거나 삭제하시겠습니까?',
             [
               { text: '취소', style: 'cancel' },
               { text: '삭제', onPress: () => handleDeleteLesson(lesson.id), style: 'destructive' }
             ]
           );
         }}
       >
        <Text style={styles.optionsText}>⋯</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDateGroup = (dateGroup: string, groupLessons: Lesson[]) => (
    <View key={dateGroup} style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{dateGroup}</Text>
      {groupLessons.map((lesson, index) => 
        renderLessonItem(lesson, index, index === groupLessons.length - 1)
      )}
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>수업 데이터를 불러오는 중...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMyLessons}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      );
    }

         // 사용자가 전혀 수업을 개설하지 않은 경우
     if (lessons.length === 0) {
       return (
         <View style={styles.centerContainer}>
           <Text style={styles.noDataText}>사용자가 개설한 수업이 없습니다</Text>
           <Text style={styles.noDataSubtext}>새로운 수업을 개설해보세요!</Text>
         </View>
       );
     }
     
     // 탭별로 필터링된 결과가 없는 경우
     if (filteredLessons.length === 0) {
       return (
         <View style={styles.centerContainer}>
           <Text style={styles.noDataText}>
             {activeTab === 'scheduled' ? '예정된 수업이 없습니다.' : '완료된 수업이 없습니다.'}
           </Text>
           <Text style={styles.noDataSubtext}>
             {activeTab === 'scheduled' 
               ? '새로운 수업을 개설해보세요!' 
               : '아직 완료된 수업이 없습니다.'
             }
           </Text>
         </View>
       );
     }

    return (
      <ScrollView style={styles.lessonList} showsVerticalScrollIndicator={false}>
        {groupedLessons.map((group: any) => renderDateGroup(group.dateGroup, group.lessons))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <Header
        title="개설 수업"
        showLogo={true}
        customIcon={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LeftArrowBlue width={32} height={32} />
          </TouchableOpacity>
        }
      />

      {/* 탭 선택 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'scheduled' && styles.tabActive
          ]}
          onPress={() => setActiveTab('scheduled')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'scheduled' && styles.tabTextActive
          ]}>
            예정된 수업
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'completed' && styles.tabActive
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'completed' && styles.tabTextActive
          ]}>
            완료된 수업
          </Text>
        </TouchableOpacity>
      </View>

      {/* 수업 목록 */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 21,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#5981FA',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: 'white',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.ERROR,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  lessonList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateGroup: {
    marginBottom: 30,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5981FA',
    marginBottom: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5981FA',
    marginBottom: 8,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#5981FA',
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  lessonDateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  lessonLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  lessonDetails: {
    fontSize: 12,
    color: '#999',
  },
  optionsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  optionsText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
});

export default OpenLessonsScreen;
