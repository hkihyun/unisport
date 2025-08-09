import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { tempLogin } = useAuth();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    
    // TODO: 실제 로그인 로직 구현
    Alert.alert('성공', '로그인되었습니다!', [
      { text: '확인', onPress: () => tempLogin() }
    ]);
  };

  const handleRegister = () => {
    if (!email || !password || !name || !university) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }
    
    Alert.alert('회원가입 성공', '계정이 생성되었습니다!', [
      { text: '확인', onPress: () => setIsLoginMode(true) }
    ]);
  };

  const handleTempLogin = () => {
    tempLogin();
    Alert.alert('임시 로그인', '메인 화면으로 이동합니다!');
  };

  const socialLogins = [
    { id: 'kakao', name: '카카오', color: '#FEE500', textColor: '#000', icon: '💬' },
    { id: 'naver', name: '네이버', color: '#03C75A', textColor: '#fff', icon: 'N' },
    { id: 'google', name: '구글', color: '#fff', textColor: '#000', icon: 'G' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* 헤더 */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🏃‍♂️</Text>
              <Text style={styles.title}>UniSportCard</Text>
            </View>

          </View>

          {/* 탭 선택 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, isLoginMode && styles.activeTab]}
              onPress={() => setIsLoginMode(true)}
            >
              <Text style={[styles.tabText, isLoginMode && styles.activeTabText]}>
                로그인
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLoginMode && styles.activeTab]}
              onPress={() => setIsLoginMode(false)}
            >
              <Text style={[styles.tabText, !isLoginMode && styles.activeTabText]}>
                회원가입
              </Text>
            </TouchableOpacity>
          </View>

          {/* 폼 */}
          <View style={styles.form}>
            {!isLoginMode && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>이름</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="실명을 입력하세요"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>대학교</Text>
                  <TextInput
                    style={styles.input}
                    value={university}
                    onChangeText={setUniversity}
                    placeholder="소속 대학교를 입력하세요"
                  />
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="이메일을 입력하세요"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="비밀번호를 입력하세요"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.passwordToggleText}>
                    {showPassword ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {isLoginMode && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.mainButton}
              onPress={isLoginMode ? handleLogin : handleRegister}
            >
              <Text style={styles.mainButtonText}>
                {isLoginMode ? '로그인' : '회원가입'}
              </Text>
            </TouchableOpacity>

            {isLoginMode && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>또는</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialContainer}>
                  {socialLogins.map((social) => (
                    <TouchableOpacity
                      key={social.id}
                      style={[styles.socialButton, { backgroundColor: social.color }]}
                    >
                      <Text style={[styles.socialIcon, { color: social.textColor }]}>
                        {social.icon}
                      </Text>
                      <Text style={[styles.socialText, { color: social.textColor }]}>
                        {social.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity style={styles.tempLoginButton} onPress={handleTempLogin}>
              <Text style={styles.tempLoginButtonText}>개발용 로그인</Text>
            </TouchableOpacity>

            {!isLoginMode && (
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  가입시 <Text style={styles.termsLink}>이용약관</Text>과{' '}
                  <Text style={styles.termsLink}>개인정보처리방침</Text>에 동의하는 것으로 간주됩니다.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoIcon: {
    fontSize: 32,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.GRAY_100,
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: COLORS.WHITE,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_SECONDARY,
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: COLORS.WHITE,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  passwordToggleText: {
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
  },
  mainButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  mainButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  dividerText: {
    marginHorizontal: 15,
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
  socialContainer: {
    gap: 10,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  socialIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  socialText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tempLoginButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  tempLoginButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
});
