// React와 React Native의 핵심 컴포넌트들을 가져옵니다
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, StatusBar, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// React Navigation의 타입 정의를 가져옵니다
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// 앱에서 사용하는 색상 상수들을 가져옵니다
import { COLORS } from '../constants/colors';
// 사용자 인증 상태를 관리하는 커스텀 훅을 가져옵니다
import { useAuth } from '../hooks/useAuth';
// 앱의 화면 이름들을 정의한 상수들을 가져옵니다
import { SCREENS } from '../constants/screens';
// 프로필 아이콘 컴포넌트를 가져옵니다
import { ProfileIcon } from '../../assets/icons/ProfileIcon';
import { InstructorService } from '../services/instructorService';

// 네비게이션 타입 정의
type RootStackParamList = {
  [SCREENS.LOGIN]: undefined;
  [SCREENS.REGISTER]: undefined;
  Home: undefined;
  [SCREENS.INSTRUCTOR_VERIFY]: undefined;
  [SCREENS.CREATE_LESSON_INFO]: undefined;
  [SCREENS.OPEN_LESSONS]: undefined;
  [SCREENS.PAYMENT]: undefined;
  [SCREENS.CUSTOMER_SERVICE]: undefined;
  [SCREENS.ATTENDANCE_CHECK]: undefined;
  [SCREENS.ALARM_SETTINGS]: undefined;
};

