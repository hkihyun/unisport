  import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeIcon, CalendarDaysIcon, ListBulletIcon, UserIcon } from 'react-native-heroicons/solid';
import { COLORS } from '../constants/colors';

  const BlurBackground: React.FC = () => (
  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
    {/* 하단 블러 효과 */}
    <BlurView
      tint="light"
      intensity={60}
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }
      ]}
    />
    <LinearGradient
      colors={[
        'rgba(254, 254, 254, 0)',      // 0% - 완전 투명
        'rgba(254, 254, 254, 0.3)',    // 17.79% - 30% 투명
        'rgba(254, 254, 254, 0.6)',    // 34.62% - 60% 투명
        'rgba(254, 254, 254, 0.8)',    // 50% - 80% 투명
        'rgba(254, 254, 254, 1)'       // 84.13% - 완전 불투명
      ]}
      locations={[0, 0.1779, 0.3462, 0.5, 0.8413]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    />
  </View>
);

  export const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const [barWidth, setBarWidth] = useState(0);

    const onPress = (index: number) => {
      console.log(`=== TAB PRESSED ===`);
      console.log(`Index: ${index}`);
      console.log(`State routes:`, state.routes);
      console.log(`State index:`, state.index);
      
      const route = state.routes[index];
      if (!route) {
        console.log('❌ No route found for index:', index);
        return;
      }
      
      console.log(`✅ Route found:`, route);
      console.log(`🚀 Navigating to: ${route.name}`);
      
      try {
        navigation.navigate(route.name);
        console.log(`✅ Navigation successful`);
      } catch (error) {
        console.log(`❌ Navigation failed:`, error);
      }
    };

    const px = (n: number) => (barWidth ? (n / 393) * barWidth : 0);
    const iconTop = 15;
    const labelTop = 50;
    const positions = [
      { iconLeft: 49, labelLeft: 60 },
      { iconLeft: 136.03, labelLeft: 133 },
      { iconLeft: 223.05, labelLeft: 216 },
      { iconLeft: 310.08, labelLeft: 316 },
    ];

    return (
      <View style={styles.root}>
        <View style={styles.svgWrap} onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}>
          {barWidth > 0 ? <BlurBackground /> : null}
          {barWidth > 0 ? state.routes.map((route, idx) => {
            const isFocused = state.index === idx;
            const color = isFocused ? '#2B308B' : '#8BA3D9';
            const label = (descriptors[route.key]?.options?.tabBarLabel as string)
              || (descriptors[route.key]?.options?.title as string)
              || route.name;
            const Icon =
              route.name === 'Home' ? HomeIcon :
              route.name === 'Bookings' ? CalendarDaysIcon :
              route.name === 'Favorites' ? ListBulletIcon :
              UserIcon;
            const iconSize = route.name === 'Profile' ? 33 : 32;
            // 터치 영역을 아이콘과 텍스트 주변에 정확히 맞춤
            const iconLeft = px(positions[idx].iconLeft);
            const iconCenter = iconLeft + (iconSize / 2); // 아이콘의 실제 중앙점 계산
            const touchAreaWidth = 100; // 터치 영역 너비를 더 크게
            let areaLeft = iconCenter - (touchAreaWidth / 2);
            
            // 터치 영역이 화면 밖으로 나가지 않도록 조정
            if (areaLeft < 0) areaLeft = 0;
            if (areaLeft + touchAreaWidth > barWidth) areaLeft = barWidth - touchAreaWidth;
            
            // 디버깅용 로그
            console.log(`Tab ${idx} (${route.name}):`, {
              barWidth,
              iconLeft: positions[idx].iconLeft,
              iconLeftPx: iconLeft,
              iconCenter,
              areaLeft,
              touchAreaWidth
            });
            
            return (
              <React.Fragment key={route.key}>
                <TouchableOpacity 
                                  style={{ 
                    position: 'absolute', 
                    left: areaLeft, 
                    width: touchAreaWidth, 
                    top: 0, 
                    height: 85,
                    zIndex: 1000, // z-index를 높여서 다른 요소들 위에 배치
                  }} 
                  onPress={() => onPress(idx)}
                  activeOpacity={0.7}
                />
                                                             <View style={{ position: 'absolute', left: px(positions[idx].iconLeft), top: iconTop }}>
                   <Icon color={color} size={iconSize} />
                 </View>
                <Text style={{ position: 'absolute', left: px(positions[idx].labelLeft), top: labelTop, fontSize: 10, lineHeight: 12, fontWeight: '400', color }}>
                  {label}
                </Text>
              </React.Fragment>
            );
          }) : null}
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    root: {
      backgroundColor: 'transparent',
    },
      svgWrap: {
    height: 85,
    width: '100%',
    backgroundColor: 'transparent',
    position: 'relative',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  });

  export default BottomTabBar;
