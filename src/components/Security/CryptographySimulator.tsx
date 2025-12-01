import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { useTranslation } from 'react-i18next';

interface SimulationResult {
  input: string;
  output: string;
  details?: string;
}

export default function CryptographySimulator() {
  const { t } = useTranslation();
  const base = 'cryptography_simulator';

  // Estados para entrada de dados
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

  // Função para limpar resultados
  const clearResults = () => {
    setResults([]);
  };

  // Função para adicionar resultado
  const addResult = (input: string, output: string, details?: string) => {
    setResults(prev => [...prev, { input, output, details }].slice(-5)); // Mantém apenas os últimos 5 resultados
  };

  // Funções de criptografia
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

  // Função principal de simulação
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
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t(`${base}.title`)}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            {t(`${base}.subtitle`)}
          </p>
        </div>

        {/* Simulador */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
          <div className="space-y-8">
            {/* Controles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entrada de Dados */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {t(`${base}.text_input_label`)}
                  </label>
                  <textarea
                    value={plainText}
                    onChange={(e) => setPlainText(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-white h-32"
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
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-white"
                    placeholder={t(`${base}.key_placeholder`)}
                  />
                </div>
              </div>

              {/* Seleção de Operação */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {t(`${base}.operation_label`)}
                  </label>
                  <select
                    value={selectedOperation}
                    onChange={(e) => setSelectedOperation(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-white"
                  >
                    <option value="aes">{operations.aes}</option>
                    <option value="sha256">{operations.sha256}</option>
                    <option value="md5">{operations.md5}</option>
                    <option value="base64">{operations.base64}</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    onClick={runSimulation}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded transition-colors"
                  >
                    {t(`${base}.process_button`)}
                  </button>
                  <button
                    onClick={clearResults}
                    className="w-full mt-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-4 py-2 rounded transition-colors"
                  >
                    {t(`${base}.clear_button`)}
                  </button>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">{t(`${base}.results_title`)}</h3>
              {results.length === 0 ? (
                <p className="text-zinc-500">
                  {t(`${base}.no_results`)}
                </p>
              ) : (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <div className="grid gap-2">
                        <div>
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{resultLabels.input}</span>
                          <p className="text-slate-600 dark:text-slate-300 font-mono break-all">{result.input}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{resultLabels.output}</span>
                          <p className="text-slate-600 dark:text-slate-300 font-mono break-all">{result.output}</p>
                        </div>
                        {result.details && (
                          <div>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{resultLabels.details}</span>
                            <p className="text-slate-600 dark:text-slate-300">{result.details}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 bg-white dark:bg-slate-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{t(`${base}.instructions_title`)}</h3>
          <div className="space-y-4 text-slate-500 dark:text-slate-400">
            {instructions.map((instruction, index) => (
              <p key={index}>
                {index + 1}. {instruction}
              </p>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-white mb-2">{t(`${base}.important_notes_title`)}</h4>
            <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-2">
              {importantNotes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 