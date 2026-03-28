import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
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

  const itemKey = (item, index) => `${item.createdAt ?? ''}_${index}`;

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
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View style={styles.headerBar}>
        <Pressable style={styles.headerSide} onPress={onBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar">
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Históricos de senhas</Text>
        <View style={styles.headerSide} />
      </View>

      <Text style={styles.pageTitle}>HISTÓRICO DE SENHAS</Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {history.length === 0 && (
          <Text style={styles.empty}>Nenhuma senha salva ainda.</Text>
        )}
        {history.map((item, index) => {
          const key = itemKey(item, index);
          const revealed = !!revealedByKey[key];
          const passwordDisplay = revealed ? item.value : maskPassword(item.value);

          return (
            <View key={key} style={styles.card}>
              <Text style={styles.cardApp}>{item.purpose || '—'}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.cardPassword} numberOfLines={1} ellipsizeMode="tail">
                  {passwordDisplay}
                </Text>
                <View style={styles.iconRow}>
                  <Pressable
                    style={styles.iconHit}
                    onPress={() => toggleReveal(key)}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={revealed ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <Text style={styles.iconGlyph}>{revealed ? '🙈' : '👁'}</Text>
                  </Pressable>
                  <Pressable
                    style={styles.iconHit}
                    onPress={() => handleCopy(item.value)}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Copiar senha"
                  >
                    <Text style={styles.iconGlyph}>📋</Text>
                  </Pressable>
                  <Pressable
                    style={styles.iconHit}
                    onPress={() => onRemoveItem && onRemoveItem(index)}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Excluir senha"
                  >
                    <Text style={styles.iconGlyph}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.voltarBtn} onPress={onBack}>
          <Text style={styles.voltarBtnText}>VOLTAR</Text>
        </Pressable>
      </View>

      <Toast message={toastMessage} animatedValue={toastAnim} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ececec',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerSide: {
    minWidth: 44,
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4169E1',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  empty: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  cardApp: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardPassword: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    letterSpacing: 1,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconHit: {
    padding: 4,
  },
  iconGlyph: {
    fontSize: 22,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#ececec',
  },
  voltarBtn: {
    backgroundColor: '#4169E1',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  voltarBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    textTransform: 'uppercase',
  },
});
