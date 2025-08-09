import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SCREENS } from '../constants/screens';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';

// 실제 화면 컴포넌트들
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BookingScreen } from '../screens/BookingScreen';

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
  [SCREENS.SEARCH]: undefined;
  [SCREENS.BOOKINGS]: undefined;
  [SCREENS.PROFILE]: undefined;
  [SCREENS.LESSON_DETAIL]: { lessonId: string };
  [SCREENS.INSTRUCTOR_PROFILE]: { instructorId: string };
  [SCREENS.CREATE_LESSON]: undefined;
  [SCREENS.EDIT_PROFILE]: undefined;
  [SCREENS.SETTINGS]: undefined;
};

// 탭 네비게이터 타입 정의
type MainTabParamList = {
  [SCREENS.HOME]: undefined;
  [SCREENS.SEARCH]: undefined;
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
        tabBarInactiveTintColor: COLORS.GRAY_500,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopColor: COLORS.BORDER,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: COLORS.WHITE,
          borderBottomColor: COLORS.BORDER,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: COLORS.TEXT_PRIMARY,
          fontWeight: '600',
        },
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
        name={SCREENS.SEARCH}
        component={() => <TempScreen title="검색" />}
        options={{
          title: '수업 검색',
          tabBarLabel: '검색',
        }}
      />
      <Tab.Screen
        name={SCREENS.BOOKINGS}
        component={BookingScreen}
        options={{
          title: '내 예약',
          tabBarLabel: '예약',
        }}
      />
      <Tab.Screen
        name={SCREENS.PROFILE}
        component={ProfileScreen}
        options={{
          title: '프로필',
          tabBarLabel: '프로필',
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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.WHITE,
            borderBottomColor: COLORS.BORDER,
            borderBottomWidth: 1,
          },
          headerTitleStyle: {
            color: COLORS.TEXT_PRIMARY,
            fontWeight: '600',
          },
          headerTintColor: COLORS.PRIMARY,
        }}
      >
        {!isAuthenticated ? (
          // 인증되지 않은 사용자 - 로그인/회원가입 화면
          <>
            <Stack.Screen
              name={SCREENS.LOGIN}
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={SCREENS.REGISTER}
              component={() => <TempScreen title="회원가입" />}
              options={{ title: '회원가입' }}
            />
          </>
        ) : (
          // 인증된 사용자 - 메인 앱 화면
          <>
            <Stack.Screen
              name={SCREENS.HOME}
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={SCREENS.LESSON_DETAIL}
              component={() => <TempScreen title="수업 상세" />}
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
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
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
});

export default AppNavigator;
