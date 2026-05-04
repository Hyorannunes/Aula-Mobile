import React, { useState, useRef } from 'react';
import { Text, View, Image, Pressable, Animated, TextInput, Modal, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import generatePassword from '../utils/generatePassword';
import { copyToClipboard } from '../services/clipboardService';
import Toast from '../components/Toast';

const PLACEHOLDER_PASSWORD = 'GERE SUA SENHA';

export default function HomeScream({ onNavigateToHistory, addToHistory, onLogout }) {
  const [password, setPassword] = useState(PLACEHOLDER_PASSWORD);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAppName, setModalAppName] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimeoutRef = useRef(null);

  const hasRealPassword = password && password !== PLACEHOLDER_PASSWORD;
  const modalCanCreate = modalAppName.trim().length > 0 && hasRealPassword;

  const handleCopy = async () => {
    if (!hasRealPassword) {
      showToast('Gere uma senha primeiro');
      return;
    }
    const ok = await copyToClipboard(password);
    showToast(ok ? 'Copiado' : 'Erro ao copiar');
  };

  const handleGenerate = () => {
    const pw = generatePassword();
    setPassword(pw);
  };

  const openSaveModal = () => {
    if (!hasRealPassword) return;
    setModalAppName('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalAppName('');
  };

  const handleModalCreate = async () => {
    if (!modalCanCreate) return;
    try {
      if (typeof addToHistory === 'function') {
        await addToHistory({ value: password, purpose: modalAppName.trim() });
      }
      closeModal();
      showToast('Senha salva');
    } catch {
      showToast('Erro ao salvar no servidor');
    }
  };

  function showToast(message) {
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
      }).start(() => {
        setToastMessage('');
      });
      toastTimeoutRef.current = null;
    }, 1600);
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between border-b border-neutral-300 bg-white px-3 py-2.5">
        <Pressable className="min-w-[56px]" onPress={() => onLogout && onLogout()} hitSlop={12}>
          <Text className="text-[22px] font-semibold text-black">←</Text>
        </Pressable>
        <Text className="text-[17px] font-semibold text-black">Home</Text>
        <Pressable className="min-w-[56px]" onPress={() => onLogout && onLogout()} hitSlop={12}>
          <Text className="text-right text-[15px] font-medium text-black">Sair</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerClassName="items-center px-5 pb-8 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-3 text-center text-[22px] font-extrabold uppercase text-[#1e3a5f]">
          GERADOR DE SENHA
        </Text>
        <Image
          source={require('../../assets/senha.png')}
          className="mt-2 h-[180px] w-[260px]"
          resizeMode="contain"
        />

        <Pressable className="mt-5 w-full max-w-[360px] rounded-md border-2 border-black bg-[#bfe5ff] px-3 py-3.5">
          <Text className="text-center text-base font-semibold text-black">{password}</Text>
        </Pressable>

        <View className="mt-5 w-full max-w-[360px] gap-3">
          <Pressable
            className="items-center rounded-md border border-black bg-[#4A80C0] py-3.5"
            onPress={handleGenerate}
          >
            <Text className="text-base font-bold uppercase text-white">Gerar</Text>
          </Pressable>
          <Pressable
            className={`items-center rounded-md border border-black bg-[#4A80C0] py-3.5 ${
              !hasRealPassword ? 'opacity-40' : ''
            }`}
            onPress={openSaveModal}
            disabled={!hasRealPassword}
          >
            <Text className="text-base font-bold uppercase text-white">Salvar</Text>
          </Pressable>
          <Pressable
            className={`items-center rounded-md border border-black bg-[#4A80C0] py-3.5 ${
              !hasRealPassword ? 'opacity-40' : ''
            }`}
            onPress={handleCopy}
            disabled={!hasRealPassword}
          >
            <Text className="text-base font-bold uppercase text-white">Copiar</Text>
          </Pressable>
        </View>

        <Pressable className="mt-7 py-2" onPress={() => onNavigateToHistory && onNavigateToHistory()}>
          <Text className="text-center text-[15px] font-semibold text-[#4169E1] underline">Ver Senhas</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <View className="flex-1 items-center justify-center bg-black/55 p-6">
          <View className="w-full max-w-[340px] rounded-xl border border-neutral-300 bg-white p-6">
            <Text className="mb-5 text-center text-[17px] font-extrabold uppercase text-black">
              CADASTRO DE SENHA
            </Text>

            <View className="mb-4 w-full">
              <Text className="mb-2 text-sm font-semibold text-black">Nome do aplicativo</Text>
              <TextInput
                className="min-h-12 w-full rounded-md border border-black bg-white px-3 text-base text-black"
                value={modalAppName}
                onChangeText={setModalAppName}
                placeholder=""
                autoCapitalize="sentences"
              />
            </View>

            <View className="mb-4 w-full">
              <Text className="mb-2 text-sm font-semibold text-black">Senha gerada</Text>
              <TextInput
                className="min-h-12 w-full rounded-md border border-black bg-neutral-100 px-3 text-base text-[#333]"
                value={hasRealPassword ? password : ''}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>

            <Pressable
              className={`mt-2 w-full items-center rounded-lg bg-[#4A80C0] py-3 ${
                !modalCanCreate ? 'opacity-45' : ''
              }`}
              onPress={handleModalCreate}
              disabled={!modalCanCreate}
            >
              <Text className="text-[15px] font-bold uppercase text-white">CRIAR</Text>
            </Pressable>
            <Pressable className="mt-2 w-full items-center rounded-lg bg-[#4A80C0] py-3" onPress={closeModal}>
              <Text className="text-[15px] font-bold uppercase text-white">CANCELAR</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Toast message={toastMessage} animatedValue={toastAnim} />
    </SafeAreaView>
  );
}
