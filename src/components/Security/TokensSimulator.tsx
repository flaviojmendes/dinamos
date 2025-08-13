import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const base = 'jwt_simulator';

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

  const roles = t(`${base}.roles`, { returnObjects: true }) as Record<string, string>;
  const verificationMessages = t(`${base}.verification_messages`, { returnObjects: true }) as Record<string, string>;
  const instructions = t(`${base}.instructions`, { returnObjects: true }) as string[];

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
        message: verificationMessages.no_token
      });
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const { payload } = decodedToken;

    if (payload.exp < now) {
      setVerificationResult({
        isValid: false,
        message: verificationMessages.expired
      });
      return;
    }

    setVerificationResult({
      isValid: true,
      message: verificationMessages.valid
    });
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t(`${base}.title`)}
          </h1>
          <p className="text-lg text-zinc-400">
            {t(`${base}.subtitle`)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Token Generation Section */}
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-400 mb-6">{t(`${base}.token_configuration_title`)}</h2>
              
              {/* User Information */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-semibold text-white">{t(`${base}.user_information_title`)}</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      {t(`${base}.name_label`)}
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
                      {t(`${base}.email_label`)}
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
                      {t(`${base}.role_label`)}
                    </label>
                    <select
                      value={user.role}
                      onChange={e => updateUser('role', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                    >
                      <option value="user">{roles.user}</option>
                      <option value="admin">{roles.admin}</option>
                      <option value="guest">{roles.guest}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Token Settings */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-semibold text-white">{t(`${base}.token_settings_title`)}</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      {t(`${base}.algorithm_label`)}
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
                      {t(`${base}.expiration_label`)}
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
                <h3 className="text-xl font-semibold text-white">{t(`${base}.custom_claims_title`)}</h3>
                
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
                    placeholder={t(`${base}.key_placeholder`)}
                    className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                    id="customClaimKey"
                  />
                  <input
                    type="text"
                    placeholder={t(`${base}.value_placeholder`)}
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
                  {t(`${base}.add_claim_button`)}
                </button>
              </div>
            </div>
          </div>

          {/* Token Display and Verification Section */}
          <div className="space-y-6">
            {/* Generated Token */}
            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-400 mb-6">{t(`${base}.generated_token_title`)}</h2>
              {token ? (
                <div className="space-y-4">
                  <div className="bg-zinc-800 p-4 rounded">
                    <p className="text-zinc-400 break-all font-mono text-sm">{token}</p>
                  </div>
                  <button
                    onClick={verifyToken}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded transition-colors"
                  >
                    {t(`${base}.verify_token_button`)}
                  </button>
                </div>
              ) : (
                <p className="text-zinc-500">
                  {t(`${base}.no_token_message`)}
                </p>
              )}
            </div>

            {/* Decoded Token */}
            {decodedToken && (
              <div className="bg-zinc-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-400 mb-6">{t(`${base}.decoded_token_title`)}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">{t(`${base}.header_title`)}</h3>
                    <div className="bg-zinc-800 p-4 rounded">
                      <pre className="text-zinc-400 text-sm">
                        {JSON.stringify(decodedToken.header, null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-300 mb-2">{t(`${base}.payload_title`)}</h3>
                    <div className="bg-zinc-800 p-4 rounded">
                      <pre className="text-zinc-400 text-sm">
                        {JSON.stringify(decodedToken.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">{t(`${base}.signature_title`)}</h3>
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
                  {t(`${base}.verification_result_title`)}
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
          <h2 className="text-2xl font-bold text-blue-400 mb-6">{t(`${base}.how_to_use_title`)}</h2>
          <div className="space-y-4 text-zinc-400">
            {instructions.map((instruction, index) => (
              <p key={index}>
                {index + 1}. {instruction}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
