import React, { useState } from 'react';
import { Text, View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getApiErrorMessage } from '../api/client';

export default function SignupScream({ onRegister, onVoltar }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordsMatch = senha.length > 0 && senha === confirmar;
  const allFilled =
    nome.trim().length > 0 &&
    email.trim().length > 0 &&
    senha.length > 0 &&
    confirmar.length > 0;
  const canSubmit = allFilled && passwordsMatch && !loading;

  return (
    <SafeAreaView className="flex-1 bg-[#ededed]" edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View className="border-b border-neutral-300 bg-white px-3 py-3">
        <Pressable
          className="flex-row items-center gap-2"
          onPress={() => onVoltar && onVoltar()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text className="pr-1 text-[22px] font-semibold text-black">←</Text>
          <Text className="text-[17px] font-normal text-black">Signup</Text>
        </Pressable>
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6 pb-8 pt-9"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="mb-10 w-full text-center text-[28px] font-bold uppercase text-[#4169E1]">
            SIGN UP
          </Text>

          <View className="mb-5 w-full max-w-[400px] self-center">
            <Text className="mb-2 self-start text-[15px] text-black">Nome</Text>
            <TextInput
              className="min-h-12 w-full rounded-sm border border-black bg-[#80CFFF] px-3 text-base text-black"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

          <View className="mb-5 w-full max-w-[400px] self-center">
            <Text className="mb-2 self-start text-[15px] text-black">Email</Text>
            <TextInput
              className="min-h-12 w-full rounded-sm border border-black bg-[#80CFFF] px-3 text-base text-black"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="mb-5 w-full max-w-[400px] self-center">
            <Text className="mb-2 self-start text-[15px] text-black">Senha</Text>
            <TextInput
              className="min-h-12 w-full rounded-sm border border-black bg-[#80CFFF] px-3 text-base text-black"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View className="mb-5 w-full max-w-[400px] self-center">
            <Text className="mb-2 self-start text-[15px] text-black">Confirmar Senha</Text>
            <TextInput
              className="min-h-12 w-full rounded-sm border border-black bg-[#80CFFF] px-3 text-base text-black"
              value={confirmar}
              onChangeText={setConfirmar}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {error ? (
            <Text className="mb-3 w-full max-w-[400px] self-center text-center text-sm text-[#b00020]">
              {error}
            </Text>
          ) : null}

          <View className="mt-2 w-full max-w-[400px] self-center items-center">
            <Pressable
              className={`min-w-[120px] items-center justify-center border border-black bg-[#CCCCCC] px-6 py-2.5 ${
                !canSubmit ? 'opacity-45' : ''
              }`}
              disabled={!canSubmit}
              onPress={async () => {
                if (!canSubmit || !onRegister) return;
                setError('');
                setLoading(true);
                try {
                  await onRegister({
                    nome: nome.trim(),
                    email: email.trim(),
                    senha,
                  });
                } catch (e) {
                  setError(getApiErrorMessage(e, 'Não foi possível registrar'));
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Text
                className={`text-[15px] font-bold uppercase ${canSubmit ? 'text-[#444]' : 'text-[#666]'}`}
              >
                {loading ? 'AGUARDE…' : 'REGISTRAR'}
              </Text>
            </Pressable>

            <Pressable onPress={() => onVoltar && onVoltar()} hitSlop={10}>
              <Text className="mt-2.5 text-center text-[13px] text-black">Voltar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