type RouteParams = {
  instructorVerified?: boolean;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ProfileScreen 컴포넌트: 사용자의 프로필 정보와 메뉴를 표시하는 메인 화면
export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  // useAuth 훅을 통해 사용자 인증 상태와 관련 함수들을 가져옵니다
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // 화면 크기 상태 관리
  const [screenDimensions, setScreenDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
  
  // 로그인 폼의 상태를 관리하는 state 변수들
  const [loginId, setLoginId] = useState(''); // 사용자 입력 아이디
  const [loginPassword, setLoginPassword] = useState(''); // 사용자 입력 비밀번호
  const [isInstructorVerified, setIsInstructorVerified] = useState(false); // 강사 인증 완료 여부

  // 화면 크기 변경 감지 (호환성 고려)
  useEffect(() => {
    // Dimensions.addEventListener가 지원되는지 확인
    if (Dimensions.addEventListener) {
      const subscription = Dimensions.addEventListener('change', ({ window }) => {
        setScreenDimensions({
          width: window.width,
          height: window.height,
        });
      });

      return () => subscription?.remove();
    } else {
      // 이전 버전 호환성을 위한 대안
      const handleDimensionsChange = () => {
        setScreenDimensions({
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        });
      };

      // 화면 회전 시 이벤트 리스너 추가
      const subscription = Dimensions.addEventListener?.('change', handleDimensionsChange);
      
      return () => {
        if (subscription?.remove) {
          subscription.remove();
        }
      };
    }
  }, []);

  // 디버깅을 위한 상태 출력
  useEffect(() => {
    console.log('🔍 ProfileScreen Debug Info:');
    console.log('📱 Screen Dimensions:', screenDimensions);
    console.log('🔐 Auth Status:', { isAuthenticated, user });
    console.log('📋 Instructor Verified:', isInstructorVerified);
  }, [screenDimensions, isAuthenticated, user, isInstructorVerified]);

  // 강사 인증 완료 상태를 받아서 업데이트하는 useEffect
  // 다른 화면에서 강사 인증이 완료되면 이 화면으로 돌아올 때 상태를 업데이트합니다
  React.useEffect(() => {
    const params = route.params as RouteParams;
    if (params?.instructorVerified) {
      console.log('🎉 강사 인증 완료 감지!');
      setIsInstructorVerified(true); // 강사 인증 완료 상태로 설정
      // 탭 네비게이션에서는 setParams가 작동하지 않으므로 제거
    }
  }, [route?.params]);

  // 강사 인증 상태를 AsyncStorage와 서버에서 확인
  useEffect(() => {
    const checkInstructorVerificationStatus = async () => {
      try {
        // 1. AsyncStorage에서 확인 (기존 강사 인증 기록)
        const instructorVerified = await AsyncStorage.getItem('instructorVerified');
        console.log('🔍 AsyncStorage 강사 인증 상태 확인:', instructorVerified);
        
        if (instructorVerified === 'true') {
          console.log('🎉 AsyncStorage에서 강사 인증 완료 상태 확인!');
          setIsInstructorVerified(true);
          return;
        }
        
        // 2. AsyncStorage에 없으면 서버에서 확인
        if (isAuthenticated && user?.id) {
          console.log('🔄 서버에서 강사 인증 상태 확인 시도');
          const response = await InstructorService.checkUserInstructorStatus(parseInt(user.id));
          
          if (response.success && response.isInstructor) {
            console.log('🎉 서버에서 강사 인증 완료 상태 확인!');
            setIsInstructorVerified(true);
            // AsyncStorage에도 저장
            await AsyncStorage.setItem('instructorVerified', 'true');
          } else {
            console.log('⚠️ 서버에서 강사 인증 미완료 상태 확인');
            setIsInstructorVerified(false);
          }
        }
      } catch (error) {
        console.error('강사 인증 상태 확인 중 오류:', error);
        setIsInstructorVerified(false);
      }
    };

    checkInstructorVerificationStatus();
  }, [isAuthenticated, user]);

  // 화면이 포커스될 때마다 강사 인증 상태 재확인
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 ProfileScreen 포커스 - 강사 인증 상태 재확인');
      const checkStatus = async () => {
        try {
          const instructorVerified = await AsyncStorage.getItem('instructorVerified');
          console.log('🔄 포커스 시 AsyncStorage 상태:', instructorVerified);
          if (instructorVerified === 'true') {
            setIsInstructorVerified(true);
          }
        } catch (error) {
          console.error('포커스 시 상태 확인 오류:', error);
        }
      };
      checkStatus();
    });

    return unsubscribe;
  }, [navigation]);

  // 인증 상태 변경 감지
  React.useEffect(() => {
    if (!isAuthenticated) {
      // 로그아웃 상태일 때 강사 인증 상태도 초기화
      setIsInstructorVerified(false);
    }
  }, [isAuthenticated]);



  // 로그인 처리 함수
  const handleLogin = async () => {
    // 입력값 검증: 아이디와 비밀번호가 모두 입력되었는지 확인
    if (!loginId || !loginPassword) {
      Alert.alert('오류', '아이디와 비밀번호를 입력해주세요.');
      return;
    }
    
    // login 함수를 호출하여 실제 로그인 시도
    const ok = await login({ loginId: loginId, password: loginPassword });
    
    // 로그인 실패 시 사용자에게 알림
    if (!ok) {
      Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
    }
  };

    // 로그아웃 처리 함수
  const handleLogout = () => {
    // 사용자에게 로그아웃 확인을 묻는 Alert 표시
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' }, // 취소 버튼
        { 
          text: '로그아웃', 
          style: 'destructive', // 빨간색으로 표시하여 위험한 액션임을 나타냄
          onPress: async () => {
            try {
              await logout(); // 실제 로그아웃 처리
              setIsInstructorVerified(false); // 강사 인증 상태도 초기화
              
              // AsyncStorage의 강사 인증 상태도 초기화
              try {
                await AsyncStorage.removeItem('instructorVerified');
                console.log('✅ AsyncStorage 강사 인증 상태 초기화 완료');
              } catch (error) {
                console.error('AsyncStorage 초기화 중 오류:', error);
              }
              
              // 로그아웃 후 네비게이션 상태를 초기화하여 홈 화면으로 이동
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            } catch (error) {
              console.error('로그아웃 중 오류 발생:', error);
              Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
            }
          }
         },
      ]
    );
  };

  // 강사 인증 화면으로 이동하는 함수
  const handleInstructorVerification = () => {
    // 로그인하지 않은 상태에서는 로그인 안내
    if (!isAuthenticated) {
      Alert.alert('로그인 필요', '강사 인증을 받으려면 먼저 로그인해주세요.');
      return;
    }
    navigation.navigate(SCREENS.INSTRUCTOR_VERIFY);
  };

  // 수업 개설 화면으로 이동하는 함수
  const handleCreateLesson = () => {
    console.log('🔍 수업 개설하기 버튼 클릭');
    console.log('🔐 인증 상태:', isAuthenticated);
    console.log('📋 강사 인증 상태:', isInstructorVerified);
    
    // 로그인하지 않은 상태에서는 로그인 안내
    if (!isAuthenticated) {
      console.log('❌ 로그인 필요');
      Alert.alert('로그인 필요', '수업을 개설하려면 먼저 로그인해주세요.');
      return;
    }
    
    // 강사 인증이 완료되지 않았으면 경고 메시지 표시
    if (!isInstructorVerified) {
      console.log('❌ 강사 인증 필요');
      Alert.alert('강사 인증 필요', '수업을 개설하려면 먼저 강사 인증을 완료해주세요.');
      return;
    }
    
    // 강사 인증이 완료되었으면 수업 개설 화면으로 이동
    console.log('✅ 강사 인증 완료 - 수업 개설 화면으로 이동');
    navigation.navigate(SCREENS.CREATE_LESSON_INFO);
  };

  // 정보 수정 기능 (현재는 미구현 상태)
  const handleEditInfo = () => {
    Alert.alert('정보수정', '정보수정 기능은 추후 구현 예정입니다.');
  };

  // 메뉴 아이템들을 렌더링하는 공통 함수
  // 로그인/비로그인 상태 모두에서 사용하여 코드 중복을 방지합니다
  const renderMenuItems = () => (
    <View style={styles.menuContainer}>
      {/* 첫 번째 메뉴 그룹: 강사 관련 기능들 */}
      <View style={styles.firstMenuGroup}>
        {/* 강사 인증하기 메뉴 */}
        <TouchableOpacity style={styles.menuItem} onPress={handleInstructorVerification}>
          <View style={styles.menuIcon}>
            <Image source={require('../../assets/icons/Certification.png')} style={styles.menuIconImage} />
          </View>
          <Text style={styles.menuText}>강사 인증하기</Text>
          <Text style={styles.menuArrow}>{'›'}</Text> {/* 오른쪽 화살표 */}
        </TouchableOpacity>
        
                 {/* 수업 개설하기 메뉴 - 강사 인증 완료 시 활성화됨 */}
         <TouchableOpacity 
           style={styles.menuItem} 
           onPress={handleCreateLesson}
         >
           <View style={styles.menuIcon}>
             <Image source={require('../../assets/icons/MakeClass.png')} style={styles.menuIconImage} />
           </View>
           <Text style={styles.menuText}>
             수업 개설하기 {isInstructorVerified ? '(인증완료)' : '(인증필요)'}
           </Text>
           <Text style={styles.menuArrow}>{'›'}
           </Text>
         </TouchableOpacity>
        

        
                 {/* 개설 수업 관리 메뉴 */}
         <TouchableOpacity 
           style={styles.menuItem} 
           onPress={() => {
             if (!isAuthenticated) {
               Alert.alert('로그인 필요', '개설 수업을 관리하려면 먼저 로그인해주세요.');
               return;
             }
             if (!isInstructorVerified) {
               Alert.alert('강사 인증 필요', '개설 수업을 관리하려면 먼저 강사 인증을 완료해주세요.');
               return;
             }
             navigation.navigate(SCREENS.OPEN_LESSONS);
           }}
         >
           <View style={styles.menuIcon}>
             <Image source={require('../../assets/icons/ClassMade.png')} style={styles.menuIconImage} />
           </View>
           <Text style={styles.menuText}>
             개설 수업 {isInstructorVerified ? '(인증완료)' : '(인증필요)'}
           </Text>
           <Text style={styles.menuArrow}>{'›'}</Text>
         </TouchableOpacity>
      </View>

      {/* 두 번째 메뉴 그룹: 일반 사용자 기능들 */}
      <View style={styles.secondMenuGroup}>
        {/* 출석확인 메뉴 */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate(SCREENS.ATTENDANCE_CHECK)}
        >
          <View style={styles.menuIcon}>
            <Image source={require('../../assets/icons/CheckAttendance.png')} style={styles.menuIconImage} />
          </View>
          <Text style={styles.menuText}>출석확인</Text>
          <Text style={styles.menuArrow}>{'›'}</Text>
        </TouchableOpacity>
        
                 {/* UniSportsCard 구독 메뉴 */}
         <TouchableOpacity 
           style={styles.menuItem} 
           onPress={() => {
             if (!isAuthenticated) {
               Alert.alert('로그인 필요', 'UniSportsCard를 구독하려면 먼저 로그인해주세요.');
               return;
             }
             navigation.navigate(SCREENS.PAYMENT);
           }}
         >
           <View style={styles.menuIcon}>
             <Image source={require('../../assets/icons/Subscribe.png')} style={styles.menuIconImage} />
           </View>
           <Text style={styles.menuText}>UniSportsCard 구독</Text>
           <Text style={styles.menuArrow}>{'›'}</Text>
         </TouchableOpacity>
      </View>

      {/* 세 번째 메뉴 그룹: 설정 및 고객지원 */}
      <View style={styles.thirdMenuGroup}>
                         {/* 설정 메뉴 */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate(SCREENS.ALARM_SETTINGS)}
        >
           <View style={styles.menuIcon}>
             <Image source={require('../../assets/icons/Setting.png')} style={styles.menuIconImage} />
           </View>
           <Text style={styles.menuText}>설정</Text>
           <Text style={styles.menuArrow}>{'›'}</Text>
         </TouchableOpacity>
        
                                   {/* 고객센터 메뉴 */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate(SCREENS.CUSTOMER_SERVICE)}>
            <View style={styles.menuIcon}>
              <Image source={require('../../assets/icons/ForCustomer.png')} style={styles.menuIconImage} />
            </View>
            <Text style={styles.menuText}>고객센터</Text>
            <Text style={styles.menuArrow}>{'›'}</Text>
          </TouchableOpacity>
      </View>

      {/* 로그아웃 버튼 - 로그인 상태일 때만 표시 */}
      {isAuthenticated === true ? (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  // 스타일 정의 - 컴포넌트 내부에서 screenDimensions에 접근
  const styles = StyleSheet.create({
    // 전체 컨테이너 스타일
    container: {
      flex: 1, // 전체 화면을 차지
      backgroundColor: '#FFFFFF', // 흰색 배경
    },
    
    // 파란색 원형 헤더 배경 스타일
    blueHeader: {
      position: 'absolute',
      width: screenDimensions.width * 1.6,   // 화면 너비의 1.2배로 조정 (너무 크지 않게)
      height: screenDimensions.width * 1.6,  // 화면 높이의 1.2배로 조정
      left: '50%',
      top: 50, // 위쪽 걸침 정도 줄임
      transform: [
        { translateX: -(screenDimensions.width * 1.6) / 2 },   // 가로 중앙 정렬
        { translateY: -(screenDimensions.width * 1.6) / 2 },   // 위쪽 걸침 정도 조정
      ],
      backgroundColor: '#5981FA',
      borderRadius: (screenDimensions.width * 1.6) / 2,        // 반지름 조정
      zIndex: 1, // 다른 요소들보다 뒤에 배치하되 너무 뒤에 두지 않음
    },
    

    // 헤더 제목 "마이" 스타일
    headerTitle: {
      position: 'absolute', // 절대 위치로 배치 (이게 없으면 left, top이 작동하지 않음)
      left: 23, // 왼쪽에서 23px 떨어진 위치
      top: 75, // 위쪽에서 69px 떨어진 위치
      color: '#FEFEFE', // 검은색 텍스트 (파란색 배경 위에서 잘 보이도록)
      fontSize: 20, // 20px 폰트 크기
      fontWeight: '600', // 세미볼드 폰트 굵기
      zIndex: 10, // 파란색 배경보다 훨씬 앞에 배치
      fontFamily: 'Normal',
    },
    
    // "마이" 제목 아래 선 스타일
    headerUnderline: {
      position: 'absolute',
      left: 0, // 왼쪽 끝까지
      right: 0, // 오른쪽 끝까지
      top: 110, // "마이" 제목 아래 위치
      height: 1.5, // 선 두께 (2에서 1로 줄임)
      backgroundColor: '#FEFEFE', // 흰색 선
      zIndex: 10,
    },
    
    // 프로필 아이콘 컨테이너 스타일
    profileIconContainer: {
      position: 'absolute', // 절대 위치로 배치
      width: 105, // 105px 너비
      height: 105, // 105px 높이
      left: screenDimensions.width / 2 - 52.5, // 화면 중앙에서 52.5px 왼쪽 (105px 너비의 절반)
      top: 120, // 위쪽에서 120px 떨어진 위치
      zIndex: 10, // 파란색 배경보다 훨씬 앞에 배치
    },
    
    // 로그인/회원가입 버튼 스타일
    loginSignupButton: {
      position: 'absolute', // 절대 위치로 배치
      left: screenDimensions.width / 2 - 80, // 화면 중앙에서 80px 왼쪽 (160px 너비의 절반)
      top: 226, // 위쪽에서 250px 떨어진 위치
      paddingHorizontal: 20, // 좌우 패딩
      paddingVertical: 10, // 상하 패딩
      zIndex: 10, // 파란색 배경보다 훨씬 앞에 배치
      width: 160, // 버튼 너비
      alignItems: 'center', // 텍스트 중앙 정렬
    },
    
    // 로그인/회원가입 버튼 텍스트 스타일
    loginSignupButtonText: {
      color: '#FEFEFE', // 흰색 텍스트
      fontSize: 18, // 18px 폰트 크기
      fontWeight: '600', // 세미볼드 폰트 굵기
      textAlign: 'center', // 텍스트 중앙 정렬
    },
    
    // ID/비밀번호 찾기 안내 텍스트 스타일
    forgotText: {
      position: 'absolute', // 절대 위치로 배치
      left: screenDimensions.width / 2 - 80, // 화면 중앙에서 80px 왼쪽 (텍스트 길이 고려)
      top: 260, // 위쪽에서 273px 떨어진 위치
      color: '#AEC7EB', // 연한 파란색 텍스트
      fontSize: 12, // 12px 폰트 크기
      fontWeight: '400', // 일반 폰트 굵기
      zIndex: 10, // 파란색 배경보다 훨씬 앞에 배치
      textAlign: 'center', // 텍스트 중앙 정렬
      width: 160, // 텍스트 너비 지정
    },
    
    // 사용자 ID 텍스트 스타일 (로그인 상태)
    userId: {
      textAlign: 'center',
      fontSize: 18, // 18px 폰트 크기
      fontWeight: '600', // 세미볼드 폰트 굵기
      color: 'white', // 흰색 텍스트
      marginBottom: 5, // 아래쪽 여백
      top: -30,
    },
    
    // 대학교명 텍스트 스타일 (로그인 상태)
    universityName: {
      fontSize: 16, // 16px 폰트 크기
      color: 'white', // 흰색 텍스트
      marginBottom: 5, // 아래쪽 여백
      textAlign: 'center',
      top: -30,
    },
    
    // 학번 텍스트 스타일 (로그인 상태)
    studentId: {
      fontSize: 14, // 14px 폰트 크기
      color: 'white', // 흰색 텍스트
      marginBottom: 15, // 아래쪽 여백
      textAlign: 'center',
      top: -30,
    },
    
    // 정보수정 버튼 스타일 (로그인 상태)
    editInfoButton: {
      borderWidth: 1, // 1px 테두리 두께
      borderColor: '#AEC7EB', // 흰색 테두리
      borderRadius: 0, // 20px 반지름으로 모서리 둥글게
      paddingHorizontal: 5, // 좌우 20px 패딩
      paddingVertical: 3, // 상하 8px 패딩
      alignSelf: 'flex-start', // 왼쪽 정렬
      top: -30,
      left: 133,
      alignItems: 'center',
    },
    
    // 정보수정 버튼 텍스트 스타일
    editInfoButtonText: {
      color: 'white', // 흰색 텍스트
      fontSize: 10, // 14px 폰트 크기
      fontWeight: '500', // 미디엄 폰트 굵기
    },
    
    // 메뉴 컨테이너 스타일
    menuContainer: {
      position: 'relative', // ScrollView 내부에서 상대적 위치로 설정
      width: '100%', // 전체 너비 사용
      zIndex: 20, // 파란색 배경보다 훨씬 앞에 배치
      paddingVertical: 0
    },
    
    // 첫 번째 메뉴 그룹 스타일 (강사 관련 기능들)
    firstMenuGroup: {
      borderRadius: 20, // 20px 반지름으로 모서리 둥글게
      backgroundColor: '#EDF2F8', // 연한 파란색 배경
      padding: 16, // 16px 패딩
      marginBottom: 12, // 아래쪽에 12px 여백
      paddingVertical: 0,
      paddingBottom: 0,
    },
    
    // 두 번째 메뉴 그룹 스타일 (일반 사용자 기능들)
    secondMenuGroup: {
      borderRadius: 20, // 20px 반지름으로 모서리 둥글게
      backgroundColor: '#EDF2F8', // 연한 파란색 배경
      padding: 16, // 16px 패딩
      paddingVertical: 0,
      paddingBottom: 0,
      marginTop: 10,
      marginBottom: 10, // 아래쪽에 12px 여백
    },
    
    // 세 번째 메뉴 그룹 스타일 (설정 및 고객지원)
    thirdMenuGroup: {
      borderRadius: 20, // 20px 반지름으로 모서리 둥글게
      backgroundColor: '#EDF2F8', // 연한 파란색 배경
      padding: 16, // 16px 패딩
      paddingVertical: 0,
      marginTop: 10,
      marginBottom: 12, // 아래쪽에 12px 여백
    },
    
    // 개별 메뉴 아이템 스타일
    menuItem: {
      flexDirection: 'row', // 가로 방향으로 요소들을 배치
      alignItems: 'center', // 세로 중앙 정렬
      paddingVertical: 0, // 상하 16px 패딩
      marginBottom: 10, // 아래쪽에 8px 여백
      marginTop: 10, // 위쪽에 8px 여백
      width: '100%', // 전체 너비 사용
    },
    
    // 메뉴 아이콘 컨테이너 스타일
    menuIcon: {
      width: 28, // 28px 너비
      height: 28, // 28px 높이
      justifyContent: 'center', // 세로 중앙 정렬
      alignItems: 'center', // 가로 중앙 정렬
      marginRight: 16, // 오른쪽에 16px 여백
    },
    
    // 메뉴 아이콘 텍스트 스타일 (이모지)
    menuIconText: {
      fontSize: 20, // 20px 폰트 크기
    },
    
    // 메뉴 아이콘 이미지 스타일
    menuIconImage: {
      width: 20, // 20px 너비
      height: 20, // 20px 높이
    },
    
    // 메뉴 텍스트 스타일
    menuText: {
      flex: 1, // 남은 공간을 모두 차지
      fontSize: 17, // 18px 폰트 크기
      fontWeight: '700', // 세미볼드 폰트 굵기
      color: '#2B308B', // 진한 파란색 텍스트
    },
    
    // 메뉴 화살표 스타일
    menuArrow: {
      fontSize: 18, // 18px 폰트 크기
      color: '#AEABAB', // 회색 텍스트
      fontWeight: '300', // 라이트 폰트 굵기
    },
    
    // 로그아웃 버튼 스타일
    logoutButton: {
      backgroundColor: '#5981FA', // 빨간색 배경 (위험한 액션을 나타냄)
      paddingVertical: 16, // 상하 16px 패딩
      borderRadius: 16, // 16px 반지름으로 모서리 둥글게
      alignItems: 'center', // 가로 중앙 정렬
      marginTop: 50, // 위쪽에 20px 여백
      shadowColor: '#000', // 그림자 색상
      shadowOffset: {
        width: 0, // 가로 그림자 오프셋
        height: 2, // 세로 그림자 오프셋
      },
      shadowOpacity: 0.1, // 그림자 투명도
      shadowRadius: 3.84, // 그림자 블러 반지름
      elevation: 5, // Android 그림자 효과
    },
    
    // 로그아웃 버튼 텍스트 스타일
    logoutButtonText: {
      color: 'white', // 흰색 텍스트
      fontSize: 16, // 16px 폰트 크기
      fontWeight: '600', // 세미볼드 폰트 굵기
    },
    
    // 활성화된 메뉴 아이템 스타일 (강사 인증 완료 시)
    menuItemActive: {
      backgroundColor: '#E3F2FD', // 연한 파란색 배경
      borderColor: '#007AFF', // 파란색 테두리
      borderWidth: 2, // 2px 테두리 두께
      borderRadius: 12, // 12px 반지름으로 모서리 둥글게
    },
    
    // 활성화된 메뉴 아이콘 스타일
    menuIconActive: {
      backgroundColor: '#007AFF', // 파란색 배경
      borderRadius: 14, // 14px 반지름으로 모서리 둥글게
    },
    
    // 활성화된 메뉴 텍스트 스타일
    menuTextActive: {
      color: '#007AFF', // 파란색 텍스트
      fontWeight: '700', // 볼드 폰트 굵기
    },

    // 메뉴 아이템들을 ScrollView로 감싸서 스크롤 가능하게 만듦
    menuScrollView: {
      position: 'absolute', // 절대 위치로 배치
      top: 380, // 파란색 헤더 아래에 충분한 여백을 두고 배치
      left: 11, // 왼쪽에서 11px 떨어진 위치
      right: 11, // 오른쪽에서 11px 떨어진 위치
      bottom: 30, // 하단 네비게이션바 높이만큼 여백 추가 (기존 20에서 100으로 증가)
      zIndex: 10, // 파란색 배경보다 훨씬 앞에 배치
      paddingVertical: 0,
    },

    // ScrollView의 내용 컨테이너 스타일
    menuScrollContent: {
      paddingBottom: 100, // 스크롤 가능한 영역의 하단에 충분한 여백 추가 (기존 40에서 120으로 증가)
      paddingTop: 10, // 상단에도 여백 추가
    },

    // 로그인 폼 컨테이너 스타일
    loginFormContainer: {
      position: 'absolute',
      top: 300, // 파란색 헤더 아래에 배치
      left: 20,
      right: 20,
      padding: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 10,
    },

    // 로그인 폼 입력 필드 스타일
    inputContainer: {
      marginBottom: 15,
    },

    // 로그인 폼 입력 라벨 스타일
    inputLabel: {
      fontSize: 14,
      color: '#333',
      marginBottom: 5,
    },

    // 로그인 폼 텍스트 입력 필드 스타일
    textInput: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontSize: 16,
      color: '#333',
    },

    // 로그인 폼 비밀번호 입력 필드 스타일
    passwordInput: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontSize: 16,
      color: '#333',
    },

    // 로그인 폼 비밀번호 보이기/숨기기 버튼 스타일
    showPasswordButton: {
      position: 'absolute',
      right: 15,
      top: 10,
      zIndex: 1,
    },

    // 로그인 폼 비밀번호 보이기/숨기기 아이콘 스타일
    showPasswordIcon: {
      fontSize: 20,
      color: '#999',
    },

    // 로그인 폼 비밀번호 찾기 링크 스타일
    forgotPasswordLink: {
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 15,
    },

    // 로그인 폼 비밀번호 찾기 텍스트 스타일
    forgotPasswordText: {
      fontSize: 14,
      color: '#AEC7EB',
      textDecorationLine: 'underline',
    },

    // 로그인 폼 로그인 버튼 스타일
    loginButton: {
      backgroundColor: '#5981FA',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 10,
    },

    // 로그인 폼 로그인 버튼 텍스트 스타일
    loginButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },

    // 로그인 폼 회원가입 버튼 스타일
    signupButton: {
      backgroundColor: '#E0E0E0',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },

    // 로그인 폼 회원가입 버튼 텍스트 스타일
    signupButtonText: {
      color: '#333',
      fontSize: 18,
      fontWeight: '600',
    },

    // 로그인 폼 도움말 링크 스타일
    helpLink: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 10,
    },

    // 로그인 폼 도움말 아이콘 스타일
    helpIcon: {
      fontSize: 18,
      color: '#999',
      marginRight: 5,
    },

    // 로그인 폼 도움말 텍스트 스타일
    helpText: {
      fontSize: 14,
      color: '#999',
    },

    // 사용자 정보 표시 영역 스타일
    userInfoContainer: {
      position: 'absolute',
      top: 240, // 로필 아이콘 아래에 배치
      left: 20,
      right: 20,
      padding: 20,
      backgroundColor: 'transparent', // 배경을 투명하게 설정
      borderRadius: 20,
      zIndex: 10,
    },
  });

  // 로그인하지 않은 상태의 UI 렌더링
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>  
        {/* 파란색 원형 헤더 섹션 - 배경으로 사용 */}
        <View style={styles.blueHeader} />
        
        {/* "마이" 제목 - 파란색 헤더 위에 표시 */}
        <Text style={styles.headerTitle}>마이</Text>
        {/* "마이" 제목 아래 선 */}
        <View style={styles.headerUnderline} />

        {/* 프로필 아이콘 컨테이너 - 파란색 헤더 중앙에 배치 */}
        <View style={styles.profileIconContainer}>
          <ProfileIcon width={105} height={105} fill="#5981FA" stroke="white" />
        </View>
        
        {/* 로그인/회원가입 버튼 - 파란색 헤더 안에 표시 */}
        <TouchableOpacity 
          style={styles.loginSignupButton} 
          onPress={() => {
            Alert.alert(
              '선택',
              '로그인 또는 회원가입을 선택해주세요.',
              [
                { text: '로그인', onPress: () => navigation.navigate(SCREENS.LOGIN) },
                { text: '회원가입', onPress: () => navigation.navigate(SCREENS.REGISTER) },
                { text: '취소', style: 'cancel' }
              ]
            );
          }}
        >
          <Text style={styles.loginSignupButtonText}>로그인/회원가입</Text>
        </TouchableOpacity>
        
        {/* ID/비밀번호 찾기 안내 텍스트 - 파란색 헤더 안에 표시 */}
        <Text style={styles.forgotText}>ID또는 암호를 잊으셨습니까?</Text>

        {/* 메뉴 아이템들을 ScrollView로 감싸서 스크롤 가능하게 만듦 */}
        <ScrollView 
          style={styles.menuScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuScrollContent}
        >
          {/* 메뉴 아이템들 */}
          {renderMenuItems()}
        </ScrollView>
      </View>
    );
  }

  // 로그인한 상태의 UI 렌더링
  return (
    <View style={styles.container}>
      
      {/* 파란색 원형 헤더 섹션 - 배경으로 사용 */}
      <View style={styles.blueHeader} />
      
      {/* "마이" 제목 - 파란색 헤더 위에 표시 */}
      <Text style={styles.headerTitle}>마이</Text>
      {/* "마이" 제목 아래 선 */}
      <View style={styles.headerUnderline} />
      
      {/* 프로필 아이콘 컨테이너 - 파란색 헤더 중앙에 배치 */}
      <View style={styles.profileIconContainer}>
        <ProfileIcon width={105} height={105} fill="#5981FA" stroke="white" />
      </View>
      
      {/* 사용자 정보 표시 영역 - 파란색 헤더 안에 배치 */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userId}>{user?.name || '사용자'}</Text>
        <Text style={styles.universityName}>{user?.university || '고려대학교'}</Text>
        <Text style={styles.studentId}>{user?.studentNumber || '2024220025'}</Text>
        
        {/* 정보수정 버튼 */}
        <TouchableOpacity style={styles.editInfoButton} onPress={handleEditInfo}>
          <Text style={styles.editInfoButtonText}>정보수정</Text>
        </TouchableOpacity>
      </View>

      {/* 메뉴 아이템들을 ScrollView로 감싸서 스크롤 가능하게 만듦 */}
      <ScrollView 
        style={styles.menuScrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuScrollContent}
      >
        {/* 메뉴 아이템들을 렌더링 */}
        {renderMenuItems()}
      </ScrollView>
    </View>
  );
};