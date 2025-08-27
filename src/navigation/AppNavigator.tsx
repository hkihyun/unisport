import React from 'react';
// NavigationContainer is now provided at the root (App.tsx)
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { BlurView } from 'expo-blur';
import { SCREENS } from '../constants/screens';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';
import { HomeIcon, CalendarDaysIcon, ListBulletIcon, UserIcon } from 'react-native-heroicons/solid';
import BottomTabBar from '../components/BottomTabBar';

// 실제 화면 컴포넌트들
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import ScheduleListScreen from '../screens/ScheduleListScreen';
import SportListScreen from '../screens/SportListScreen';
import LessonListScreen from '../screens/LessonListScreen';
import BookingDetailScreen from '../screens/BookingDetailScreen';
import BookingConfirmScreen from '../screens/BookingConfirmScreen';
import InstructorVerifyScreen from '../screens/InstructorVerifyScreen';
import CreateLessonInfoScreen from '../screens/CreateLessonInfoScreen';
import CreateLessonCompleteScreen from '../screens/CreateLessonCompleteScreen';

// 임시 화면 컴포넌트 (아직 만들지 않은 화면들용)
const TempScreen: React.FC<{ title: string }> = ({ title }) => (
  <View style={styles.screen}>
    <Text style={styles.text}>{title}</Text>
  </View>
);

// 스택 네비게이터 타입 정의
type RootStackParamList = {
  [SCREENS.LOGIN]: undefined;
  [SCREENS.REGISTER]: undefined;
  Home: undefined;
  Favorites: undefined;
  Bookings: undefined;
  Profile: undefined;
  [SCREENS.LESSON_DETAIL]: { lessonId: string };
  [SCREENS.INSTRUCTOR_PROFILE]: { instructorId: string };
  [SCREENS.CREATE_LESSON]: undefined;
  [SCREENS.EDIT_PROFILE]: undefined;
  [SCREENS.SETTINGS]: undefined;
  [SCREENS.PAYMENT]: undefined;
  [SCREENS.SCHEDULE_LIST]: { date: string };
  [SCREENS.SPORT_LIST]: undefined;
  [SCREENS.BOOKING_CONFIRM]: { type: 'book' | 'wish'; lessonId: string };
  [SCREENS.INSTRUCTOR_VERIFY]: undefined;
  [SCREENS.CREATE_LESSON_INFO]: undefined;
  [SCREENS.CREATE_LESSON_COMPLETE]: { title: string; date: string; time: string; place: string };
};

// 탭 네비게이터 타입 정의
type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Bookings: undefined;
  Profile: undefined;
};


// ✅ 커스텀 탭바 (BlurView 적용)
const CustomTabBar = (props: any) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      <BottomTabBar {...props} />
    </View>
  );
};

// 웹에서는 createStackNavigator, 모바일에서는 createNativeStackNavigator 사용
const Stack = Platform.OS === 'web' 
  ? createStackNavigator<RootStackParamList>()
  : createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 메인 탭 네비게이터
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2B308B',
        tabBarInactiveTintColor: '#608EC9',
        tabBarStyle: {
          height: 85,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '400',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomColor: COLORS.BORDER_LIGHT,
          shadowColor: COLORS.SHADOW,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
          elevation: 2,
        },
        headerTitleStyle: {
          color: COLORS.TEXT_PRIMARY,
          fontWeight: '700',
          fontSize: 18,
          letterSpacing: -0.3,
        },
        headerTintColor: COLORS.PRIMARY,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarLabel: '홈',
          tabBarIcon: ({ color }) => (
            <HomeIcon size={32} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingScreen}
        options={{
          title: '수업예약',
          tabBarLabel: '수업예약',
          tabBarIcon: ({ color }) => (
            <CalendarDaysIcon size={32} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={LessonListScreen}
        options={{
          title: '수업리스트',
          tabBarLabel: '수업리스트',
          tabBarIcon: ({ color }) => (
            <ListBulletIcon size={32} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '마이',
          tabBarLabel: '마이',
          tabBarIcon: ({ color }) => (
            <UserIcon size={32} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// 메인 앱 네비게이터
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, isJustLoggedIn } = useAuth();

  // 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} translucent={false} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { paddingTop: 0, backgroundColor: COLORS.WHITE },
          }}
          initialRouteName="Home" // 항상 홈화면으로 시작
        >
          {/** 메인 탭 네비게이터 (항상 접근 가능) */}
          <Stack.Screen
            name="Home"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          
          {/** 로그인과 회원가입 화면 (필요할 때만 접근) */}
          <Stack.Screen
            name={SCREENS.LOGIN}
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={SCREENS.REGISTER}
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          
          <Stack.Screen
            name={SCREENS.LESSON_DETAIL}
            component={BookingDetailScreen}
            options={{ title: '수업 상세' }}
          />
          <Stack.Screen
            name={SCREENS.INSTRUCTOR_PROFILE}
            component={() => <TempScreen title="강사 프로필" />}
            options={{ title: '강사 프로필' }}
          />
          <Stack.Screen
            name={SCREENS.CREATE_LESSON}
            component={() => <TempScreen title="수업 생성" />}
            options={{ title: '수업 생성' }}
          />
          <Stack.Screen
            name={SCREENS.EDIT_PROFILE}
            component={() => <TempScreen title="프로필 수정" />}
            options={{ title: '프로필 수정' }}
          />
          <Stack.Screen
            name={SCREENS.SETTINGS}
            component={() => <TempScreen title="설정" />}
            options={{ title: '설정' }}
          />
          <Stack.Screen
            name={SCREENS.PAYMENT}
            component={PaymentScreen}
            options={{ title: '구독 상태' }}
          />
          <Stack.Screen
            name={SCREENS.SCHEDULE_LIST}
            component={ScheduleListScreen}
            options={{ title: '수업예약' }}
          />
          <Stack.Screen
            name={SCREENS.SPORT_LIST}
            component={SportListScreen}
            options={{ title: '종목 선택' }}
          />
          <Stack.Screen
            name={SCREENS.BOOKING_CONFIRM}
            component={BookingConfirmScreen}
            options={{ title: '예약/관심 확인' }}
          />
          <Stack.Screen
            name={SCREENS.INSTRUCTOR_VERIFY}
            component={InstructorVerifyScreen}
            options={{ title: '강사 인증하기' }}
          />
          <Stack.Screen
            name={SCREENS.CREATE_LESSON_INFO}
            component={CreateLessonInfoScreen}
            options={{ title: '수업 개설하기' }}
          />
          <Stack.Screen
            name={SCREENS.CREATE_LESSON_COMPLETE}
            component={CreateLessonCompleteScreen}
            options={{ title: '수업 개설 완료' }}
          />
        </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    borderTopWidth: 0,
    elevation: 0,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  text: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
});

export default AppNavigator;
