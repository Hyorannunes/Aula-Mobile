import React, { useState, useEffect } from 'react';
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

export default function SigninScream({ onSignIn, onNavigateToSignup, initialEmail = '' }) {
	const [email, setEmail] = useState(initialEmail || '');
	const [senha, setSenha] = useState('');
	const canSubmit = email.trim().length > 0 && senha.length > 0;

	useEffect(() => {
		setEmail(initialEmail || '');
	}, [initialEmail]);

	return (
		<SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
			<StatusBar style="dark" />
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Signin</Text>
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
					<Text style={styles.screenTitle}>SIGN IN</Text>

					<View style={styles.fieldBlock}>
						<Text style={styles.label}>Email</Text>
						<TextInput
							style={styles.input}
							value={email}
							onChangeText={setEmail}
							placeholder=""
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

					<View style={styles.afterFields}>
						<Pressable
							style={[styles.enterBtn, canSubmit && styles.enterBtnActive]}
							disabled={!canSubmit}
							onPress={() => canSubmit && onSignIn && onSignIn()}
						>
							<Text style={[styles.enterBtnText, canSubmit && styles.enterBtnTextActive]}>
								ENTRAR
							</Text>
						</Pressable>

						<Text style={styles.footerLine}>
							Não possui conta ainda?{' '}
							<Text
								style={styles.footerLink}
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

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: '#ededed',
	},
	header: {
		backgroundColor: '#fff',
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#ddd',
	},
	headerTitle: {
		fontSize: 17,
		color: '#000',
		fontWeight: '700',
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
	enterBtn: {
		minWidth: 108,
		paddingVertical: 10,
		paddingHorizontal: 22,
		backgroundColor: '#CCCCCC',
		borderWidth: 1,
		borderColor: '#000',
		alignItems: 'center',
		justifyContent: 'center',
	},
	enterBtnActive: {
		backgroundColor: '#4169E1',
	},
	enterBtnText: {
		fontSize: 15,
		fontWeight: '700',
		color: '#888',
		textTransform: 'uppercase',
	},
	enterBtnTextActive: {
		color: '#fff',
	},
	footerLine: {
		marginTop: 6,
		fontSize: 13,
		color: '#333',
		textAlign: 'center',
		lineHeight: 18,
	},
	footerLink: {
		fontSize: 13,
		color: '#4169E1',
		fontWeight: '600',
	},
});
