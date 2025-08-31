import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { LessonService } from '../services/lessonService';
import { BackendLesson } from '../types';
import { SCREENS } from '../constants/screens';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import { LeftArrowGray } from '../../assets/icons/LeftArrow_gray';
import SearchIcon from '../../assets/icons/Search';
import MicIcon from '../../assets/icons/mic';
import { HeartIcon } from '../../assets/icons/HeartIcon';
import { lessonLikeService } from '../services/lessonLikeService';

// 화면 크기
const { width, height } = Dimensions.get('window');

// 스포츠 종목 데이터 (ㄱㄴㄷ순) - 더미데이터 유지
const SPORTS_DATA = {
  'ㄱ': ['걷기', '계단오르기', '검도', '골프', '근력운동'],
  'ㄴ': ['농구', '노르딕워킹'],
  'ㄷ': ['당구', '덤벨 트레이닝', '댄스', '등산'],
  'ㄹ': ['라이딩', '러닝', '롤러스케이팅', '라켓볼'],
  'ㅁ': ['마라톤', '맨몸운동'],
  'ㅂ': ['배드민턴', '배구', '복싱', '볼링', '바이크'],
  'ㅅ': ['수영', '스쿼시', '스케이트보드', '스피닝', '서킷 트레이닝'],
  'ㅇ': ['요가', '에어로빅', '워킹', '유산소 서킷'],
  'ㅈ': ['자전거', '족구', '주짓수', '줄넘기'],
  'ㅊ': ['축구', '철봉 운동', '체조'],
  'ㅋ': ['클라이밍', '크로스핏', '킥복싱'],
  'ㅌ': ['탁구', '태권도', '테니스', '트레킹'],
  'ㅍ': ['필라테스', '푸시업', '파워워킹'],
  'ㅎ': ['하이킹', '헬스', '합기도']
};

