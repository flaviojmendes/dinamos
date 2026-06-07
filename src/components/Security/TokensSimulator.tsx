import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

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

const inputClass =
  'w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green';

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
  const [expirationTime, setExpirationTime] = useState<number>(3600);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('HS256');
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  const roles = t(`${base}.roles`, { returnObjects: true }) as Record<string, string>;
  const verificationMessages = t(`${base}.verification_messages`, { returnObjects: true }) as Record<string, string>;
  const instructions = t(`${base}.instructions`, { returnObjects: true }) as string[];

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

  useEffect(() => {
    generateToken();
  }, [user, customClaims, expirationTime, selectedAlgorithm]);

  const updateUser = (field: keyof User, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const addCustomClaim = (key: string, value: string) => {
    if (key && value) {
      setCustomClaims(prev => ({ ...prev, [key]: value }));
      (document.getElementById('customClaimKey') as HTMLInputElement).value = '';
      (document.getElementById('customClaimValue') as HTMLInputElement).value = '';
    }
  };

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
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h2 className="font-sans text-lg font-semibold text-slate-900 dark:text-tactical-text mb-2">
          {t(`${base}.title`)}
        </h2>
        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {t(`${base}.subtitle`)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title={t(`${base}.token_configuration_title`)} accent="cyan">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="font-sans text-sm font-semibold text-signal-cyan">{t(`${base}.user_information_title`)}</div>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {t(`${base}.name_label`)}
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={e => updateUser('name', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {t(`${base}.email_label`)}
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={e => updateUser('email', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {t(`${base}.role_label`)}
                  </label>
                  <select
                    value={user.role}
                    onChange={e => updateUser('role', e.target.value)}
                    className={inputClass}
                  >
                    <option value="user">{roles.user}</option>
                    <option value="admin">{roles.admin}</option>
                    <option value="guest">{roles.guest}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="font-sans text-sm font-semibold text-signal-cyan">{t(`${base}.token_settings_title`)}</div>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {t(`${base}.algorithm_label`)}
                  </label>
                  <select
                    value={selectedAlgorithm}
                    onChange={e => setSelectedAlgorithm(e.target.value)}
                    className={inputClass}
                  >
                    <option value="HS256">HS256</option>
                    <option value="HS384">HS384</option>
                    <option value="HS512">HS512</option>
                    <option value="RS256">RS256</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {t(`${base}.expiration_label`)}
                  </label>
                  <input
                    type="number"
                    value={expirationTime}
                    onChange={e => setExpirationTime(parseInt(e.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="font-sans text-sm font-semibold text-signal-cyan">{t(`${base}.custom_claims_title`)}</div>

              {Object.keys(customClaims).length > 0 && (
                <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4">
                  <div className="grid gap-2">
                    {Object.entries(customClaims).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex-1 font-mono text-sm">
                          <span className="text-signal-cyan">{key}: </span>
                          <span className="text-slate-600 dark:text-tactical-dim">{value}</span>
                        </div>
                        <button
                          onClick={() => {
                            const newClaims = { ...customClaims };
                            delete newClaims[key];
                            setCustomClaims(newClaims);
                          }}
                          className="ml-2 text-slate-400 dark:text-tactical-label hover:text-signal-red transition-colors p-1"
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
                  className={inputClass}
                  id="customClaimKey"
                />
                <input
                  type="text"
                  placeholder={t(`${base}.value_placeholder`)}
                  className={inputClass}
                  id="customClaimValue"
                />
              </div>
              <TacticalButton
                variant="primary"
                className="w-full"
                onClick={() => {
                  const key = (document.getElementById('customClaimKey') as HTMLInputElement).value;
                  const value = (document.getElementById('customClaimValue') as HTMLInputElement).value;
                  addCustomClaim(key, value);
                }}
              >
                {t(`${base}.add_claim_button`)}
              </TacticalButton>
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title={t(`${base}.generated_token_title`)} accent="green">
            {token ? (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border p-4">
                  <p className="text-slate-600 dark:text-tactical-dim break-all font-mono text-sm">{token}</p>
                </div>
                <TacticalButton variant="primary" className="w-full" onClick={verifyToken}>
                  {t(`${base}.verify_token_button`)}
                </TacticalButton>
              </div>
            ) : (
              <p className="font-sans text-sm text-slate-400 dark:text-tactical-label">
                {t(`${base}.no_token_message`)}
              </p>
            )}
          </Panel>

          {decodedToken && (
            <Panel title={t(`${base}.decoded_token_title`)} accent="amber">
              <div className="space-y-4">
                <div>
                  <div className="font-sans text-xs font-medium text-signal-cyan mb-2">{t(`${base}.header_title`)}</div>
                  <div className="bg-slate-50 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border p-4">
                    <pre className="text-slate-600 dark:text-tactical-dim text-sm font-mono">
                      {JSON.stringify(decodedToken.header, null, 2)}
                    </pre>
                  </div>
                </div>
                <div>
                  <div className="font-sans text-xs font-medium text-signal-green mb-2">{t(`${base}.payload_title`)}</div>
                  <div className="bg-slate-50 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border p-4">
                    <pre className="text-slate-600 dark:text-tactical-dim text-sm font-mono">
                      {JSON.stringify(decodedToken.payload, null, 2)}
                    </pre>
                  </div>
                </div>
                <div>
                  <div className="font-sans text-xs font-medium text-signal-amber mb-2">{t(`${base}.signature_title`)}</div>
                  <div className="bg-slate-50 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border p-4">
                    <p className="text-slate-600 dark:text-tactical-dim font-mono text-sm break-all">
                      {decodedToken.signature}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>
          )}

          {verificationResult && (
            <Panel
              title={t(`${base}.verification_result_title`)}
              accent={verificationResult.isValid ? 'green' : 'red'}
              action={
                <StatusBadge variant={verificationResult.isValid ? 'active' : 'classified'} />
              }
            >
              <p className={`font-sans text-sm ${verificationResult.isValid ? 'text-signal-green' : 'text-signal-red'}`}>
                {verificationResult.message}
              </p>
            </Panel>
          )}
        </div>
      </div>

      <div className="tactical-panel rounded-lg dark:rounded-none border-l-2 border-l-signal-cyan p-5">
        <h3 className="font-sans text-sm font-semibold text-signal-cyan mb-3">{t(`${base}.how_to_use_title`)}</h3>
        <ul className="space-y-1.5 font-sans text-sm text-slate-600 dark:text-tactical-dim list-decimal list-inside">
          {instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
