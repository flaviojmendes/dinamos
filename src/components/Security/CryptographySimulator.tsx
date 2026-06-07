import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton } from '../tactical';

interface SimulationResult {
  input: string;
  output: string;
  details?: string;
}

const inputClass =
  'w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green';

export default function CryptographySimulator() {
  const { t } = useTranslation();
  const base = 'cryptography_simulator';

  const [plainText, setPlainText] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [selectedOperation, setSelectedOperation] = useState<string>('aes');
  const [results, setResults] = useState<SimulationResult[]>([]);

  const operations = t(`${base}.operations`, { returnObjects: true }) as Record<string, string>;
  const errorMessages = t(`${base}.error_messages`, { returnObjects: true }) as Record<string, string>;
  const algorithmDetails = t(`${base}.algorithm_details`, { returnObjects: true }) as Record<string, string>;
  const instructions = t(`${base}.instructions`, { returnObjects: true }) as string[];
  const importantNotes = t(`${base}.important_notes`, { returnObjects: true }) as string[];
  const resultLabels = t(`${base}.result_labels`, { returnObjects: true }) as Record<string, string>;

  const clearResults = () => {
    setResults([]);
  };

  const addResult = (input: string, output: string, details?: string) => {
    setResults(prev => [...prev, { input, output, details }].slice(-5));
  };

  const encryptAES = (text: string, key: string) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(text, key).toString();
      addResult(text, encrypted, algorithmDetails.aes);
    } catch (error) {
      addResult(text, errorMessages.encryption_error, errorMessages.check_key_data);
    }
  };

  const hashSHA256 = (text: string) => {
    try {
      const hashed = CryptoJS.SHA256(text).toString();
      addResult(text, hashed, algorithmDetails.sha256);
    } catch (error) {
      addResult(text, errorMessages.hash_error, errorMessages.check_data);
    }
  };

  const hashMD5 = (text: string) => {
    try {
      const hashed = CryptoJS.MD5(text).toString();
      addResult(text, hashed, algorithmDetails.md5);
    } catch (error) {
      addResult(text, errorMessages.hash_error, errorMessages.check_data);
    }
  };

  const encodeBase64 = (text: string) => {
    try {
      const encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
      addResult(text, encoded, algorithmDetails.base64);
    } catch (error) {
      addResult(text, errorMessages.encoding_error, errorMessages.check_data);
    }
  };

  const runSimulation = () => {
    if (!plainText) {
      return;
    }

    switch (selectedOperation) {
      case 'aes':
        if (!key) {
          addResult(plainText, errorMessages.key_required, errorMessages.provide_aes_key);
          return;
        }
        encryptAES(plainText, key);
        break;
      case 'sha256':
        hashSHA256(plainText);
        break;
      case 'md5':
        hashMD5(plainText);
        break;
      case 'base64':
        encodeBase64(plainText);
        break;
    }
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

      <Panel title={t(`${base}.operation_label`)} accent="green">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t(`${base}.text_input_label`)}
                </label>
                <textarea
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  className={`${inputClass} h-32`}
                  placeholder={t(`${base}.text_input_placeholder`)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t(`${base}.key_label`)}
                </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className={inputClass}
                  placeholder={t(`${base}.key_placeholder`)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t(`${base}.operation_label`)}
                </label>
                <select
                  value={selectedOperation}
                  onChange={(e) => setSelectedOperation(e.target.value)}
                  className={inputClass}
                >
                  <option value="aes">{operations.aes}</option>
                  <option value="sha256">{operations.sha256}</option>
                  <option value="md5">{operations.md5}</option>
                  <option value="base64">{operations.base64}</option>
                </select>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <TacticalButton variant="primary" className="w-full" onClick={runSimulation}>
                  {t(`${base}.process_button`)}
                </TacticalButton>
                <TacticalButton variant="ghost" className="w-full" onClick={clearResults}>
                  {t(`${base}.clear_button`)}
                </TacticalButton>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="font-sans text-sm font-semibold text-signal-cyan">{t(`${base}.results_title`)}</div>
            {results.length === 0 ? (
              <p className="font-sans text-sm text-slate-400 dark:text-tactical-label">
                {t(`${base}.no_results`)}
              </p>
            ) : (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4">
                    <div className="grid gap-2 font-mono text-sm">
                      <div>
                        <span className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label">{resultLabels.input}</span>
                        <p className="text-slate-600 dark:text-tactical-dim break-all mt-1">{result.input}</p>
                      </div>
                      <div>
                        <span className="font-sans text-xs font-medium text-signal-green">{resultLabels.output}</span>
                        <p className="text-slate-900 dark:text-tactical-text break-all mt-1">{result.output}</p>
                      </div>
                      {result.details && (
                        <div>
                          <span className="font-sans text-xs font-medium text-signal-cyan">{resultLabels.details}</span>
                          <p className="text-slate-600 dark:text-tactical-dim mt-1">{result.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Panel>

      <div className="tactical-panel rounded-lg dark:rounded-none border-l-2 border-l-signal-cyan p-5">
        <h3 className="font-sans text-sm font-semibold text-signal-cyan mb-3">{t(`${base}.instructions_title`)}</h3>
        <ul className="space-y-1.5 font-sans text-sm text-slate-600 dark:text-tactical-dim mb-6 list-decimal list-inside">
          {instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>

        <h4 className="font-sans text-sm font-semibold text-signal-amber mb-2">{t(`${base}.important_notes_title`)}</h4>
        <ul className="space-y-1.5 font-sans text-sm text-slate-600 dark:text-tactical-dim list-disc list-inside">
          {importantNotes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
