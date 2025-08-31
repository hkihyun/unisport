import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';

// 네비게이션 타입 정의
type RootStackParamList = {
  Home: undefined;
};

type NavigationProp = NavigationProp<RootStackParamList>;

// 출석확인 화면 컴포넌트
export const AttendanceCheckScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // 출석 데이터 (실제로는 API에서 가져올 데이터)
  const attendanceData = [
    {
      id: 1,
      title: '기초 요가',
      date: '8.2(토)',
      time: '오후14:30',
      location: '고려대학교 화정체육관',
      status: '출석'
    },
    {
      id: 2,
      title: '기초 요가',
      date: '8.9(토)',
      time: '오후14:30',
      location: '고려대학교 화정체육관',
      status: '결석'
    },
    {
      id: 3,
      title: '기초 요가',
      date: '8.16(토)',
      time: '오후14:30',
      location: '고려대학교 화정체육관',
      status: '출석'
    },
    {
      id: 4,
      title: '기초 요가',
      date: '8.23(토)',
      time: '오후14:30',
      location: '고려대학교 화정체육관',
      status: '출석'
    },
    {
      id: 5,
      title: '기초 요가',
      date: '8.30(토)',
      time: '오후14:30',
      location: '고려대학교 화정체육관',
      status: '출석'
    },
    {
      id: 6,
      title: '기초 요가',
      date: '9.6(토)',
      time: '오후14:30',
      location: '고려대학교 화정체육관',
      status: '출석'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* 헤더 */}
      <Header
        title="출석확인"
        showLogo={true}
        customIcon={
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <LeftArrowBlue width={32} height={32} />
            </TouchableOpacity>
        }
        iconSize={24}
      />
        

      {/* 출석 목록 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.attendanceList}>
          {attendanceData.map((item, index) => (
            <View key={item.id} style={styles.attendanceItem}>
              {/* 타임라인 점과 선 */}
              <View style={styles.timelineContainer}>
                <View style={styles.timelineDot} />
                {index < attendanceData.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>
              
              {/* 수업 정보 */}
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{item.title}</Text>
                <Text style={styles.lessonDateTime}>{item.date} {item.time}</Text>
                <Text style={styles.lessonLocation}>{item.location}</Text>
              </View>
              
              {/* 출석 상태 */}
              <View style={styles.attendanceStatus}>
                <Text style={[
                  styles.statusText,
                  item.status === '출석' ? styles.presentText : styles.absentText
                ]}>
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  headerTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  signalIcon: {
    width: 20,
    height: 12,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  
  wifiIcon: {
    width: 16,
    height: 12,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  
  batteryIcon: {
    width: 24,
    height: 12,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  backArrow: {
    fontSize: 24,
    color: '#5981FA',
    fontWeight: '600',
  },
  
  screenTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5981FA',
  },
  
  // 콘텐츠 스타일
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  attendanceList: {
    paddingTop: 20,
  },
  
  attendanceItem: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative',
  },
  
  // 타임라인 스타일
  timelineContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
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
  
  // 수업 정보 스타일
  lessonInfo: {
    flex: 1,
    marginRight: 16,
  },
  
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  
  lessonDateTime: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  
  lessonLocation: {
    fontSize: 14,
    color: '#666666',
  },
  
  // 출석 상태 스타일
  attendanceStatus: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    minWidth: 60,
  },
  
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  presentText: {
    color: '#5981FA',
  },
  
  absentText: {
    color: '#666666',
  },
});
