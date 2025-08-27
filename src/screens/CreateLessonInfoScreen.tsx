import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native';
import { COLORS } from '../constants/colors';
import { SCREENS } from '../constants/screens';
import { LessonService } from '../services/lessonService';
import { CreateLessonRequest } from '../types';

export const CreateLessonInfoScreen: React.FC<any> = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [sport, setSport] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState(2);
  const [location, setLocation] = useState('');
  const [weeklyOption, setWeeklyOption] = useState<'weekly' | 'biweekly'>('weekly');
  const [selectedDays, setSelectedDays] = useState<string[]>(['월', '화', '수', '목', '금', '토', '일']);
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = ['월', '화', '수', '목', '금', '토', '일'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const goNext = async () => {
    if (!userId || !sport || !title || !description || !location || !time) {
      Alert.alert('입력 필요', '모든 필수 정보를 입력해 주세요.');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('입력 필요', '수업 요일을 선택해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const lessonData: CreateLessonRequest = {
        sport,
        title,
        description,
        level,
        location,
        instructorUserId: parseInt(userId) || 1,
        lessonDate: selectedDays.join(','),
        lessonTime: time
      };

      const response = await LessonService.createLessonBackend(lessonData);
      
      if (response.success && response.data) {
        navigation.navigate(SCREENS.CREATE_LESSON_COMPLETE, { 
          title, 
          date: selectedDays.join(', '), 
          time, 
          place: location,
          lessonId: response.data.id 
        });
      } else {
        Alert.alert('오류', response.error || '레슨 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('레슨 생성 오류:', error);
      Alert.alert('오류', '레슨 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>수업 개설</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 폼 필드들 */}
        <View style={styles.formContainer}>
          {/* 아이디 필드 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>아이디</Text>
            <TextInput
              style={styles.inputField}
              value={userId}
              onChangeText={setUserId}
              placeholder="아이디"
              placeholderTextColor="#999"
            />
          </View>

          {/* 종목 필드 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>종목</Text>
            <TextInput
              style={styles.inputField}
              value={sport}
              onChangeText={setSport}
              placeholder="종목"
              placeholderTextColor="#999"
            />
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
              {[1, 2, 3, 4, 5].map((levelItem) => (
                <TouchableOpacity
                  key={levelItem}
                  style={[
                    styles.levelButton,
                    level >= levelItem && styles.levelButtonActive
                  ]}
                  onPress={() => setLevel(levelItem)}
                >
                  <Text style={[
                    styles.levelButtonText,
                    level >= levelItem && styles.levelButtonTextActive
                  ]}>
                    ▲
                  </Text>
                </TouchableOpacity>
              ))}
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
              placeholder="예:) 14:00 - 15:00"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </ScrollView>

      {/* 하단 도움말 */}
      <View style={styles.bottomHelp}>
        <View style={styles.helpIcon}>
          <Text style={styles.helpIconText}>?</Text>
        </View>
        <Text style={styles.helpText}>도움이 필요 하신가요?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
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
  },
  levelButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
  },
  levelButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  levelButtonText: {
    fontSize: 16,
    color: '#999',
  },
  levelButtonTextActive: {
    color: 'white',
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
    borderColor: '#E0E0E0',
    borderRadius: 20,
    backgroundColor: 'white',
  },
  dateOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
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
    borderColor: '#E0E0E0',
    borderRadius: 20,
    backgroundColor: 'white',
  },
  dayButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#333',
  },
  dayButtonTextActive: {
    color: 'white',
  },
  bottomHelp: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  helpIconText: {
    fontSize: 12,
    color: '#999',
  },
  helpText: {
    fontSize: 14,
    color: '#999',
  },
});

export default CreateLessonInfoScreen;


