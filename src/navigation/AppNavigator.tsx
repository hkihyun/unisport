import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SCREENS } from '../constants/screens';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';

// 실제 화면 컴포넌트들
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import ScheduleListScreen from '../screens/ScheduleListScreen';
import SportListScreen from '../screens/SportListScreen';
import SportLessonsScreen from '../screens/SportLessonsScreen';
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
  [SCREENS.HOME]: undefined;
  [SCREENS.FAVORITES]: undefined;
  [SCREENS.BOOKINGS]: undefined;
  [SCREENS.PROFILE]: undefined;
  [SCREENS.LESSON_DETAIL]: { lessonId: string };
  [SCREENS.INSTRUCTOR_PROFILE]: { instructorId: string };
  [SCREENS.CREATE_LESSON]: undefined;
  [SCREENS.EDIT_PROFILE]: undefined;
  [SCREENS.SETTINGS]: undefined;
  [SCREENS.PAYMENT]: undefined;
  [SCREENS.SCHEDULE_LIST]: { date: string };
  [SCREENS.SPORT_LIST]: undefined;
  [SCREENS.SPORT_LESSONS]: { sport: string; date?: string };
  [SCREENS.BOOKING_CONFIRM]: { type: 'book' | 'wish'; lessonId: string };
  [SCREENS.INSTRUCTOR_VERIFY]: undefined;
  [SCREENS.CREATE_LESSON_INFO]: undefined;
  [SCREENS.CREATE_LESSON_COMPLETE]: { title: string; date: string; time: string; place: string };
};

// 탭 네비게이터 타입 정의
type MainTabParamList = {
  [SCREENS.HOME]: undefined;
  [SCREENS.FAVORITES]: undefined;
  [SCREENS.BOOKINGS]: undefined;
  [SCREENS.PROFILE]: undefined;
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
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopColor: COLORS.BORDER_LIGHT,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
          shadowColor: COLORS.SHADOW,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: COLORS.WHITE,
          borderBottomColor: COLORS.BORDER_LIGHT,
          borderBottomWidth: 1,
          shadowColor: COLORS.SHADOW,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
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
    >
      <Tab.Screen
        name={SCREENS.HOME}
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen
        name={SCREENS.BOOKINGS}
        component={BookingScreen}
        options={{
          title: '수업예약',
          tabBarLabel: '수업예약',
        }}
      />
      <Tab.Screen
        name={SCREENS.FAVORITES}
        component={FavoritesScreen}
        options={{
          title: '내 수업',
          tabBarLabel: '내 수업',
        }}
      />
      <Tab.Screen
        name={SCREENS.PROFILE}
        component={({ navigation }: any) => <ProfileScreen navigation={navigation} />}
        options={{
          title: '마이',
          tabBarLabel: '마이',
        }}
      />
    </Tab.Navigator>
  );
};

// 메인 앱 네비게이터
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.WHITE,
              borderBottomColor: COLORS.BORDER_LIGHT,
              borderBottomWidth: 1,
              shadowColor: COLORS.SHADOW,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
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
        >
          {/** 로그인은 프로필 탭 내부에서 처리할 수 있도록, 인증 여부와 무관하게 메인 탭을 항상 루트로 표시 */}
          <Stack.Screen
            name={SCREENS.HOME}
            component={MainTabNavigator}
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
            name={SCREENS.SPORT_LESSONS}
            component={SportLessonsScreen}
            options={{ title: '수업 목록' }}
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
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
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
