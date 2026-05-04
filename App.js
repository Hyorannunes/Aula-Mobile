import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SigninScream from './src/screams/signinScream';
import SignupScream from './src/screams/signupScream';
import HomeScream from './src/screams/homeScream';
import HistoryScream from './src/screams/historyScream';
import * as authApi from './src/api/auth';
import * as passwordEntriesApi from './src/api/passwordEntries';
import { authTokenStorageKey } from './src/api/client';

export default function App() {
  const [screen, setScreen] = useState('signin');
  const [signinPrefillEmail, setSigninPrefillEmail] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [booting, setBooting] = useState(true);

  const persistToken = useCallback(async (token) => {
    if (token) await AsyncStorage.setItem(authTokenStorageKey, token);
    else await AsyncStorage.removeItem(authTokenStorageKey);
  }, []);

  const refreshHistory = useCallback(async () => {
    const items = await passwordEntriesApi.list();
    setHistoryData(items);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await AsyncStorage.getItem(authTokenStorageKey);
        if (!token) {
          if (!cancelled) setBooting(false);
          return;
        }
        await authApi.me();
        if (cancelled) return;
        await refreshHistory();
        if (!cancelled) setScreen('home');
      } catch {
        await persistToken(null);
        if (!cancelled) setScreen('signin');
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [persistToken, refreshHistory]);

  const handleSignIn = useCallback(
    async (email, senha) => {
      const { token } = await authApi.login({ email, senha });
      await persistToken(token);
      await refreshHistory();
      setScreen('home');
    },
    [persistToken, refreshHistory],
  );

  const handleRegister = useCallback(
    async ({ nome, email, senha }) => {
      const { token } = await authApi.register({ nome, email, senha });
      await persistToken(token);
      await refreshHistory();
      setScreen('home');
    },
    [persistToken, refreshHistory],
  );

  const handleLogout = useCallback(async () => {
    await persistToken(null);
    setHistoryData([]);
    setScreen('signin');
  }, [persistToken]);

  const addToHistory = useCallback(
    async (entry) => {
      if (!entry || !entry.value) return;
      await passwordEntriesApi.create({
        value: entry.value,
        purpose: entry.purpose,
      });
      await refreshHistory();
    },
    [refreshHistory],
  );

  const removeHistoryItemById = useCallback(
    async (id) => {
      await passwordEntriesApi.remove(id);
      await refreshHistory();
    },
    [refreshHistory],
  );

  if (booting) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 items-center justify-center bg-[#ededed]">
          <ActivityIndicator size="large" color="#4169E1" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {screen === 'signin' && (
        <SigninScream
          initialEmail={signinPrefillEmail}
          onSignIn={handleSignIn}
          onNavigateToSignup={() => {
            setSigninPrefillEmail('');
            setScreen('signup');
          }}
        />
      )}
      {screen === 'signup' && (
        <SignupScream
          onRegister={handleRegister}
          onVoltar={() => {
            setSigninPrefillEmail('');
            setScreen('signin');
          }}
        />
      )}
      {screen === 'home' && (
        <HomeScream
          onNavigateToHistory={() => setScreen('history')}
          addToHistory={addToHistory}
          onLogout={handleLogout}
        />
      )}
      {screen === 'history' && (
        <HistoryScream
          history={historyData}
          onBack={() => setScreen('home')}
          onRemoveItem={removeHistoryItemById}
        />
      )}
    </SafeAreaProvider>
  );
}
