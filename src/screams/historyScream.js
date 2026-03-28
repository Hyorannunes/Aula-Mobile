import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';

export default function HistoryScream({ history = [], onBack, onClear }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HISTÓRICO DE SENHAS</Text>
      <ScrollView style={styles.list} contentContainerStyle={{ padding: 12 }}>
        {history.length === 0 && <Text>Nenhuma senha gerada ainda.</Text>}
        {history.map((item, idx) => (
          <View key={idx} style={styles.item}>
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.row}>
        <Button title="Voltar" onPress={onBack} />
        <View style={{ width: 12 }} />
        <Button title="Limpar histórico" onPress={onClear} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  list: { width: '100%' },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  value: { fontSize: 16, fontWeight: '600' },
  date: { fontSize: 12, color: '#666', marginTop: 4 },
  row: { flexDirection: 'row', margin: 12 },
});
