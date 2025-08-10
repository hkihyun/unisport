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
    { title: '내 프로필', description: '개인정보 수정' },
    { title: '강사인증', description: '강사 등록 및 인증' },
    { title: '학생인증', description: '학생 인증 상태' },
    { title: '알림', description: '알림 설정' },
    { title: '이용약관', description: '서비스 이용약관' },
    { title: '개인정보처리방침', description: '개인정보 보호정책' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* 프로필 헤더 */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>US</Text>
            </View>
            <TouchableOpacity style={styles.editImageButton}>
              <Text style={styles.editImageButtonText}>편집</Text>
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
                  placeholderTextColor={COLORS.TEXT_MUTED}
                />
                <TextInput
                  style={styles.editInput}
                  value={editedUser.email}
                  onChangeText={(text) => setEditedUser({...editedUser, email: text})}
                  placeholder="이메일"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                />
                <TextInput
                  style={styles.editInput}
                  value={editedUser.university}
                  onChangeText={(text) => setEditedUser({...editedUser, university: text})}
                  placeholder="대학교"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                />
                <TextInput
                  style={styles.editInput}
                  value={editedUser.major}
                  onChangeText={(text) => setEditedUser({...editedUser, major: text})}
                  placeholder="전공"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                />
                <TextInput
                  style={[styles.editInput, styles.bioInput]}
                  value={editedUser.bio}
                  onChangeText={(text) => setEditedUser({...editedUser, bio: text})}
                  placeholder="소개"
                  placeholderTextColor={COLORS.TEXT_MUTED}
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
            <Text style={styles.authTitle}>인증 상태</Text>
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
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>{item.title.charAt(0)}</Text>
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
              </View>
              <Text style={styles.menuArrow}>›</Text>
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
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: COLORS.WHITE,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  editImageButtonText: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
  },
  profileUniversity: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  profileMajor: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  editInput: {
    width: 280,
    height: 44,
    borderWidth: 1.5,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: COLORS.WHITE,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  editButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  authSection: {
    padding: 24,
  },
  authCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  authItems: {
    marginBottom: 20,
  },
  authItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  authItemText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  authBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  unverifiedBadge: {
    backgroundColor: COLORS.GRAY_200,
  },
  authBadgeText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  unverifiedBadgeText: {
    color: COLORS.TEXT_SECONDARY,
  },
  authButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  authButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  menuSection: {
    padding: 24,
  },
  menuItem: {
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY_SUBTLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIconText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  menuArrow: {
    fontSize: 20,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: COLORS.ERROR,
    margin: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
