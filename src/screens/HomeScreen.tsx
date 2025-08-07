import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>UniSportCard</Text>
          <Text style={styles.subtitle}>대학생 스포츠 중개 플랫폼</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>인기 수업</Text>
          <View style={styles.lessonCard}>
            <Text style={styles.lessonTitle}>테니스 기초 레슨</Text>
            <Text style={styles.lessonInfo}>강사: 김철수 | 가격: 30,000원</Text>
          </View>
          
          <View style={styles.lessonCard}>
            <Text style={styles.lessonTitle}>축구 개인 레슨</Text>
            <Text style={styles.lessonInfo}>강사: 이영희 | 가격: 25,000원</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.PRIMARY,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 15,
  },
  lessonCard: {
    backgroundColor: COLORS.WHITE,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 5,
  },
  lessonInfo: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});
