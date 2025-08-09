import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';

export const ProfileScreen: React.FC = () => {
  const { user, tempLogout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '김철수',
    email: user?.email || 'kim@example.com',
    university: user?.university || '서울대학교',
    major: user?.major || '체육교육과',
    grade: user?.grade || 3,
    bio: user?.bio || '안녕하세요! 스포츠를 사랑하는 대학생입니다.',
  });

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '로그아웃', 
          style: 'destructive',
          onPress: () => {
            tempLogout();
            Alert.alert('로그아웃', '로그아웃되었습니다.');
          }
        },
      ]
    );
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('저장 완료', '프로필이 업데이트되었습니다.');
  };

  const menuItems = [
    { title: '내 프로필', description: '개인정보 수정', icon: '👤' },
    { title: '강사인증', description: '강사 등록 및 인증', icon: '✨' },
    { title: '학생인증', description: '학생 인증 상태', icon: '🎓' },
    { title: '알림', description: '알림 설정', icon: '🔔' },
    { title: '이용약관', description: '서비스 이용약관', icon: '📋' },
    { title: '개인정보처리방침', description: '개인정보 보호정책', icon: '🔒' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* 프로필 헤더 */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>👤</Text>
            </View>
            <TouchableOpacity style={styles.editImageButton}>
              <Text style={styles.editImageButtonText}>📷</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.editInput}
                  value={editedUser.name}
                  onChangeText={(text) => setEditedUser({...editedUser, name: text})}
                  placeholder="이름"
                />
                <TextInput
                  style={styles.editInput}
                  value={editedUser.email}
                  onChangeText={(text) => setEditedUser({...editedUser, email: text})}
                  placeholder="이메일"
                />
                <TextInput
                  style={styles.editInput}
                  value={editedUser.university}
                  onChangeText={(text) => setEditedUser({...editedUser, university: text})}
                  placeholder="대학교"
                />
                <TextInput
                  style={styles.editInput}
                  value={editedUser.major}
                  onChangeText={(text) => setEditedUser({...editedUser, major: text})}
                  placeholder="전공"
                />
                <TextInput
                  style={[styles.editInput, styles.bioInput]}
                  value={editedUser.bio}
                  onChangeText={(text) => setEditedUser({...editedUser, bio: text})}
                  placeholder="소개"
                  multiline
                />
              </>
            ) : (
              <>
                <Text style={styles.profileName}>{editedUser.name}</Text>
                <Text style={styles.profileEmail}>{editedUser.email}</Text>
                <Text style={styles.profileUniversity}>{editedUser.university}</Text>
                <Text style={styles.profileMajor}>{editedUser.major} • {editedUser.grade}학년</Text>
                <Text style={styles.profileBio}>{editedUser.bio}</Text>
              </>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? '저장' : '편집'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 인증 상태 */}
        <View style={styles.authSection}>
          <View style={styles.authCard}>
            <Text style={styles.authTitle}>인증</Text>
            <View style={styles.authItems}>
              <View style={styles.authItem}>
                <Text style={styles.authItemText}>이름</Text>
                <View style={styles.authBadge}>
                  <Text style={styles.authBadgeText}>인증됨</Text>
                </View>
              </View>
              <View style={styles.authItem}>
                <Text style={styles.authItemText}>소속</Text>
                <View style={styles.authBadge}>
                  <Text style={styles.authBadgeText}>인증됨</Text>
                </View>
              </View>
              <View style={styles.authItem}>
                <Text style={styles.authItemText}>학번</Text>
                <View style={[styles.authBadge, styles.unverifiedBadge]}>
                  <Text style={[styles.authBadgeText, styles.unverifiedBadgeText]}>미인증</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.authButton}>
              <Text style={styles.authButtonText}>인증하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 메뉴 섹션 */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.GRAY_200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 32,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButtonText: {
    fontSize: 12,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 3,
  },
  profileUniversity: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 3,
  },
  profileMajor: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
  editInput: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: COLORS.BACKGROUND,
    textAlign: 'center',
  },
  bioInput: {
    height: 60,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  editButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  authSection: {
    padding: 15,
  },
  authCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 15,
  },
  authItems: {
    marginBottom: 15,
  },
  authItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  authItemText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  authBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unverifiedBadge: {
    backgroundColor: COLORS.GRAY_200,
  },
  authBadgeText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '500',
  },
  unverifiedBadgeText: {
    color: COLORS.TEXT_SECONDARY,
  },
  authButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  authButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  menuSection: {
    padding: 15,
  },
  menuItem: {
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  menuArrow: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  logoutButton: {
    backgroundColor: COLORS.ERROR,
    margin: 15,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 20,
  },
});
