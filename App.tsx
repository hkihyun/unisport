import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/hooks/useAuth';
import { startFigmaChannel } from './src/services/figmaClient';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  useEffect(() => {
    const CHANNEL_KEY = 'figmaChannelCode';
    const WS_URL_KEY = 'figmaWsUrl';

    async function initFromDeepLinkOrCache() {
      try {
        const initialUrl = await Linking.getInitialURL();
        let channel: string | null = null;
        let wsUrl: string | null = null;

        if (initialUrl) {
          try {
            const url = new URL(initialUrl);
            channel = url.searchParams.get('figmaChannel');
            wsUrl = url.searchParams.get('figmaWsUrl');
          } catch {}
        }

        if (!channel) {
          channel = await AsyncStorage.getItem(CHANNEL_KEY);
        }
        if (!wsUrl) {
          wsUrl = await AsyncStorage.getItem(WS_URL_KEY);
        }

        if (channel) {
          startFigmaChannel(channel, wsUrl || undefined);
          await AsyncStorage.setItem(CHANNEL_KEY, channel);
          if (wsUrl) await AsyncStorage.setItem(WS_URL_KEY, wsUrl);
        }
      } catch {}
    }

    function handleUrl(event: { url: string }) {
      try {
        let channel: string | null = null;
        let wsUrl: string | null = null;
        try {
          const url = new URL(event.url);
          channel = url.searchParams.get('figmaChannel');
          wsUrl = url.searchParams.get('figmaWsUrl');
        } catch {}
        if (channel) {
          startFigmaChannel(channel, wsUrl || undefined);
          AsyncStorage.setItem('figmaChannelCode', channel);
          if (wsUrl) AsyncStorage.setItem('figmaWsUrl', wsUrl);
        }
      } catch {}
    }

    const subscription = Linking.addEventListener('url', handleUrl);
    initFromDeepLinkOrCache();
    return () => subscription.remove();
  }, []);
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
