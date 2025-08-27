import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native';
import { COLORS } from '../constants/colors';

export const InstructorVerifyScreen: React.FC<any> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [photoCount, setPhotoCount] = useState(0);

  const handleVerification = () => {
    if (!name.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return;
    }
    if (!studentId.trim()) {
      Alert.alert('오류', '학번을 입력해주세요.');
      return;
    }
    if (photoCount === 0) {
      Alert.alert('오류', '인증 사진을 첨부해주세요.');
      return;
    }

    Alert.alert(
      '인증 완료',
      '강사 인증이 완료되었습니다.',
      [
        {
          text: '확인',
          onPress: () => {
            // 강사 인증 완료 상태를 전달
            navigation.navigate('Profile', { instructorVerified: true });
          }
        }
      ]
    );
  };

  const handlePhotoUpload = () => {
    setPhotoCount(1);
    Alert.alert('사진 업로드', '사진이 업로드되었습니다.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>강사 인증</Text>
      </View>

      {/* 폼 필드들 */}
      <View style={styles.formContainer}>
        {/* 이름 필드 */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>이름</Text>
          <TextInput
            style={styles.inputField}
            value={name}
            onChangeText={setName}
            placeholder="이름"
            placeholderTextColor="#999"
          />
        </View>

        {/* 학번 필드 */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>학번</Text>
          <TextInput
            style={styles.inputField}
            value={studentId}
            onChangeText={setStudentId}
            placeholder="학번"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* 인증 사진 섹션 */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>인증 사진</Text>
          <TouchableOpacity style={styles.photoUploadArea} onPress={handlePhotoUpload}>
            <View style={styles.cameraIcon}>
              <Text style={styles.cameraIconText}>📷</Text>
            </View>
            <Text style={styles.photoCount}>{photoCount}/1</Text>
          </TouchableOpacity>
          <Text style={styles.photoInstruction}>인증 사진을 첨부해 주세요.</Text>
        </View>
      </View>

      {/* 하단 도움말 */}
      <View style={styles.bottomHelp}>
        <View style={styles.helpIcon}>
          <Text style={styles.helpIconText}>?</Text>
        </View>
        <Text style={styles.helpText}>도움이 필요 하신가요?</Text>
      </View>

      {/* 인증하기 버튼 */}
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerification}>
        <Text style={styles.verifyButtonText}>인증하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  backButton: {
    marginRight: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  formContainer: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 30,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 12,
  },
  inputField: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  photoUploadArea: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  cameraIcon: {
    marginBottom: 8,
  },
  cameraIconText: {
    fontSize: 32,
    color: '#007AFF',
  },
  photoCount: {
    fontSize: 14,
    color: '#999',
  },
  photoInstruction: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  bottomHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  helpIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  helpIconText: {
    fontSize: 12,
    color: '#999',
  },
  helpText: {
    fontSize: 14,
    color: '#999',
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InstructorVerifyScreen;


