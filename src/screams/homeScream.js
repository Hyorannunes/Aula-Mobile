import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, Animated } from 'react-native';
import generatePassword from '../utils/generatePassword';
import { copyToClipboard } from '../services/clipboardService';
import Toast from '../components/Toast';

export default function HomeScream({ onNavigateToHistory, addToHistory }) {
	const [showImage, setShowImage] = useState(false);
	const [password, setPassword] = useState('GERE SUA SENHA');
	const [toastMessage, setToastMessage] = useState('');
	const toastAnim = useRef(new Animated.Value(0)).current; // 0 hidden, 1 visible
	const toastTimeoutRef = useRef(null);

		const handleCopy = async () => {
		if (!password) {
			showToast('Gere uma senha primeiro');
			return;
		}

		const ok = await copyToClipboard(password);
		showToast(ok ? 'Copiado' : 'Erro ao copiar');
	};

		const handleGenerate = () => {
			const pw = generatePassword();
			setPassword(pw);
			// save to app-level history if provided
			if (typeof addToHistory === 'function') addToHistory(pw);
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
		<View style={styles.container}>
			<StatusBar style="auto" />
			<Text style={styles.title}>Gerador de Senha</Text>
			<Image
				source={require('../../assets/senha.png')}
				style={styles.Image}
				resizeMode="contain"
			/>
			<View style={{ width: '100%', alignItems: 'center', marginTop: 20, gap: 10 }}>
				<Pressable style={styles.codeArea} onPress={() => setShowImage(!showImage)}>
					<Text style={[styles.codeAreaText, { color: 'black' }]}>{password || 'senha aqui'}</Text>
				</Pressable>
						<Pressable style={styles.Button} onPress={handleGenerate}>
							<Text style={styles.codeAreaText}>Gerar</Text>
						</Pressable>
						<Pressable style={styles.Button} onPress={handleCopy} disabled={!password}>
							<Text style={styles.codeAreaText}>Copiar</Text>
						</Pressable>
						<Pressable style={styles.Button} onPress={() => onNavigateToHistory && onNavigateToHistory()}>
							<Text style={styles.codeAreaText}>Ver Histórico</Text>
						</Pressable>
			</View>
			<Toast message={toastMessage} animatedValue={toastAnim} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#4169E1',
		textTransform: 'uppercase',
	},
	Image: {
		width: 260,
		height: 180,
		marginTop: 20,
	},
	codeArea: {
		backgroundColor: 'cyan',
		padding: 10,
		borderRadius: 4,
		marginTop: 20,
		borderWidth: 2,
		borderColor: 'black',
		width: '80%',
	},
	codeAreaText: {
		fontSize: 16,
		color: 'white',
		textTransform: 'uppercase',
		textAlign: 'center',
	},
	Button: {
		backgroundColor: '#4169E1',
		padding: 10,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: 'black',
		width: '80%',
	},
});
