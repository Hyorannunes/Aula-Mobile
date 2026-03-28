import React, { useState } from 'react';
import HomeScream from './src/screams/homeScream';
import HistoryScream from './src/screams/historyScream';

export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'history'
  const [historyData, setHistoryData] = useState([]);

  const addToHistory = (password) => {
    if (!password) return;
    setHistoryData(prev => [{ value: password, createdAt: new Date().toISOString() }, ...prev]);
  };

  return (
    screen === 'home' ? (
      <HomeScream
        onNavigateToHistory={() => setScreen('history')}
        addToHistory={addToHistory}
      />
    ) : (
      <HistoryScream
        history={historyData}
        onBack={() => setScreen('home')}
        onClear={() => setHistoryData([])}
      />
    )
  );
}
