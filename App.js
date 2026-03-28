import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SigninScream from './src/screams/signinScream';
import SignupScream from './src/screams/signupScream';
import HomeScream from './src/screams/homeScream';
import HistoryScream from './src/screams/historyScream';

const HISTORY_STORAGE_KEY = '@demo/password_history_v1';

export default function App() {
  const [screen, setScreen] = useState('signin'); // 'signin' | 'signup' | 'home' | 'history'
  const [signinPrefillEmail, setSigninPrefillEmail] = useState('');

  const [historyData, setHistoryData] = useState([]);
  const [historyReady, setHistoryReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (raw && !cancelled) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setHistoryData(parsed);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setHistoryReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!historyReady) return;
    AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyData)).catch(() => {});
  }, [historyData, historyReady]);

  const addToHistory = (entry) => {
    if (!entry || !entry.value) return;
    setHistoryData((prev) => [
      {
        value: entry.value,
        purpose: entry.purpose != null && String(entry.purpose).trim() !== '' ? String(entry.purpose).trim() : '—',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const removeHistoryItemAt = (index) => {
    setHistoryData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaProvider>
      {screen === 'signin' && (
        <SigninScream
          initialEmail={signinPrefillEmail}
          onSignIn={() => setScreen('home')}
          onNavigateToSignup={() => {
            setSigninPrefillEmail('');
            setScreen('signup');
          }}
        />
      )}
      {screen === 'signup' && (
        <SignupScream
          onRegister={(email) => {
            setSigninPrefillEmail(email);
            setScreen('signin');
          }}
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
          onLogout={() => setScreen('signin')}
        />
      )}
      {screen === 'history' && (
        <HistoryScream
          history={historyData}
          onBack={() => setScreen('home')}
          onRemoveItem={removeHistoryItemAt}
        />
      )}
    </SafeAreaProvider>
  );
}
