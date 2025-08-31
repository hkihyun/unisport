import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';

// 네비게이션 타입 정의
type RootStackParamList = {
  Home: undefined;
};

type NavigationProp = NavigationProp<RootStackParamList>;

// 알람설정 화면 컴포넌트
export const AlarmSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(true);

  const toggleAlarm = () => {
    setIsAlarmEnabled(previousState => !previousState);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* 헤더 */}
      <Header
        title="알람설정"
        showLogo={true}
        customIcon={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LeftArrowBlue width={32} height={32} />
          </TouchableOpacity>
        }
      />

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.content}>
        {/* 알람 허용 섹션 */}
        <View style={styles.alarmSection}>
          <View style={styles.alarmHeader}>
            <Text style={styles.alarmTitle}>알람허용</Text>
            <Switch
              value={isAlarmEnabled}
              onValueChange={toggleAlarm}
              trackColor={{ false: '#E0E0E0', true: '#5981FA' }}
              thumbColor={isAlarmEnabled ? '#FFFFFF' : '#FFFFFF'}
              style={styles.alarmSwitch}
            />
          </View>
          <Text style={styles.alarmDescription}>
            수업 시작 전에 알람을 통해 미리 알려드려요.
          </Text>
        </View>
      </View>

      {/* 하단 도움말 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpIcon}>?</Text>
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
  
  // 헤더 구분선
  headerDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 20,
  },
  
  // 콘텐츠 스타일
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  
  // 알람 섹션
  alarmSection: {
    marginBottom: 20,
  },
  
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  alarmTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5981FA',
  },
  
  alarmSwitch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  
  alarmDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
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
});
