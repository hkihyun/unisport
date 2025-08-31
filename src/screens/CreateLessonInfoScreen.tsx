import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, StatusBar, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import { SCREENS } from '../constants/screens';
import { LessonService } from '../services/lessonService';
import { InstructorService } from '../services/instructorService';
import { useAuth } from '../hooks/useAuth';
import { CreateLessonRequest } from '../types';
import { Header } from '../components/Header';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';
import { DifficultyLevel } from '../../assets/icons/DifficultyIcon';



export const CreateLessonInfoScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuth();
  const [sport, setSport] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [location, setLocation] = useState('');
  const [weeklyOption, setWeeklyOption] = useState<'weekly' | 'biweekly'>('weekly');
  const [selectedDays, setSelectedDays] = useState<string[]>(['월', '화', '수', '목', '금', '토', '일']);
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isInstructorVerified, setIsInstructorVerified] = useState(false);
  const [showSportModal, setShowSportModal] = useState(false);

  const days = ['월', '화', '수', '목', '금', '토', '일'];

  // 종목 데이터 (LessonListScreen에서 가져온 데이터)
  const sportCategories = {
    'ㄱ': ['걷기', '계단오르기', '검도', '골프', '근력운동'],
    'ㄴ': ['농구', '노르딕워킹'],
    'ㄷ': ['당구', '덤벨 트레이닝', '댄스', '등산'],
    'ㄹ': ['라이딩', '러닝', '롤러스케이팅', '라켓볼'],
    'ㅁ': ['마라톤', '맨몸운동'],
    'ㅂ': ['배드민턴', '배구', '복싱', '볼링', '바이크'],
    'ㅅ': ['수영', '스쿼시', '스케이트보드', '스피닝', '서킷 트레이닝'],
    'ㅇ': ['요가', '에어로빅', '워킹', '유산소 서킷'],
    'ㅈ': ['자전거', '족구', '주짓수', '줄넘기'],
    'ㅊ': ['축구', '철봉 운동', '체조'],
    'ㅋ': ['클라이밍', '크로스핏', '킥복싱'],
    'ㅌ': ['탁구', '태권도', '테니스', '트레킹'],
    'ㅍ': ['필라테스', '푸시업', '파워워킹'],
    'ㅎ': ['하이킹', '헬스', '합기도']
  };

  // 모든 종목을 하나의 배열로 만들기
  const allSports = Object.values(sportCategories).flat();

  // 강사 인증 상태를 AsyncStorage에서 확인
  useEffect(() => {
    const checkInstructorVerificationStatus = async () => {
      try {
        const instructorVerified = await AsyncStorage.getItem('instructorVerified');
        console.log('🔍 CreateLessonInfoScreen - AsyncStorage 강사 인증 상태:', instructorVerified);
        if (instructorVerified === 'true') {
          console.log('🎉 CreateLessonInfoScreen - 강사 인증 완료 상태 확인!');
          setIsInstructorVerified(true);
        } else {
          setIsInstructorVerified(false);
        }
      } catch (error) {
        console.error('강사 인증 상태 확인 중 오류:', error);
        setIsInstructorVerified(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkInstructorVerificationStatus();
  }, []);

  const handleCreateLesson = () => {
    if (!isInstructorVerified) {
      Alert.alert(
        '강사 인증 필요',
        '수업을 개설하려면 강사 인증이 필요합니다.',
        [
          {
            text: '취소',
            style: 'cancel'
          },
          {
            text: '강사 인증하기',
            onPress: () => navigation.navigate(SCREENS.INSTRUCTOR_VERIFY)
          }
        ]
      );
      return;
    }

    // 강사 인증된 경우 수업 개설 화면으로 이동
    navigation.navigate(SCREENS.CREATE_LESSON_INFO);
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const goNext = async () => {
    if (!sport || !title || !description || !location || !time) {
      Alert.alert('입력 필요', '모든 필수 정보를 입력해 주세요.');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('입력 필요', '수업 요일을 선택해 주세요.');
      return;
    }

    if (!user?.id) {
      Alert.alert('오류', '사용자 정보를 찾을 수 없습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 새로운 레슨 생성 API 형식에 맞춰 데이터 구성
      const lessonData = {
        sport,
        title,
        description,
        level,
        location,
        capacity: 10, // 기본 수용 인원
        instructorUserId: parseInt(user.id),
        lessonDate: '2025-09-01', // 기본 날짜 (실제로는 선택된 날짜 사용)
        lessonTime: time
      };

      console.log('📝 레슨 생성 데이터:', lessonData);

      const response = await LessonService.createLessonNew(lessonData);
      
      if (response.success && response.data) {
        console.log('✅ 레슨 생성 성공:', response.data);
        navigation.navigate(SCREENS.CREATE_LESSON_COMPLETE, { 
          title, 
          date: selectedDays.join(', '), 
          time, 
          place: location,
          lessonId: response.data.id 
        });
      } else {
        console.log('❌ 레슨 생성 실패:', response.error);
        Alert.alert('오류', response.error || '레슨 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('레슨 생성 오류:', error);
      Alert.alert('오류', '레슨 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중이거나 강사 인증 확인 중일 때
  if (isCheckingAuth) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>강사 인증 상태를 확인 중...</Text>
        </View>
      </View>
    );
  }

  // 강사 인증되지 않은 경우
  if (!isInstructorVerified) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        
        <Header
        title="수업 개설"
        showLogo={true}
        customIcon={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LeftArrowBlue width={32} height={32} />
          </TouchableOpacity>
        }
        />

        <View style={styles.authRequiredContainer}>
          <View style={styles.authIcon}>
            <Text style={styles.authIconText}>🔒</Text>
          </View>
          <Text style={styles.authTitle}>강사 인증이 필요합니다</Text>
          <Text style={styles.authDescription}>
            수업을 개설하려면 먼저 강사 인증을 완료해야 합니다.
          </Text>
          <TouchableOpacity 
            style={styles.authButton} 
            onPress={() => navigation.navigate(SCREENS.INSTRUCTOR_VERIFY)}
          >
            <Text style={styles.authButtonText}>강사 인증하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 강사 인증된 경우 - 기존 수업 개설 폼 표시
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      

      <Header
      title="수업 개설"
      showLogo={true}
      customIcon={
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrowBlue width={32} height={32} />
        </TouchableOpacity>
      }
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 폼 필드들 */}
        <View style={styles.formContainer}>
          {/* 아이디 필드 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>아이디</Text>
            <TextInput
              style={styles.inputField}
              value={user?.id || ''}
              onChangeText={() => {}}
              placeholder="아이디"
              placeholderTextColor="#999"
              editable={false}
            />
          </View>

          {/* 종목 필드 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>종목</Text>
            <TouchableOpacity
              style={styles.sportSelector}
              onPress={() => setShowSportModal(true)}
            >
              <Text style={sport ? styles.sportSelectorText : styles.sportSelectorPlaceholder}>
                {sport || '종목을 선택해주세요'}
              </Text>
              <Text style={styles.sportSelectorArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* 수업명 필드 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>수업명</Text>
            <TextInput
              style={styles.inputField}
              value={title}
              onChangeText={setTitle}
              placeholder="레슨명"
              placeholderTextColor="#999"
            />
          </View>

          {/* 수업 설명 필드 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>수업 설명</Text>
            <TextInput
              style={[styles.inputField, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="수업 대상·목표·진행(시간/강도)·준비물등 간단한 수업 설명을 작성해주세요."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* 수업 난이도 필드 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>수업 난이도</Text>
            <View style={styles.levelContainer}>
              <DifficultyLevel 
                level={level} 
                size={35} 
                color="#5981FA" 
                onLevelPress={(selectedLevel) => setLevel(selectedLevel)}
              />
            </View>
          </View>

          {/* 장소 필드 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>장소</Text>
            <TextInput
              style={styles.inputField}
              value={location}
              onChangeText={setLocation}
              placeholder="장소"
              placeholderTextColor="#999"
            />
          </View>

          {/* 수업 날짜 필드 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>수업 날짜</Text>
            <View style={styles.dateOptionsContainer}>
              <TouchableOpacity
                style={[
                  styles.dateOption,
                  weeklyOption === 'weekly' && styles.dateOptionActive
                ]}
                onPress={() => setWeeklyOption('weekly')}
              >
                <Text style={[
                  styles.dateOptionText,
                  weeklyOption === 'weekly' && styles.dateOptionTextActive
                ]}>
                  매주
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.dateOption,
                  weeklyOption === 'biweekly' && styles.dateOptionActive
                ]}
                onPress={() => setWeeklyOption('biweekly')}
              >
                <Text style={[
                  styles.dateOptionText,
                  weeklyOption === 'biweekly' && styles.dateOptionTextActive
                ]}>
                  격주
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.daysContainer}>
              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.dayButtonActive
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    selectedDays.includes(day) && styles.dayButtonTextActive
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 수업 시간 필드 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>수업 시간</Text>
            <TextInput
              style={styles.inputField}
              value={time}
              onChangeText={setTime}
              placeholder="14:00"
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={styles.helpContainer}>
        <Text style={styles.helpText}>
          도움이 필요하신가요?
        </Text>
      </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.bottomButton} onPress={goNext}>
          <Text style={styles.bottomButtonText}>수업 개설하기</Text>
        </TouchableOpacity>
      </View>

      {/* 종목 선택 모달 */}
      <Modal
        visible={showSportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>종목 선택</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowSportModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.sportListContainer} showsVerticalScrollIndicator={false}>
              {Object.entries(sportCategories).map(([category, sports]) => (
                <View key={category} style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={styles.sportsGrid}>
                    {sports.map((sportName) => (
                      <TouchableOpacity
                        key={sportName}
                        style={[
                          styles.sportItem,
                          sport === sportName && styles.sportItemSelected
                        ]}
                        onPress={() => {
                          setSport(sportName);
                          setShowSportModal(false);
                        }}
                      >
                        <Text style={[
                          styles.sportItemText,
                          sport === sportName && styles.sportItemTextSelected
                        ]}>
                          {sportName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>


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
    
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 270,
    paddingTop: 40,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5981FA',
    marginBottom: 12,
  },
  inputField: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  levelContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  dateOptionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#5981FA',
    borderRadius: 20,
    backgroundColor: 'white',
  },
  dateOptionActive: {
    backgroundColor: '#5981FA',
    borderColor: '#5981FA',
  },
  dateOptionText: {
    fontSize: 14,
    color: '#333',
  },
  dateOptionTextActive: {
    color: 'white',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5981FA',
    borderRadius: 20,
    backgroundColor: 'white',
  },
  dayButtonActive: {
    backgroundColor: '#5981FA',
    borderColor: '#5981FA',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#333',
  },
  dayButtonTextActive: {
    color: 'white',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    fontSize: 18,
    color: '#007AFF',
  },
  authRequiredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  authIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  authIconText: {
    fontSize: 40,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  authDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  authButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  sportSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  sportSelectorText: {
    color: '#333',
    fontSize: 16,
  },
  sportSelectorPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  sportSelectorArrow: {
    fontSize: 16,
    color: '#999',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '70%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#999',
  },
  sportListContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5981FA',
    marginBottom: 10,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sportItem: {
    width: '48%', // 2개씩 배치
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  sportItemSelected: {
    borderColor: '#5981FA',
    borderWidth: 2,
  },
  sportItemText: {
    fontSize: 14,
    color: '#333',
  },
  sportItemTextSelected: {
    color: '#5981FA',
    fontWeight: 'bold',
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  bottomButton: {
    backgroundColor: '#5981FA',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    height: 50,
    marginBottom: 15,
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  helpText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 200,
  },
});

export default CreateLessonInfoScreen;


