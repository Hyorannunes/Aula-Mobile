# Demo — Gerador de senhas (Expo)

Aplicação React Native com Expo: fluxo de Sign in / Sign up (mock), gerador de senhas com modal para guardar entradas, histórico com cópia para a área de transferência e persistência local (AsyncStorage).

## Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado: versão LTS)
- [npm](https://www.npmjs.com/) (incluído com o Node)
- Para testar em dispositivo físico: app [Expo Go](https://expo.dev/go) (Android / iOS)
- Para emulador Android: Android Studio; para simulador iOS: Xcode (apenas em macOS)

## Como rodar o projeto

1. **Entrar na pasta do projeto** (raiz onde está o `package.json`):

   ```bash
   cd demo
   ```

2. **Instalar dependências**:

   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento Expo**:

   ```bash
   npm start
   ```

   Equivale a `npx expo start`. Abre o Metro Bundler no terminal e, em geral, uma página no browser.

4. **Abrir a app**:

   - **Telemóvel:** instala o Expo Go, lê o QR code que aparece no terminal ou na página (mesma rede Wi‑Fi que o PC).
   - **Emulador Android:** com o emulador aberto, no terminal do Expo pressiona `a` ou corre:

     ```bash
     npm run android
     ```

   - **Simulador iOS (macOS):** pressiona `i` ou corre:

     ```bash
     npm run ios
     ```

   - **Browser (web):** pressiona `w` ou corre:

     ```bash
     npm run web
     ```

5. **Limpar cache (opcional):** se algo parecer desatualizado (imagens, bundle):

   ```bash
   npx expo start -c
   ```

## Scripts

| Comando           | Descrição              |
|-------------------|------------------------|
| `npm start`       | Inicia o Expo (Metro)  |
| `npm run android` | Expo com alvo Android  |
| `npm run ios`     | Expo com alvo iOS      |
| `npm run web`     | Expo no browser        |

## Stack principal

- Expo ~55
- React Native 0.83
- `@react-native-async-storage/async-storage`, `expo-clipboard`, `react-native-safe-area-context`

## Licença

Ver `package.json` (campo `license`).
