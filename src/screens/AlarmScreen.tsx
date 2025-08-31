import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';

// 네비게이션 타입 정의
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// 알람 화면 컴포넌트
export const AlarmScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // 알람 데이터 (빈 배열로 초기화)
  const alarmData: Array<{
    id: number;
    message: string;
    date: string;
    isActive: boolean;
  }> = [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      

      <Header
        title="알람"
        showLogo={true}
        customIcon={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LeftArrowBlue width={32} height={32} />
          </TouchableOpacity>
        }
      />

      {/* 알람 목록 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.alarmList}>
          {alarmData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>알람이 없습니다</Text>
            </View>
          ) : (
            alarmData.map((item, index) => (
              <View key={item.id} style={styles.alarmItem}>
                <View style={styles.alarmIconContainer}>
                  <View style={[
                    styles.alarmIcon,
                    item.isActive ? styles.activeAlarmIcon : styles.inactiveAlarmIcon
                  ]} />
                </View>
                
                <View style={styles.alarmContent}>
                  <Text style={styles.alarmMessage}>{item.message}</Text>
                  <Text style={styles.alarmDate}>{item.date}</Text>
                </View>
                
                {index < alarmData.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* 하단 도움말 */}
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
    color: '#666666',
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
  
  // 알람 목록 스타일
  alarmList: {
    paddingTop: 20,
  },
  
  alarmItem: {
    marginBottom: 24,
  },
  
  alarmIconContainer: {
    marginBottom: 8,
  },
  
  alarmIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  activeAlarmIcon: {
    backgroundColor: '#5981FA',
  },
  
  inactiveAlarmIcon: {
    backgroundColor: '#B8C5F0',
  },
  
  alarmContent: {
    marginBottom: 16,
  },
  
  alarmMessage: {
    fontSize: 16,
    color: '#5981FA',
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  
  alarmDate: {
    fontSize: 14,
    color: '#666666',
  },
  
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
  },
  
  // 푸터 스타일
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  helpIcon: {
    fontSize: 18,
    color: '#5981FA',
    fontWeight: '600',
  },
  
  helpText: {
    fontSize: 16,
    color: '#5981FA',
    fontWeight: '600',
  },
  
  // 빈 상태 스타일
  emptyContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '400',
  },
});

export default AlarmScreen;
