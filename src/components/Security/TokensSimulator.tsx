import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DecodedToken {
  header: any;
  payload: any;
  signature: string;
}

export default function TokensSimulator() {
  const [user, setUser] = useState<User>({
    id: '123456',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    role: 'user'
  });

  const [customClaims, setCustomClaims] = useState<Record<string, string>>({});
  const [token, setToken] = useState<string>('');
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [expirationTime, setExpirationTime] = useState<number>(3600); // 1 hour in seconds
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('HS256');
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  // Generate token function (moved outside to be reusable)
  const generateToken = () => {
    const header = {
      alg: selectedAlgorithm,
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      iat: now,
      exp: now + expirationTime,
      ...customClaims
    };

    const signature = 'simulated_signature_' + Math.random().toString(36).substring(7);
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    const newToken = `${encodedHeader}.${encodedPayload}.${signature}`;
    setToken(newToken);
    setDecodedToken({ header, payload, signature });
    setVerificationResult(null);
  };

  // Effect to update token when any input changes
  useEffect(() => {
    generateToken();
  }, [user, customClaims, expirationTime, selectedAlgorithm]);

  // Update user information with real-time token generation
  const updateUser = (field: keyof User, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  // Add custom claim with real-time token generation
  const addCustomClaim = (key: string, value: string) => {
    if (key && value) {
      setCustomClaims(prev => ({ ...prev, [key]: value }));
      (document.getElementById('customClaimKey') as HTMLInputElement).value = '';
      (document.getElementById('customClaimValue') as HTMLInputElement).value = '';
    }
  };

  // Simula a verificação de um token
  const verifyToken = () => {
    if (!decodedToken) {
      setVerificationResult({
        isValid: false,
        message: 'Nenhum token para verificar'
      });
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const { payload } = decodedToken;

    if (payload.exp < now) {
      setVerificationResult({
        isValid: false,
        message: 'Token expirado'
      });
      return;
    }

    setVerificationResult({
      isValid: true,
      message: 'Token válido'
    });
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Simulador de JWT
          </h1>
          <p className="text-lg text-zinc-400">
            Experimente a geração e validação de tokens JWT na prática
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Token Generation Section */}
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-400 mb-6">Configuração do Token</h2>
              
              {/* User Information */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-semibold text-white">Informações do Usuário</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={e => updateUser('name', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={e => updateUser('email', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Papel
                    </label>
                    <select
                      value={user.role}
                      onChange={e => updateUser('role', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                    >
                      <option value="user">Usuário</option>
                      <option value="admin">Administrador</option>
                      <option value="guest">Convidado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Token Settings */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-semibold text-white">Configurações do Token</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Algoritmo de Assinatura
                    </label>
                    <select
                      value={selectedAlgorithm}
                      onChange={e => setSelectedAlgorithm(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                    >
                      <option value="HS256">HS256</option>
                      <option value="HS384">HS384</option>
                      <option value="HS512">HS512</option>
                      <option value="RS256">RS256</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Tempo de Expiração (segundos)
                    </label>
                    <input
                      type="number"
                      value={expirationTime}
                      onChange={e => setExpirationTime(parseInt(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Claims */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Claims Personalizadas</h3>
                
                {/* Display current claims */}
                {Object.keys(customClaims).length > 0 && (
                  <div className="bg-zinc-800 rounded p-4 mb-4">
                    <div className="grid gap-2">
                      {Object.entries(customClaims).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex-1">
                            <span className="text-purple-400">{key}: </span>
                            <span className="text-zinc-300">{value}</span>
                          </div>
                          <button
                            onClick={() => {
                              const newClaims = { ...customClaims };
                              delete newClaims[key];
                              setCustomClaims(newClaims);
                            }}
                            className="ml-2 text-red-400 hover:text-red-300 p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Chave"
                    className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                    id="customClaimKey"
                  />
                  <input
                    type="text"
                    placeholder="Valor"
                    className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                    id="customClaimValue"
                  />
                </div>
                <button
                  onClick={() => {
                    const key = (document.getElementById('customClaimKey') as HTMLInputElement).value;
                    const value = (document.getElementById('customClaimValue') as HTMLInputElement).value;
                    addCustomClaim(key, value);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded transition-colors"
                >
                  Adicionar Claim
                </button>
              </div>
            </div>
          </div>

          {/* Token Display and Verification Section */}
          <div className="space-y-6">
            {/* Generated Token */}
            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-400 mb-6">Token Gerado</h2>
              {token ? (
                <div className="space-y-4">
                  <div className="bg-zinc-800 p-4 rounded">
                    <p className="text-zinc-400 break-all font-mono text-sm">{token}</p>
                  </div>
                  <button
                    onClick={verifyToken}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded transition-colors"
                  >
                    Verificar Token
                  </button>
                </div>
              ) : (
                <p className="text-zinc-500">
                  Configure e gere um token para visualizá-lo aqui
                </p>
              )}
            </div>

            {/* Decoded Token */}
            {decodedToken && (
              <div className="bg-zinc-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-400 mb-6">Token Decodificado</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">Header</h3>
                    <div className="bg-zinc-800 p-4 rounded">
                      <pre className="text-zinc-400 text-sm">
                        {JSON.stringify(decodedToken.header, null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-300 mb-2">Payload</h3>
                    <div className="bg-zinc-800 p-4 rounded">
                      <pre className="text-zinc-400 text-sm">
                        {JSON.stringify(decodedToken.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">Signature</h3>
                    <div className="bg-zinc-800 p-4 rounded">
                      <p className="text-zinc-400 font-mono text-sm break-all">
                        {decodedToken.signature}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Result */}
            {verificationResult && (
              <div className={`bg-zinc-900 rounded-lg p-6 border-l-4 ${
                verificationResult.isValid ? 'border-green-500' : 'border-red-500'
              }`}>
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Resultado da Verificação
                </h2>
                <div className={`text-lg ${
                  verificationResult.isValid ? 'text-green-400' : 'text-red-400'
                }`}>
                  {verificationResult.message}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-zinc-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-400 mb-6">Como Usar</h2>
          <div className="space-y-4 text-zinc-400">
            <p>
              1. Configure as informações do usuário e as configurações do token no painel esquerdo
            </p>
            <p>
              2. Adicione claims personalizadas se desejar (opcional)
            </p>
            <p>
              3. Clique em "Gerar Token" para criar um novo JWT
            </p>
            <p>
              4. Visualize o token gerado e sua versão decodificada no painel direito
            </p>
            <p>
              5. Use o botão "Verificar Token" para simular a validação do token
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
