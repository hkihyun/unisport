import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Header } from '../components/Header';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';
import { LessonService } from '../services/lessonService';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants/colors';

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
      
      // LessonService.getMyLessons API 호출
      const response = await LessonService.getMyLessons({
        page: 1,
        limit: 100 // 충분한 수업을 가져오기 위해 100으로 설정
      });

      if (response.success && response.data) {
        // 백엔드 응답 데이터를 UI에 맞는 형태로 변환
        const convertedLessons = response.data.data.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          lessonDate: lesson.lessonDate,
          lessonTime: lesson.lessonTime,
          location: lesson.location,
          sport: lesson.sport,
          level: lesson.level,
          capacity: lesson.capacity,
          reserved_count: lesson.reserved_count,
          status: lesson.status || 'active'
        }));

        setLessons(convertedLessons);
        console.log('개설한 수업 데이터:', convertedLessons);
      } else {
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

  // 날짜를 한국어 형식으로 변환
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
      return `${month}.${day}(${dayOfWeek})`;
    } catch (error) {
      return dateString;
    }
  };

  // 날짜 그룹 헤더 형식
  const formatDateGroup = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
      return `${month}월 ${day}일 ${dayOfWeek}`;
    } catch (error) {
      return dateString;
    }
  };

  // 시간 형식 변환
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const period = hour < 12 ? '오전' : '오후';
      const displayHour = hour < 12 ? hour : hour - 12;
      return `${period}${displayHour}:${minutes}`;
    } catch (error) {
      return timeString;
    }
  };

  // 탭에 따른 수업 필터링
  const filteredLessons = lessons.filter(lesson => {
    if (activeTab === 'scheduled') {
      // 예정된 수업: 오늘 이후의 수업
      const lessonDate = new Date(lesson.lessonDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return lessonDate >= today;
    } else {
      // 완료된 수업: 오늘 이전의 수업
      const lessonDate = new Date(lesson.lessonDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return lessonDate < today;
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
              { text: '수정', onPress: () => console.log('수업 수정') },
              { text: '삭제', onPress: () => console.log('수업 삭제'), style: 'destructive' }
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
