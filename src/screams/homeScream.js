import React, { useState, useRef } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Pressable,
	Animated,
	TextInput,
	Modal,
	ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import generatePassword from '../utils/generatePassword';
import { copyToClipboard } from '../services/clipboardService';
import Toast from '../components/Toast';

const PLACEHOLDER_PASSWORD = 'GERE SUA SENHA';

export default function HomeScream({ onNavigateToHistory, addToHistory, onLogout }) {
	const [showImage, setShowImage] = useState(false);
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

	const handleModalCreate = () => {
		if (!modalCanCreate) return;
		if (typeof addToHistory === 'function') {
			addToHistory({ value: password, purpose: modalAppName.trim() });
		}
		closeModal();
		showToast('Senha salva');
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
		<SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
			<StatusBar style="dark" />
			<View style={styles.topBar}>
				<Pressable style={styles.topBarSide} onPress={() => onLogout && onLogout()} hitSlop={12}>
					<Text style={styles.backArrow}>←</Text>
				</Pressable>
				<Text style={styles.topBarTitle}>Home</Text>
				<Pressable style={styles.topBarSide} onPress={() => onLogout && onLogout()} hitSlop={12}>
					<Text style={styles.sairText}>Sair</Text>
				</Pressable>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollInner}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<Text style={styles.mainTitle}>GERADOR DE SENHA</Text>
				<Image
					source={require('../../assets/senha.png')}
					style={styles.heroImage}
					resizeMode="contain"
				/>

				<Pressable style={styles.codeArea} onPress={() => setShowImage(!showImage)}>
					<Text style={styles.codeAreaText}>{password}</Text>
				</Pressable>

				<View style={styles.actions}>
					<Pressable style={styles.navyBtn} onPress={handleGenerate}>
						<Text style={styles.navyBtnText}>Gerar</Text>
					</Pressable>
					<Pressable
						style={[styles.navyBtn, !hasRealPassword && styles.navyBtnDisabled]}
						onPress={openSaveModal}
						disabled={!hasRealPassword}
					>
						<Text style={styles.navyBtnText}>Salvar</Text>
					</Pressable>
					<Pressable
						style={[styles.navyBtn, !hasRealPassword && styles.navyBtnDisabled]}
						onPress={handleCopy}
						disabled={!hasRealPassword}
					>
						<Text style={styles.navyBtnText}>Copiar</Text>
					</Pressable>
				</View>

				<Pressable style={styles.linkSenhas} onPress={() => onNavigateToHistory && onNavigateToHistory()}>
					<Text style={styles.linkSenhasText}>Ver Senhas</Text>
				</Pressable>
			</ScrollView>

			<Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalCard}>
						<Text style={styles.modalTitle}>CADASTRO DE SENHA</Text>

						<View style={styles.modalField}>
							<Text style={styles.modalLabel}>Nome do aplicativo</Text>
							<TextInput
								style={styles.modalInput}
								value={modalAppName}
								onChangeText={setModalAppName}
								placeholder=""
								autoCapitalize="sentences"
							/>
						</View>

						<View style={styles.modalField}>
							<Text style={styles.modalLabel}>Senha gerada</Text>
							<TextInput
								style={[styles.modalInput, styles.modalInputReadonly]}
								value={hasRealPassword ? password : ''}
								editable={false}
								selectTextOnFocus={false}
							/>
						</View>

						<Pressable
							style={[styles.modalPrimaryBtn, !modalCanCreate && styles.modalPrimaryBtnDisabled]}
							onPress={handleModalCreate}
							disabled={!modalCanCreate}
						>
							<Text style={styles.modalPrimaryBtnText}>CRIAR</Text>
						</Pressable>
						<Pressable style={styles.modalPrimaryBtn} onPress={closeModal}>
							<Text style={styles.modalPrimaryBtnText}>CANCELAR</Text>
						</Pressable>
					</View>
				</View>
			</Modal>

			<Toast message={toastMessage} animatedValue={toastAnim} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: '#fff',
	},
	topBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingVertical: 10,
		backgroundColor: '#fff',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#ddd',
	},
	topBarSide: {
		minWidth: 56,
	},
	backArrow: {
		fontSize: 22,
		color: '#000',
		fontWeight: '600',
	},
	topBarTitle: {
		fontSize: 17,
		fontWeight: '600',
		color: '#000',
	},
	sairText: {
		fontSize: 15,
		color: '#000',
		textAlign: 'right',
		fontWeight: '500',
	},
	scrollInner: {
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingBottom: 32,
		paddingTop: 16,
	},
	mainTitle: {
		fontSize: 22,
		fontWeight: '800',
		color: '#1e3a5f',
		textTransform: 'uppercase',
		textAlign: 'center',
		marginBottom: 12,
	},
	heroImage: {
		width: 260,
		height: 180,
		marginTop: 8,
	},
	codeArea: {
		backgroundColor: '#bfe5ff',
		paddingVertical: 14,
		paddingHorizontal: 12,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: '#000',
		width: '100%',
		maxWidth: 360,
		marginTop: 20,
	},
	codeAreaText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000',
		textAlign: 'center',
	},
	actions: {
		width: '100%',
		maxWidth: 360,
		marginTop: 20,
		gap: 12,
	},
	navyBtn: {
		backgroundColor: '#4A80C0',
		paddingVertical: 14,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#000',
		alignItems: 'center',
	},
	navyBtnDisabled: {
		opacity: 0.4,
	},
	navyBtnText: {
		fontSize: 16,
		fontWeight: '700',
		color: '#fff',
		textTransform: 'uppercase',
	},
	linkSenhas: {
		marginTop: 28,
		paddingVertical: 8,
	},
	linkSenhasText: {
		fontSize: 15,
		color: '#4169E1',
		fontWeight: '600',
		textDecorationLine: 'underline',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.55)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	modalCard: {
		width: '100%',
		maxWidth: 340,
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 24,
		borderWidth: 1,
		borderColor: '#ccc',
	},
	modalTitle: {
		fontSize: 17,
		fontWeight: '800',
		color: '#000',
		textTransform: 'uppercase',
		textAlign: 'center',
		marginBottom: 22,
	},
	modalField: {
		width: '100%',
		marginBottom: 18,
	},
	modalLabel: {
		fontSize: 14,
		color: '#000',
		marginBottom: 8,
		fontWeight: '600',
	},
	modalInput: {
		width: '100%',
		minHeight: 48,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#000',
		borderRadius: 6,
		paddingHorizontal: 12,
		fontSize: 16,
		color: '#000',
	},
	modalInputReadonly: {
		backgroundColor: '#f0f0f0',
		color: '#333',
	},
	modalPrimaryBtn: {
		width: '100%',
		backgroundColor: '#4A80C0',
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 10,
	},
	modalPrimaryBtnDisabled: {
		opacity: 0.45,
	},
	modalPrimaryBtnText: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 15,
		textTransform: 'uppercase',
	},
});
