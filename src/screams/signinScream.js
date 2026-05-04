import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getApiErrorMessage } from '../api/client';

export default function SigninScream({ onSignIn, onNavigateToSignup, initialEmail = '' }) {
  const [email, setEmail] = useState(initialEmail || '');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canSubmit = email.trim().length > 0 && senha.length > 0 && !loading;

  useEffect(() => {
    setEmail(initialEmail || '');
  }, [initialEmail]);

  return (
    <SafeAreaView className="flex-1 bg-[#ededed]" edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View className="border-b border-neutral-300 bg-white px-4 py-3.5">
        <Text className="text-[17px] font-bold text-black">Signin</Text>
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
            SIGN IN
          </Text>

          <View className="mb-5 w-full max-w-[400px] self-center">
            <Text className="mb-2 self-start text-[15px] text-black">Email</Text>
            <TextInput
              className="min-h-12 w-full border border-black bg-[#80CFFF] px-3 text-base text-black"
              value={email}
              onChangeText={setEmail}
              placeholder=""
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="mb-5 w-full max-w-[400px] self-center">
            <Text className="mb-2 self-start text-[15px] text-black">Senha</Text>
            <TextInput
              className="min-h-12 w-full border border-black bg-[#80CFFF] px-3 text-base text-black"
              value={senha}
              onChangeText={setSenha}
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
              className={`min-w-[108px] items-center justify-center border border-black px-5 py-2.5 ${
                canSubmit ? 'bg-[#4169E1]' : 'bg-[#CCCCCC]'
              }`}
              disabled={!canSubmit}
              onPress={async () => {
                if (!canSubmit || !onSignIn) return;
                setError('');
                setLoading(true);
                try {
                  await onSignIn(email.trim(), senha);
                } catch (e) {
                  setError(getApiErrorMessage(e, 'Não foi possível entrar'));
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Text
                className={`text-[15px] font-bold uppercase ${canSubmit ? 'text-white' : 'text-[#888]'}`}
              >
                {loading ? 'AGUARDE…' : 'ENTRAR'}
              </Text>
            </Pressable>

            <Text className="mt-1.5 text-center text-[13px] leading-[18px] text-[#333]">
              Não possui conta ainda?{' '}
              <Text
                className="text-[13px] font-semibold text-[#4169E1]"
                onPress={() => onNavigateToSignup && onNavigateToSignup()}
              >
                Crie agora
              </Text>
              .
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
