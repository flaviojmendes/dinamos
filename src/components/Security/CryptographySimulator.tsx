import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

interface SimulationResult {
  input: string;
  output: string;
  details?: string;
}

export default function CryptographySimulator() {
  // Estados para entrada de dados
  const [plainText, setPlainText] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [selectedOperation, setSelectedOperation] = useState<string>('aes');
  const [results, setResults] = useState<SimulationResult[]>([]);

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
      addResult(text, encrypted, 'AES-256-CBC');
    } catch (error) {
      addResult(text, 'Erro na criptografia', 'Verifique a chave e os dados');
    }
  };

  const hashSHA256 = (text: string) => {
    try {
      const hashed = CryptoJS.SHA256(text).toString();
      addResult(text, hashed, 'SHA-256');
    } catch (error) {
      addResult(text, 'Erro no hash', 'Verifique os dados');
    }
  };

  const hashMD5 = (text: string) => {
    try {
      const hashed = CryptoJS.MD5(text).toString();
      addResult(text, hashed, 'MD5 (Não recomendado para uso em produção)');
    } catch (error) {
      addResult(text, 'Erro no hash', 'Verifique os dados');
    }
  };

  const encodeBase64 = (text: string) => {
    try {
      const encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
      addResult(text, encoded, 'Base64');
    } catch (error) {
      addResult(text, 'Erro na codificação', 'Verifique os dados');
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
          addResult(plainText, 'Erro: Chave necessária', 'Forneça uma chave para criptografia AES');
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
            Simulador de Criptografia
          </h1>
          <p className="text-lg text-zinc-400">
            Experimente diferentes tipos de criptografia, hashing e codificação na prática
          </p>
        </div>

        {/* Simulador */}
        <div className="bg-zinc-900 rounded-lg p-6">
          <div className="space-y-8">
            {/* Controles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entrada de Dados */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Texto para Processar
                  </label>
                  <textarea
                    value={plainText}
                    onChange={(e) => setPlainText(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white h-32"
                    placeholder="Digite o texto aqui..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Chave (necessária apenas para AES)
                  </label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                    placeholder="Chave secreta..."
                  />
                </div>
              </div>

              {/* Seleção de Operação */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Operação
                  </label>
                  <select
                    value={selectedOperation}
                    onChange={(e) => setSelectedOperation(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                  >
                    <option value="aes">Criptografia AES</option>
                    <option value="sha256">Hash SHA-256</option>
                    <option value="md5">Hash MD5 (Não recomendado)</option>
                    <option value="base64">Codificação Base64</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    onClick={runSimulation}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded transition-colors"
                  >
                    Processar
                  </button>
                  <button
                    onClick={clearResults}
                    className="w-full mt-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium px-4 py-2 rounded transition-colors"
                  >
                    Limpar Resultados
                  </button>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Resultados</h3>
              {results.length === 0 ? (
                <p className="text-zinc-500">
                  Os resultados aparecerão aqui após o processamento...
                </p>
              ) : (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="bg-zinc-800 p-4 rounded-lg">
                      <div className="grid gap-2">
                        <div>
                          <span className="text-sm font-medium text-zinc-400">Entrada:</span>
                          <p className="text-zinc-300 font-mono break-all">{result.input}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-400">Saída:</span>
                          <p className="text-zinc-300 font-mono break-all">{result.output}</p>
                        </div>
                        {result.details && (
                          <div>
                            <span className="text-sm font-medium text-zinc-400">Detalhes:</span>
                            <p className="text-zinc-300">{result.details}</p>
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
        <div className="mt-12 bg-zinc-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Como Usar</h3>
          <div className="space-y-4 text-zinc-400">
            <p>
              1. Digite o texto que deseja processar no campo de entrada
            </p>
            <p>
              2. Se escolher criptografia AES, forneça uma chave secreta
            </p>
            <p>
              3. Selecione a operação desejada no menu suspenso
            </p>
            <p>
              4. Clique em "Processar" para ver o resultado
            </p>
            <p>
              5. Os últimos 5 resultados serão mantidos para comparação
            </p>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-white mb-2">Notas Importantes</h4>
            <ul className="list-disc list-inside text-zinc-400 space-y-2">
              <li>AES é um algoritmo de criptografia simétrica seguro e amplamente utilizado</li>
              <li>SHA-256 é recomendado para hashing seguro de dados</li>
              <li>MD5 é incluído apenas para fins educacionais - não use em produção</li>
              <li>Base64 é uma codificação, não uma forma de criptografia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 