import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import { SCREENS } from '../constants/screens';
import { AuthService } from '../services/authService';

type LoginScreenProps = {
  navigation: StackNavigationProp<any>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async () => {
    if (!loginId || !loginPassword) {
      Alert.alert('오류', '아이디와 비밀번호를 입력해주세요.');
      return;
    }
    
    try {
      const response = await AuthService.login({ 
        loginId: loginId, 
        password: loginPassword 
      });
      
             if (response.success && response.data) {
         // 로그인 성공 시 사용자 정보 저장
         await login({ 
           loginId: response.data.loginId, 
           password: loginPassword 
         });
         // 로그인 성공 시 ProfileScreen이 있는 탭 네비게이터로 돌아가기
         navigation.goBack();
       } else {
        Alert.alert('로그인 실패', response.message || '아이디 또는 비밀번호를 확인해주세요.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 500) {
        Alert.alert('로그인 실패', '사용자를 찾을 수 없습니다. 아이디와 비밀번호를 확인해주세요.');
      } else {
        Alert.alert('로그인 실패', '네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleSignup = () => {
    navigation.navigate(SCREENS.REGISTER);
  };

  const handleForgotPassword = () => {
    Alert.alert('비밀번호 찾기', '비밀번호 찾기 기능은 추후 구현 예정입니다.');
  };

  const handleHelp = () => {
    Alert.alert('도움말', '도움말 기능은 추후 구현 예정입니다.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* 네비게이션 헤더 */}
      <View style={styles.header}>
                                                                               <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate(SCREENS.PROFILE)}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>로그인</Text>
      </View>

      {/* 앱 제목 */}
      <Text style={styles.appTitle}>UniSportsCard</Text>

      {/* 로그인 폼 */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="ID 입력"
            placeholderTextColor="#999"
            value={loginId}
            onChangeText={setLoginId}
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="비밀번호 입력"
            placeholderTextColor="#999"
            value={loginPassword}
            onChangeText={setLoginPassword}
            secureTextEntry={true}
            autoCapitalize="none"
          />
        </View>
        
        <TouchableOpacity style={styles.forgotPasswordLink} onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>ID또는 암호를 잊으셨습니까?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>

      {/* 도움말 링크 */}
      <TouchableOpacity style={styles.helpLink} onPress={handleHelp}>
        <Text style={styles.helpIcon}></Text>
        <Text style={styles.helpText}>도움이 필요 하신가요?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  
  backButton: {
    padding: 10,
  },
  
  backButtonText: {
    fontSize: 24,
    color: '#999',
    fontWeight: '600',
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5981FA',
    marginLeft: 5, // 뒤로가기 버튼에서 적당한 여백
    top: 2,
  },
  
  appTitle: {
    top: 35,
    fontSize: 30,
    fontWeight: '600',
    color: '#5981FA',
    textAlign: 'center',
    marginBottom: 60,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    lineHeight: 36,
  },
  
  formContainer: {
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  
  inputContainer: {
    marginBottom: 15,
  },
  
  textInput: {
    boxSizing: 'border-box',
    top: 20,
    borderWidth: 1,
    borderColor: '#AEC7EB',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFFFFF',
  },
  
  forgotPasswordLink: {
    alignSelf: 'center',
    top: 20,
    marginBottom: 50,
  },
  
  forgotPasswordText: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 14,
    color: '#AEABAB',
  },
  
  loginButton: {
    backgroundColor: '#5981FA',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  
  signupButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#5981FA',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  signupButtonText: {
    color: '#5981FA',
    fontSize: 18,
    fontWeight: '600',
  },
  
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  
  helpIcon: {
    fontSize: 18,
    color: '#5981FA',
    marginRight: 8,
  },
  
  helpText: {
    fontSize: 14,
    color: '#5981FA',
  },
});
