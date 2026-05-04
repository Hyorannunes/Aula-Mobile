import React, { useState, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { copyToClipboard } from '../services/clipboardService';
import Toast from '../components/Toast';

function maskPassword(value) {
  if (!value) return '********';
  return '*'.repeat(Math.min(Math.max(value.length, 8), 32));
}

export default function HistoryScream({ history = [], onBack, onRemoveItem }) {
  const [revealedByKey, setRevealedByKey] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef(null);

  const itemKey = (item, index) => item.id ?? `${item.createdAt ?? ''}_${index}`;

  const toggleReveal = (key) => {
    setRevealedByKey((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToastMessage(message);
    Animated.timing(toastAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    toastTimeoutRef.current = setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setToastMessage(''));
      toastTimeoutRef.current = null;
    }, 1400);
  };

  const handleCopy = async (value) => {
    const ok = await copyToClipboard(value);
    showToast(ok ? 'Copiado' : 'Erro ao copiar');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#ececec]" edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between border-b border-neutral-300 bg-white px-2 py-2.5">
        <Pressable
          className="min-w-[44px] justify-center"
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text className="text-[22px] font-semibold text-black">←</Text>
        </Pressable>
        <Text className="flex-1 text-center text-base font-semibold text-black">Históricos de senhas</Text>
        <View className="min-w-[44px] justify-center" />
      </View>

      <Text className="mx-4 mb-3.5 mt-4 text-center text-xl font-extrabold uppercase text-[#4169E1]">
        HISTÓRICO DE SENHAS
      </Text>

      <ScrollView
        className="w-full flex-1"
        contentContainerClassName="px-4 pb-4"
        showsVerticalScrollIndicator={false}
      >
        {history.length === 0 && (
          <Text className="mt-8 text-center text-[15px] text-neutral-600">Nenhuma senha salva ainda.</Text>
        )}
        {history.map((item, index) => {
          const key = itemKey(item, index);
          const revealed = !!revealedByKey[key];
          const passwordDisplay = revealed ? item.value : maskPassword(item.value);

          return (
            <View key={key} className="mb-3 rounded-[10px] border border-black bg-white px-3.5 py-3.5">
              <Text className="mb-3 text-[17px] font-bold text-black">{item.purpose || '—'}</Text>
              <View className="flex-row items-center justify-between gap-2">
                <Text
                  className="flex-1 text-base font-semibold tracking-wide text-[#111]"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {passwordDisplay}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Pressable
                    className="p-1"
                    onPress={() => toggleReveal(key)}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={revealed ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <Text className="text-[22px]">{revealed ? '🙈' : '👁'}</Text>
                  </Pressable>
                  <Pressable
                    className="p-1"
                    onPress={() => handleCopy(item.value)}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Copiar senha"
                  >
                    <Text className="text-[22px]">📋</Text>
                  </Pressable>
                  <Pressable
                    className="p-1"
                    onPress={() => item.id && onRemoveItem && onRemoveItem(item.id)}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Excluir senha"
                  >
                    <Text className="text-[22px]">🗑️</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View className="items-center bg-[#ececec] px-4 py-4 pb-5">
        <Pressable
          className="rounded-lg bg-[#4169E1] px-12 py-3.5 shadow-md shadow-black/20"
          style={{ elevation: 4 }}
          onPress={onBack}
        >
          <Text className="text-center text-[15px] font-extrabold uppercase text-white">VOLTAR</Text>
        </Pressable>
      </View>

      <Toast message={toastMessage} animatedValue={toastAnim} />
    </SafeAreaView>
  );
}
