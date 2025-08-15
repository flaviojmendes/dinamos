# Frontend


## Pré Requisitos

Para executar esse projeto, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

## Configurações

Este projeto requer configuração de variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Firebase Cloud Functions
VITE_FIREBASE_FUNCTIONS_BASE_URL=https://us-central1-your-project.cloudfunctions.net

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_ONEOFF_PRICE_ID=price_your_stripe_price_id
```

## Personalização


## Como rodar

Primeiro, instale as dependências:

```bash
yarn
```

Depois, rode o servidor em modo de desenvolvimento:

```bash
yarn dev
```

## Como rodar com Docker
