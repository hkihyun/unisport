import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, StatusBar, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import { Header } from '../components/Header';
import { LeftArrowBlue } from '../../assets/icons/LeftArrow_blue';
import { InstructorService } from '../services/instructorService';
import { useAuth } from '../hooks/useAuth';

export const InstructorVerifyScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [photo, setPhoto] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 사용자 정보가 로드되면 폼에 자동으로 설정
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setStudentId(user.studentNumber || '');
    }
  }, [user]);

  // photo 상태 변화 추적
  useEffect(() => {
    console.log('Photo 상태 변화:', photo);
  }, [photo]);

  // 로그인 상태 확인
  useEffect(() => {
    if (!user?.id) {
      Alert.alert('오류', '사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      navigation.goBack();
    }
  }, [user?.id, navigation]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert('권한 필요', '카메라와 갤러리 접근 권한이 필요합니다.');
        return false;
      }
    }
    return true;
  };

  const handlePhotoUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      '사진 업로드',
      '사진을 선택하는 방법을 선택하세요.',
      [
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '카메라',
          onPress: () => takePhoto()
        },
        {
          text: '갤러리',
          onPress: () => pickImage()
        }
      ]
    );
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedPhoto = result.assets[0];
        setPhoto({
          uri: selectedPhoto.uri,
          type: 'image/jpeg',
          name: 'instructor_verification.jpg'
        });
      }
    } catch (error) {
      console.error('카메라 에러:', error);
      Alert.alert('오류', '카메라를 사용할 수 없습니다.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedPhoto = result.assets[0];
        setPhoto({
          uri: selectedPhoto.uri,
          type: 'image/jpeg',
          name: 'instructor_verification.jpg'
        });
      }
    } catch (error) {
      console.error('갤러리 에러:', error);
      Alert.alert('오류', '갤러리에서 사진을 선택할 수 없습니다.');
    }
  };

  const handleVerification = async () => {
    if (!name.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return;
    }
    if (!studentId.trim()) {
      Alert.alert('오류', '학번을 입력해주세요.');
      return;
    }
    if (!photo) {
      Alert.alert('오류', '인증 사진을 첨부해주세요.');
      return;
    }
    if (!user?.id) {
      Alert.alert('오류', '사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 강사인증 API 호출 - 실제 사용자 ID 사용
      const result = await InstructorService.verifyInstructor(parseInt(user.id), {
        studentNumber: studentId,
        photo: photo,
      });

      if (result.success) {
        // 강사 인증 완료 상태를 AsyncStorage에 저장
        try {
          await AsyncStorage.setItem('instructorVerified', 'true');
          console.log('✅ 강사 인증 완료 상태를 AsyncStorage에 저장했습니다.');
        } catch (error) {
          console.error('AsyncStorage 저장 중 오류:', error);
        }

        Alert.alert(
          '인증 완료',
          result.message,
          [
            {
              text: '확인',
              onPress: () => {
                // 뒤로 가기 (Profile 탭으로 돌아감)
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert('인증 실패', result.message);
      }
    } catch (error) {
      console.error('강사인증 에러:', error);
      Alert.alert('인증 실패', '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* 네비게이션 헤더 */}
      <Header 
        title="로그인" 
        showLogo={true} 
        customIcon={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LeftArrowBlue width={32} height={32} />
          </TouchableOpacity>
        } 
      />
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
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.uploadedPhoto} />
            ) : (
              <>
                <View style={styles.cameraIcon}>
                  <Image 
                    source={require('../../assets/icons/PictureUpload.png')} 
                    style={styles.uploadIcon}
                  />
                </View>
                <Text style={styles.photoCount}>사진 업로드</Text>
              </>
            )}
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
      <TouchableOpacity 
        style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]} 
        onPress={handleVerification}
        disabled={isLoading}
      >
        <Text style={styles.verifyButtonText}>
          {isLoading ? '인증 중...' : '인증하기'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
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

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  uploadedPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraIcon: {
    marginBottom: 8,
  },
  uploadIcon: {
    width: 80,
    height: 80,
    tintColor: '#007AFF',
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
    backgroundColor: '#5981FA',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default InstructorVerifyScreen;


