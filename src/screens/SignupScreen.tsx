import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, StatusBar, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SCREENS } from '../constants/screens';
import { AuthService } from '../services/authService';

type SignupScreenProps = {
  navigation: StackNavigationProp<any>;
};

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [showDomainPicker, setShowDomainPicker] = useState(false);
  const [university, setUniversity] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleSignup = async () => {
    if (!id || !password || !confirmPassword || !name || !email || !emailDomain || !university || !studentId) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 10 || password.length > 32) {
      Alert.alert('오류', '비밀번호는 10-32자 사이여야 합니다.');
      return;
    }

    try {
      // 회원가입 API 호출
      const response = await AuthService.register({
        loginId: id,
        password: password,
        name: name,
        email: email + '@' + emailDomain,
        university: university,
        studentNumber: studentId
      });

      if (response.success) {
        Alert.alert('성공', '회원가입이 완료되었습니다!', [
          { text: '확인', onPress: () => navigation.navigate(SCREENS.LOGIN) }
        ]);
      } else {
        Alert.alert('오류', response.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      Alert.alert('오류', '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleCheckDuplicate = async () => {
    if (!id) {
      Alert.alert('오류', '아이디를 먼저 입력해주세요.');
      return;
    }
    
    // TODO: 실제 중복확인 API 호출 (백엔드에 API가 있다면)
    // 현재는 임시로 사용 가능한 아이디로 처리
    Alert.alert('중복확인', '사용 가능한 아이디입니다.');
  };

  const handleEmailDomainSelect = () => {
    setShowDomainPicker(!showDomainPicker);
  };

  const selectDomain = (domain: string) => {
    setEmailDomain(domain);
    setShowDomainPicker(false);
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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>


        {/* 회원가입 폼 */}
        <View style={styles.formContainer}>
          {/* 아이디 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>아이디</Text>
                         <View style={styles.idContainer}>
               <TextInput
                 style={styles.idInput}
                 placeholder="ID 입력"
                 placeholderTextColor="#999"
                 value={id}
                 onChangeText={setId}
                 autoCapitalize="none"
               />
               <TouchableOpacity style={styles.checkButton} onPress={handleCheckDuplicate}>
                 <Text style={styles.checkButtonText}>중복확인</Text>
               </TouchableOpacity>
             </View>
            <Text style={styles.hintText}>영문/숫자 6-20자 (._- 사용 가능)</Text>
          </View>

          {/* 비밀번호 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>비밀번호</Text>
            <TextInput
              style={styles.textInput}
              placeholder="비밀번호"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.textInput}
              placeholder="비밀번호 확인"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />
            <Text style={styles.hintText}>비밀번호 (10-32자), 영문+숫자 포함, 아이디/이름은 포함하지 마세요.</Text>
          </View>

          {/* 이름 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>이름</Text>
            <TextInput
              style={styles.textInput}
              placeholder="이름"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>

                     {/* 이메일 섹션 */}
           <View style={styles.section}>
             <Text style={styles.sectionLabel}>이메일</Text>
             <View style={styles.emailContainer}>
                               <TextInput
                  style={[
                    styles.emailInput,
                    { width: emailDomain ? 200 : 247 }
                  ]}
                  placeholder="이메일"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
               <Text style={styles.emailSeparator}>@</Text>
                               <TouchableOpacity style={styles.domainButton} onPress={handleEmailDomainSelect}>
                  <Text style={styles.domainButtonText}>
                    {emailDomain || '선택'}
                  </Text>
                  <Text style={styles.domainButtonArrow}>▼</Text>
                </TouchableOpacity>
             </View>
             
             {/* 도메인 선택기 */}
             {showDomainPicker && (
               <View style={styles.domainPicker}>
                 <TouchableOpacity 
                   style={styles.domainOption} 
                   onPress={() => selectDomain('gmail.com')}
                 >
                   <Text style={[
                     styles.domainOptionText, 
                     emailDomain === 'gmail.com' && styles.domainOptionTextSelected
                   ]}>gmail.com</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                   style={styles.domainOption} 
                   onPress={() => selectDomain('naver.com')}
                 >
                   <Text style={[
                     styles.domainOptionText, 
                     emailDomain === 'naver.com' && styles.domainOptionTextSelected
                   ]}>naver.com</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                   style={styles.domainOption} 
                   onPress={() => selectDomain('kakao.com')}
                 >
                   <Text style={[
                     styles.domainOptionText, 
                     emailDomain === 'kakao.com' && styles.domainOptionTextSelected
                   ]}>kakao.com</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                   style={[styles.domainOption, { borderBottomWidth: 0 }]} 
                   onPress={() => selectDomain('daum.net')}
                 >
                   <Text style={[
                     styles.domainOptionText, 
                     emailDomain === 'daum.net' && styles.domainOptionTextSelected
                   ]}>daum.net</Text>
                 </TouchableOpacity>
               </View>
             )}
           </View>

          {/* 대학명 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>대학명</Text>
            <TextInput
              style={styles.textInput}
              placeholder="대학명"
              placeholderTextColor="#999"
              value={university}
              onChangeText={setUniversity}
            />
          </View>

          {/* 학번 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>학번</Text>
            <TextInput
              style={styles.textInput}
              placeholder="학번"
              placeholderTextColor="#999"
              value={studentId}
              onChangeText={setStudentId}
              keyboardType="numeric"
            />
          </View>

          {/* 가입하기 버튼 */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>가입하기</Text>
          </TouchableOpacity>

          {/* 도움말 링크 */}
          <TouchableOpacity style={styles.helpLink} onPress={handleHelp}>
            <Text style={styles.helpIcon}></Text>
            <Text style={styles.helpText}>도움이 필요 하신가요?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 80,
    top: 50,
  },
  
  backButton: {
    padding: 10,
  },
  
  backButtonText: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5981FA',
    marginLeft: 5, // backButton의 width를 고려한 중앙 정렬
    top: 2,
  },
  
  scrollContainer: {
    flex: 1,
  },
  
  
  formContainer: {
    paddingHorizontal: 40,
    paddingBottom: 100, // 도움말 링크 공간 확보
  },
  
  section: {
    marginBottom: 30,
  },
  
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5981FA',
    marginBottom: 10,
    left: -20, // 입력 박스와 동일한 위치로 정렬
  },
  
  textInput: {
    borderWidth: 1,
    borderColor: '#AEC7EB',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    width: 372, // 가입하기 버튼과 동일한 너비
    left: -30, // 가입하기 버튼과 동일한 위치 조정
  },

  // 아이디 입력 전용 스타일 (중복확인 버튼과 함께 배치)
  idInput: {
    borderWidth: 1,
    borderColor: '#AEC7EB',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    width: 280, // 중복확인 버튼을 위한 공간 확보
    left: 0, // 가입하기 버튼과 동일한 위치 조정
    top: 4,
  },
  
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: 372, // 가입하기 버튼과 동일한 너비
    left: -30, // 가입하기 버튼과 동일한 위치 조정
    justifyContent: 'space-between', // 아이디 입력과 중복확인 버튼 사이 공간 분배
  },
  
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: 372, // 가입하기 버튼과 동일한 너비
    left: -30, // 가입하기 버튼과 동일한 위치 조정
  },
  
  emailInput: {
    borderWidth: 1,
    borderColor: '#AEC7EB',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFFFFF',
    width: 247, // 이메일 입력 부분을 적당한 너비로 설정 (도메인 선택 버튼과의 균형)
  },
  
  emailSeparator: {
    fontSize: 20,
    color: '#333',
    marginHorizontal: 15,
    fontWeight: '500',
  },
  
  checkButton: {
    backgroundColor: '#AEC7EB',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    marginLeft: 10,
    width: 80, // 중복확인 버튼 너비 고정
    alignItems: 'center', // 텍스트 중앙 정렬
  },
  
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  domainButton: {
    backgroundColor: '#AEC7EB',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  domainButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  
  domainButtonArrow: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  
  hintText: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    lineHeight: 16,
  },
  
  signupButton: {
    backgroundColor: '#5981FA',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 372,
    left: -30,
  },
  
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingVertical: 20,
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
   
   // 도메인 선택기 스타일
   domainPicker: {
     backgroundColor: '#FFFFFF',
     borderWidth: 1,
     borderColor: '#AEC7EB',
     borderRadius: 8,
     marginTop: 5,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 3,
     zIndex: 1000,
   },
   
   domainOption: {
     paddingVertical: 12,
     paddingHorizontal: 20,
     borderBottomWidth: 1,
     borderBottomColor: '#F0F0F0',
   },
   
   domainOptionText: {
     fontSize: 16,
     color: '#333',
     textAlign: 'center',
   },
   
   domainOptionTextSelected: {
     color: '#5981FA',
     fontWeight: '600',
   },
 });
