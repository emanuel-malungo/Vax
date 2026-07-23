# Vax Mobile — Infraestrutura & Configuração (ISSUE-002)

Aplicação Mobile da plataforma **Vax**, desenvolvida com **React Native**, **Expo SDK 57**, **NativeWind v4** e **Firebase BaaS**.

---

## 🚀 Infraestrutura & Serviços Configuradas

### 1. 🔥 Firebase BaaS (`src/services/firebase/`)
- **Firebase Authentication** (`src/services/firebase/auth/`):
  - Autenticação por Email e Senha (`signInWithEmail`, `signUpWithEmail`)
  - Envio de e-mail para recuperação de palavra-passe (`sendPasswordReset`)
  - Verificação de e-mail (`sendEmailVerification`)
  - Gestão e renovação automática de tokens (`getIdToken`)
  - Persistência configurada via `@react-native-async-storage/async-storage` no mobile e `browserLocalPersistence` na web.
- **Cloud Firestore** (`src/services/firebase/firestore/`):
  - Mapeamento das coleções base: `users`, `campaigns`, `contributions`, `notifications`, `settings`, `logs`.
  - Utilitários padronizados para leitura, gravação, atualização, eliminação e consultas compostas.
- **App Check** (`src/services/firebase/appCheck.ts`):
  - Camada de proteção configurada e pronta para integração com Play Integrity / App Attest.

### 2. 🖼️ Cloudinary (`src/services/cloudinary/`)
- Armazenamento centralizado de imagens (Fotos de campanha, logos, comprovativos, perfis).
- Funções utilitárias: `uploadImage()`, `deleteImage()`, `updateImage()`.
- Transformações e otimizações automáticas (`f_auto,q_auto`).

### 3. 📧 Resend Email (`src/services/email/resend.ts`)
- Serviço de e-mails transacionais preparado (`sendTransactionalEmail()`) via REST API para notificações, convites e confirmações.

### 4. 📊 Sentry Monitoring & Logging (`src/services/monitoring/`, `src/utils/logger/`)
- Integrado via `@sentry/react-native`.
- Serviço unificado `Logger` (`debug`, `info`, `warn`, `error`) que direciona logs para o console em desenvolvimento e reporta exceções e erros críticos para o Sentry em produção.

### 5. ⚠️ Tratamento Padronizado de Erros (`src/utils/errors/AppError.ts`)
- Classe `AppError` com códigos estruturados (`ErrorCode`), status HTTP, mensagens amigáveis ao utilizador e tratamento de erros do Firebase.

---

## 🔒 Segurança & Índices do Firestore

- **Regras de Segurança** (`firestore.rules`):
  - Princípio do Menor Privilégio (*Deny All por padrão*).
  - Acesso de leitura/escrita condicionado ao utilizador autenticado e dono do recurso.
- **Índices Compostos** (`firestore.indexes.json`):
  - Estrutura inicial configurada para consultas ordenadas em campanhas, contribuições e notificações.

---

## 🔑 Variáveis de Ambiente (`.env`)

As credenciais estão centralizadas e validadas através de `src/config/env.ts` usando o schema `zod`.

Copie o ficheiro `.env.example` para `.env`:

```bash
cp .env.example .env
```

Variações de ambiente disponíveis:
- `.env.development` (Desenvolvimento)
- `.env.production` (Produção)

Variáveis obrigatórias:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
EXPO_PUBLIC_RESEND_API_KEY=
EXPO_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_APP_ENV=development
```

---

## 🛠️ Como Executar o Projeto

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Verificar os tipos TypeScript**:
   ```bash
   npx tsc --noEmit
   ```

3. **Iniciar o servidor de desenvolvimento Expo**:
   ```bash
   npm run start
   ```

4. **Executar em plataformas específicas**:
   - Android: `npm run android`
   - iOS: `npm run ios`
   - Web: `npm run web`