export const LessonListScreen = ({ navigation }: any) => {
  const { isAuthenticated, user } = useAuth(); // user 정보 추가
  const [currentStep, setCurrentStep] = useState<'sports' | 'lessons'>('sports');
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [lessons, setLessons] = useState<BackendLesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 관심과목 상태 관리
  const [favoriteLessons, setFavoriteLessons] = useState<Set<string>>(new Set());
  
  // 스크롤 뷰 참조
  const scrollViewRef = useRef<ScrollView>(null);
  // 초성별 위치 정보를 저장할 상태
  const [consonantPositions, setConsonantPositions] = useState<Record<string, number>>({});

  // 날짜를 "몇월 몇일 무슨 요일" 형식으로 변환하는 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    return `${month}월 ${day}일 (${weekday})`;
  };

  // 스포츠 종목 선택 시 해당 종목의 수업을 가져오기
  const handleSportSelect = async (sport: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedSport(sport);
      
      // API에서 해당 스포츠의 수업을 가져오기
      const lessonsData = await LessonService.getLessonsBySportName(sport);
      setLessons(lessonsData);
      setCurrentStep('lessons');
    } catch (error) {
      console.error('스포츠별 수업 조회 실패:', error);
      setError('수업 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 뒤로가기
  const handleBack = () => {
    if (currentStep === 'lessons') {
      setCurrentStep('sports');
      setSelectedSport('');
      setLessons([]);
      setError(null);
    }
  };

  // 수업 상세 화면으로 이동
  const handleLessonSelect = (lesson: BackendLesson) => {
    // 로그인하지 않은 경우 로그인 안내
    if (!isAuthenticated) {
      Alert.alert(
        '로그인 필요',
        '수업 상세 정보를 보려면 로그인이 필요합니다.',
        [
          { text: '취소', style: 'cancel' },
          { 
            text: '로그인하기', 
            onPress: () => navigation.navigate(SCREENS.LOGIN)
          }
        ]
      );
      return;
    }
    
    navigation.navigate(SCREENS.LESSON_DETAIL, { lessonId: lesson.id });
  };

  // 관심과목 토글 함수
  const toggleFavorite = async (lessonId: number) => {
    if (!isAuthenticated || !user) {
      Alert.alert('로그인 필요', '관심과목을 등록하려면 로그인이 필요합니다.', [
        { text: '취소', style: 'cancel' },
        { 
          text: '로그인하기', 
          onPress: () => navigation.navigate(SCREENS.LOGIN)
        }
      ]);
      return;
    }

    try {
      // 먼저 로컬 상태를 업데이트하여 즉시 UI 반영
      setFavoriteLessons(prev => {
        const newSet = new Set(prev);
        const lessonIdStr = lessonId.toString();
        if (newSet.has(lessonIdStr)) {
          newSet.delete(lessonIdStr);
        } else {
          newSet.add(lessonIdStr);
        }
        return newSet;
      });

      // API 호출
      await lessonLikeService.addToFavorites(lessonId, parseInt(user.id));
      
      // 성공 메시지 (선택사항)
      const isFavorite = favoriteLessons.has(lessonId.toString());
      if (!isFavorite) {
        Alert.alert('성공', '관심 레슨으로 등록되었습니다.');
      } else {
        Alert.alert('성공', '관심 레슨에서 제거되었습니다.');
      }
    } catch (error: any) {
      // 실패 시 원래 상태로 되돌리기
      setFavoriteLessons(prev => {
        const newSet = new Set(prev);
        const lessonIdStr = lessonId.toString();
        if (newSet.has(lessonIdStr)) {
          newSet.delete(lessonIdStr);
        } else {
          newSet.add(lessonIdStr);
        }
        return newSet;
      });
      
      Alert.alert('오류', error.message || '관심과목 등록에 실패했습니다.');
    }
  };

  // 수업을 날짜순으로 정렬 (가장 빠른 날짜부터)
  const sortedLessons = [...lessons].sort((a, b) => {
    // 먼저 날짜로 정렬
    const dateA = new Date(a.lessonDate);
    const dateB = new Date(b.lessonDate);
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // 날짜가 같으면 시간으로 정렬
    const timeA = new Date(`2025-01-01 ${a.lessonTime}`);
    const timeB = new Date(`2025-01-01 ${b.lessonTime}`);
    return timeA.getTime() - timeB.getTime();
  }); 

  // 검색어에 따라 스포츠 목록을 필터링하는 함수
  const getFilteredSports = () => {
    if (!searchText.trim()) {
      return SPORTS_DATA;
    }
    
    const filtered: Record<string, string[]> = {};
    const searchLower = searchText.toLowerCase();
    
    Object.entries(SPORTS_DATA).forEach(([consonant, sports]) => {
      const matchingSports = sports.filter(sport => 
        sport.toLowerCase().includes(searchLower)
      );
      
      if (matchingSports.length > 0) {
        filtered[consonant] = matchingSports;
      }
    });
    
    return filtered;
  };

  // 인기 검색어 데이터
  const POPULAR_SEARCH_TERMS = [
    '요가', '초보 요가', '고급 요가', '축구', '요까'
  ];

  // 최근 검색어 데이터
  const RECENT_SEARCH_TERMS = ['요가', '요가', '요가'];

  // 검색어 선택 처리
  const handleSearchTermSelect = (term: string) => {
    setSearchText(term);
    setIsSearchFocused(false);
  };

  // 전체 삭제 처리
  const handleClearAllRecent = () => {
    // 최근 검색어를 모두 삭제하는 로직
    console.log('최근 검색어 전체 삭제');
  };

  // 초성 클릭 시 해당 위치로 스크롤하는 함수
  const handleConsonantPress = (consonant: string) => {
    if (consonantPositions[consonant] !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: consonantPositions[consonant],
        animated: true,
      });
    }
  };

  // 초성별 위치 정보를 업데이트하는 함수
  const updateConsonantPositions = (filteredSports: Record<string, string[]>) => {
    const positions: Record<string, number> = {};
    let currentPosition = 0;
    
    // 헤더와 검색바 높이 계산 (대략적인 값)
    const headerHeight = 120; // 헤더 + 검색바 + 여백
    currentPosition += headerHeight;
    
    Object.entries(filteredSports).forEach(([consonant, sports]) => {
      positions[consonant] = currentPosition;
      // 각 초성 섹션의 높이 계산 (초성 헤더 + 스포츠 아이템들)
      const sectionHeight = 30 + (sports.length * 50); // 30(헤더) + 50(각 아이템)
      currentPosition += sectionHeight;
    });
    
    setConsonantPositions(positions);
  };

  // 검색어나 필터링된 스포츠가 변경될 때 초성 위치 정보 업데이트
  useEffect(() => {
    const filteredSports = getFilteredSports();
    updateConsonantPositions(filteredSports);
  }, [searchText]);

  // 1단계: 스포츠 종목 목록 렌더링 (Header 제외)
  const renderSportsListContent = () => {
    const filteredSports = getFilteredSports();
    
    return (
      <View style={styles.contentContainer}>
                 {/* Search Bar */}
         <View style={styles.searchBar}>
             <SearchIcon size={20} color="#FEFEFE" />
           <TextInput
             style={styles.searchInput}
             placeholder="검색"
             placeholderTextColor="#FEFEFE"
             value={searchText}
             onChangeText={setSearchText}
             onFocus={() => setIsSearchFocused(true)}
             onBlur={() => {
               // 검색어가 비어있을 때만 포커스 해제
               if (!searchText.trim()) {
                 setIsSearchFocused(false);
               }
             }}
           />
           {searchText.length > 0 && (
             <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
               <Text style={styles.clearButtonText}>✕</Text>
             </TouchableOpacity>
           )}
                       <TouchableOpacity style={styles.micIcon}>
              <MicIcon size={20} color="#FEFEFE" />
            </TouchableOpacity>
         </View>

         {/* 검색 모드일 때 인기 검색어와 최근 검색어 표시 */}
         {isSearchFocused && (
           <View style={styles.searchSuggestions}>


             {/* 인기 검색어 */}
             <View style={styles.searchSection}>
               <Text style={styles.searchSectionTitle}>인기 검색어</Text>
               <View style={styles.searchTagsContainer}>
                 {POPULAR_SEARCH_TERMS.map((term, index) => (
                   <TouchableOpacity
                     key={`popular-${index}`}
                     style={styles.searchTag}
                     onPress={() => handleSearchTermSelect(term)}
                   >
                     <Text style={styles.searchTagText}>{term}</Text>
                   </TouchableOpacity>
                 ))}
               </View>
             </View>
           </View>
         )}

        {/* Sports List */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.sportsList} 
          showsVerticalScrollIndicator={false}
        >
          {Object.keys(filteredSports).length === 0 ? (
            <View style={styles.noSearchResults}>
              <Text style={styles.noSearchResultsText}>검색 결과가 없습니다.</Text>
              <Text style={styles.noSearchResultsSubtext}>다른 검색어를 입력해보세요.</Text>
            </View>
          ) : (
            Object.entries(filteredSports).map(([consonant, sports]) => (
              <View key={consonant}>
                {/* Consonant Header */}
                <Text style={styles.consonantHeader}>{consonant}</Text>
                
                {/* Sports under this consonant */}
                {sports.map((sport, index) => (
                  <View key={sport}>
                    <TouchableOpacity
                      style={styles.sportItem}
                      onPress={() => handleSportSelect(sport)}
                    >
                      <Text style={styles.sportText}>{sport}</Text>
                    </TouchableOpacity>
                    {index < sports.length - 1 && <View style={styles.sportDivider} />}
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>

        {/* Alphabet Index - 검색 결과가 있을 때만 표시 */}
        {Object.keys(filteredSports).length > 0 && (
          <View style={styles.alphabetIndex}>
            {Object.keys(filteredSports).map(consonant => (
              <TouchableOpacity 
                key={consonant} 
                onPress={() => handleConsonantPress(consonant)}
                style={styles.alphabetItem}
                activeOpacity={0.7}
              >
                <Text style={styles.alphabetText}>{consonant}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  // 2단계: 수업 목록 렌더링 (Header 제외)
  const renderLessonsListContent = () => (
    <View style={styles.contentContainer}>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={handleBack}>
          <LeftArrowGray width={32} height={32} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{selectedSport}</Text>
      </View>

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5981FA" />
          <Text style={styles.loadingText}>수업 정보를 불러오는 중...</Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => handleSportSelect(selectedSport)}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lessons List */}
      {!isLoading && !error && (
        <ScrollView style={styles.lessonsList} showsVerticalScrollIndicator={false}>
          {sortedLessons.length === 0 ? (
            <View style={styles.noLessonsContainer}>
              <Text style={styles.noLessonsText}>해당 종목의 수업이 없습니다.</Text>
            </View>
          ) : (
            <View style={styles.timelineContainer}>
              {/* Timeline Lines */}
              {sortedLessons.map((_, index) => {
                if (index < sortedLessons.length ) {
                  return (
                    <View 
                      key={`line-${index}`} 
                      style={[
                        styles.timelineLine, 
                        { 
                          top: (index * 165) + 20, // timelineDot의 중앙 위치에서 시작
                          height: 105, // 다음 수업 아이템의 timelineDot 중앙까지의 거리
                        }
                      ]} 
                    />
                  );
                }
                return null;
              })}
              
              {/* Lessons */}
              {sortedLessons.map((lesson, index) => (
                <View key={lesson.id} style={styles.lessonItem}>
                  {/* Timeline Dot */}
                  <View style={styles.timelineDot} />
                  
                  {/* Lesson Card */}
                  <TouchableOpacity 
                    style={styles.lessonCard}
                    onPress={() => handleLessonSelect(lesson)}
                  >
                    <View style={styles.lessonInfo}>
                      <Text style={styles.lessonTime}>
                        {lesson.lessonTime.substring(0, 5)} {formatDate(lesson.lessonDate)}
                      </Text>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.lessonLocation}>{lesson.location}</Text>
                      <Text style={styles.reservationText}>예약가능</Text>
                    </View>
                    
                    <View style={styles.lessonImageContainer}>
                      {lesson.image ? (
                        <View style={styles.lessonImage} />
                      ) : (
                        <View style={styles.noImageContainer}>
                          <Text style={styles.noImageText}>이미지 없음</Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Heart Icon */}
                    <TouchableOpacity 
                      style={styles.heartIconContainer}
                      onPress={(e) => {
                        e.stopPropagation(); // 카드 클릭 이벤트와 분리
                        toggleFavorite(lesson.id);
                      }}
                    >
                      <HeartIcon 
                        size={30} 
                        color="#5981FA" 
                        filled={favoriteLessons.has(lesson.id.toString())}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header를 SafeAreaView 밖으로 이동하여 paddingTop: 50이 적용되도록 함 */}
      <Header 
        title="수업리스트" 
        showLogo={false} 
        customIcon={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LeftArrowGray width={32} height={32} />
          </TouchableOpacity>
        } 
      />
      
      {/* 스포츠 목록 또는 수업 목록 렌더링 */}
      {currentStep === 'sports' && renderSportsListContent()}
      {currentStep === 'lessons' && renderLessonsListContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  container: {
    flex: 1,
    position: 'relative',
    width: 393,
    backgroundColor: '#FEFEFE',
    paddingTop: 60,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    width: 393,
    backgroundColor: '#FEFEFE',
  },
  

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#AEC7EB',
    borderRadius: 20,
    marginHorizontal: 11,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 40,
    marginBottom: 10,
  },
  searchIcon: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#FEFEFE',
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#2B308B',
    marginLeft: 7,
    paddingVertical: 0,
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  micIcon: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Sports List
  sportsList: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 30,
    marginTop: 3,
    marginBottom: 110
  },
  consonantHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5981FA',
    marginTop: 20,
    marginBottom: 10,
  },
  sportItem: {
    paddingVertical: 15,
  },
  sportText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2B308B',
    lineHeight: 22,
  },
  sportDivider: {
    width: 372,
    height: 0.7,
    backgroundColor: '#5981FA',
    left: -10,

  },
  
  // Alphabet Index
  alphabetIndex: {
    position: 'absolute',
    right: 12,
    top: 193,
    height: 210,
    justifyContent: 'space-between',
  },
  alphabetItem: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2B308B',
    lineHeight: 15,
  },
  
  // Navigation
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 23,
    paddingTop: 30,
    marginBottom: 25,
  },
  backArrow: {
    width: 1,
    height: 0,
    borderWidth: 3,
    borderColor: '#AEABAB',
    transform: [{ rotate: '180deg' }],
    marginRight: 26,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2B308B',
    lineHeight: 27,
    marginLeft: 10,
  },
  
  // Lessons List
  lessonsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timelineContainer: {
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: '#5981FA',
    width: 2,
    height: 50,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 40,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: 1,
    width: 21,
    height: 21,
    backgroundColor: '#5981FA',
    borderRadius: 10.5,
    zIndex: 1,
    borderColor: '#FEFEFE',
  },
  /* 카드 */
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: '#EDF2F8',
    borderRadius: 20,
    paddingHorizontal: 23,
    paddingVertical: 15,
    marginLeft: 32,
    flex: 1,
    height: 125,
    alignItems: 'center',
    width: 324,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lessonInfo: {
    flex: 1,
    marginRight: 20,
    justifyContent: 'space-between',
    height: '100%',
  },
  lessonTime: {
    fontSize: 15,
    fontWeight: '400',
    color: '#2B308B',
    lineHeight: 18,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B308B',
    lineHeight: 24,
    marginBottom: 8,
  },
  lessonLocation: {
    fontSize: 13,
    fontWeight: '400',
    color: '#696E83',
    lineHeight: 16,
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#696E83',
    lineHeight: 15,
    marginBottom: 8,
    flex: 1,
  },
  reservationText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#5981FA',
    lineHeight: 18,
    marginTop: 'auto',
  },
  lessonImageContainer: {
    position: 'relative',
    marginRight: 22,
    width: 94,
    height: 94,
  },
  lessonImage: {
    width: 94,
    height: 94,
    backgroundColor: '#AEC7EB',
    borderRadius: 10,
  },
  noImageContainer: {
    width: 94,
    height: 94,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#696E83',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2B308B',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2B308B',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#5981FA',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FEFEFE',
  },
  noLessonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  noLessonsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2B308B',
    textAlign: 'center',
  },
  noSearchResults: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noSearchResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B308B',
    marginBottom: 8,
  },
     noSearchResultsSubtext: {
     fontSize: 14,
     color: '#9CA3AF',
     fontWeight: '400',
   },
   
   // 검색 제안 스타일
   searchSuggestions: {
     backgroundColor: '#FEFEFE',
     paddingHorizontal: 20,
     paddingTop: 10,
     paddingBottom: 20,
   },
   searchSection: {
     marginBottom: 20,
   },
   searchSectionHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 12,
   },
   searchSectionTitle: {
     fontSize: 16,
     fontWeight: '600',
     color: '#2B308B',
   },
   clearAllText: {
     fontSize: 14,
     color: '#9CA3AF',
     fontWeight: '400',
   },
   searchTagsContainer: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     gap: 8,
     marginTop: 20
   },
   searchTag: {
     backgroundColor: '#F3F4F6',
     paddingHorizontal: 12,
     paddingVertical: 8,
     borderRadius: 16,
     borderWidth: 1,
     borderColor: '#E5E7EB',
   },
   searchTagText: {
     fontSize: 14,
     color: '#2B308B',
     fontWeight: '500',
   },
       heartIconContainer: {
      position: 'absolute',
      right: 10,
      top: 62,
      transform: [{ translateY: -15 }], // 하트 아이콘 높이의 절반만큼 위로 이동하여 정확한 중앙 정렬
      zIndex: 2,
    },
 });

export default LessonListScreen;



