import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SignupScream({ onRegister, onVoltar }) {
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [confirmar, setConfirmar] = useState('');

	const passwordsMatch = senha.length > 0 && senha === confirmar;
	const allFilled =
		nome.trim().length > 0 &&
		email.trim().length > 0 &&
		senha.length > 0 &&
		confirmar.length > 0;
	const canSubmit = allFilled && passwordsMatch;

	return (
		<SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
			<StatusBar style="dark" />
			<View style={styles.header}>
				<Pressable
					style={styles.headerRow}
					onPress={() => onVoltar && onVoltar()}
					hitSlop={12}
					accessibilityRole="button"
					accessibilityLabel="Voltar"
				>
					<Text style={styles.backArrow}>←</Text>
					<Text style={styles.headerTitle}>Signup</Text>
				</Pressable>
			</View>
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<Text style={styles.screenTitle}>SIGN UP</Text>

					<View style={styles.fieldBlock}>
						<Text style={styles.label}>Nome</Text>
						<TextInput
							style={styles.input}
							value={nome}
							onChangeText={setNome}
							autoCapitalize="words"
						/>
					</View>

					<View style={styles.fieldBlock}>
						<Text style={styles.label}>Email</Text>
						<TextInput
							style={styles.input}
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
						/>
					</View>

					<View style={styles.fieldBlock}>
						<Text style={styles.label}>Senha</Text>
						<TextInput
							style={styles.input}
							value={senha}
							onChangeText={setSenha}
							secureTextEntry
							autoCapitalize="none"
						/>
					</View>

					<View style={styles.fieldBlock}>
						<Text style={styles.label}>Confirmar Senha</Text>
						<TextInput
							style={styles.input}
							value={confirmar}
							onChangeText={setConfirmar}
							secureTextEntry
							autoCapitalize="none"
						/>
					</View>

					<View style={styles.afterFields}>
						<Pressable
							style={[styles.registerBtn, !canSubmit && styles.registerBtnDisabled]}
							disabled={!canSubmit}
							onPress={() => canSubmit && onRegister && onRegister(email.trim())}
						>
							<Text style={[styles.registerBtnText, !canSubmit && styles.registerBtnTextDisabled]}>
								REGISTRAR
							</Text>
						</Pressable>

						<Pressable onPress={() => onVoltar && onVoltar()} hitSlop={10}>
							<Text style={styles.voltarLink}>Voltar</Text>
						</Pressable>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: '#ededed',
	},
	header: {
		backgroundColor: '#fff',
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#ddd',
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	backArrow: {
		fontSize: 22,
		color: '#000',
		fontWeight: '600',
		paddingRight: 4,
	},
	headerTitle: {
		fontSize: 17,
		color: '#000',
		fontWeight: '400',
	},
	flex: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 36,
		paddingBottom: 32,
	},
	screenTitle: {
		fontSize: 28,
		fontWeight: '700',
		color: '#4169E1',
		textTransform: 'uppercase',
		marginBottom: 40,
		width: '100%',
		textAlign: 'center',
	},
	fieldBlock: {
		width: '100%',
		maxWidth: 400,
		alignSelf: 'center',
		marginBottom: 22,
	},
	label: {
		fontSize: 15,
		color: '#000',
		marginBottom: 8,
		alignSelf: 'flex-start',
	},
	input: {
		width: '100%',
		minHeight: 48,
		backgroundColor: '#80CFFF',
		borderWidth: 1,
		borderColor: '#000',
		borderRadius: 3,
		paddingHorizontal: 12,
		fontSize: 16,
		color: '#000',
	},
	afterFields: {
		width: '100%',
		maxWidth: 400,
		alignSelf: 'center',
		alignItems: 'center',
		marginTop: 8,
	},
	registerBtn: {
		minWidth: 120,
		paddingVertical: 10,
		paddingHorizontal: 24,
		backgroundColor: '#CCCCCC',
		borderWidth: 1,
		borderColor: '#000',
		alignItems: 'center',
		justifyContent: 'center',
	},
	registerBtnDisabled: {
		opacity: 0.45,
	},
	registerBtnText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#444',
		textTransform: 'uppercase',
	},
	registerBtnTextDisabled: {
		color: '#666',
	},
	voltarLink: {
		marginTop: 10,
		fontSize: 13,
		color: '#000',
		textAlign: 'center',
	},
});
