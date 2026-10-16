// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import { createInstance, type i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';
import en from '../../../locales/en/translation.json';
import pt from '../../../locales/pt/translation.json';

vi.mock('../../simulation', () => ({
  useSimulationMotion: () => ({ reducedMotion: true, transition: { duration: 0 }, duration: () => 0 }),
  SimulationActivity: () => null,
  FlowLink: () => null,
}));
vi.mock('../../AISystems/motion', () => ({
  AnimatedNumber: ({ value }: { value: number }) => <span>{value}</span>,
  AnimatedMetric: ({ value, label, format }: { value: number; label: string; format?: (value: number) => string }) => <div aria-label={label}>{format?.(value) ?? value}</div>,
}));

import AsyncSync from '../../AsyncSync/AsyncSync';
import ReplicationSimulator from '../../DesignPrinciples/ReplicationSimulator';
import ServiceArchitectureSimulator from '../../DesignPrinciples/ServiceArchitectureSimulator';
import APIGatewaySimulator from '../../APIGateway/APIGatewaySimulator';
import CDN from '../../CDN/CDN';
import ConsensusSimulator from '../../ConsistencyStrategies/ConsensusSimulator';
import LogSimulator from '../../Monitoramento/LogSimulator';
import InvertedIndexSimulator from '../../DataStorage/InvertedIndexSimulator';
import CircuitBreaker from '../../CircuitBreaker/CircuitBreaker';

async function renderLocalized(component: React.ReactNode, language: 'en' | 'pt' = 'en'): Promise<i18n> {
  const instance = createInstance();
  await instance.init({ lng: language, fallbackLng: false, resources: { en: { translation: en }, pt: { translation: pt } }, interpolation: { escapeValue: false } });
  render(<I18nextProvider i18n={instance}>{component}</I18nextProvider>);
  return instance;
}

describe('simulator language consistency', () => {
  it('translates the legacy async/sync controls and explanatory text', async () => {
    await renderLocalized(<AsyncSync />);
    expect(screen.getByRole('button', { name: 'Send message 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Asynchronous' })).toBeInTheDocument();
    expect(screen.getByText('The message is sent and the client waits for the response.')).toBeInTheDocument();
    expect(screen.queryByText('Controles')).not.toBeInTheDocument();
    expect(screen.queryByText('Aguardando...')).not.toBeInTheDocument();
  });

  it('uses English throughout replication controls, server roles and statistics', async () => {
    await renderLocalized(<ReplicationSimulator />);
    expect(screen.getByRole('heading', { name: 'Replication and failover simulator' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start simulation' })).toBeInTheDocument();
    expect(screen.getByText('Primary server')).toBeInTheDocument();
    expect(screen.getByText('Average replication lag')).toBeInTheDocument();
    expect(screen.queryByText('Servidor Principal')).not.toBeInTheDocument();
    expect(screen.queryByText('Estatísticas')).not.toBeInTheDocument();
  });

  it('translates architecture descriptions and keeps the selected architecture when the language changes', async () => {
    const instance = await renderLocalized(<ServiceArchitectureSimulator />);
    fireEvent.click(screen.getByRole('button', { name: 'Microservices' }));
    expect(screen.getByRole('heading', { name: 'Authentication service' })).toBeInTheDocument();
    expect(screen.getByText('Independent services communicate over the network, each with its own deployment and database.')).toBeInTheDocument();
    await act(() => instance.changeLanguage('pt'));
    expect(screen.getByRole('heading', { name: 'Simulador de arquiteturas de serviços' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Serviço de autenticação' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Authentication service' })).not.toBeInTheDocument();
    expect(screen.getByText('Serviços independentes que se comunicam via rede, cada um com seu próprio deploy e banco de dados.')).toBeInTheDocument();
  });

  it('localizes API gateway service names and descriptions in both directions', async () => {
    const instance = await renderLocalized(<APIGatewaySimulator />);
    expect(screen.getByText('Payment processing')).toBeInTheDocument();
    expect(screen.queryByText('Processamento de pagamentos')).not.toBeInTheDocument();
    await act(() => instance.changeLanguage('pt'));
    expect(screen.getByText('Serviço de produtos')).toBeInTheDocument();
    expect(screen.getByText('Processamento de pagamentos')).toBeInTheDocument();
    expect(screen.queryByText('Product service')).not.toBeInTheDocument();
  });

  it('supplies translated country and datacenter labels rather than missing keys or Portuguese fallbacks', async () => {
    const instance = await renderLocalized(<CDN />);
    expect(screen.getByRole('button', { name: /Japan Asia/ })).toBeInTheDocument();
    expect(screen.getByText('Singapore')).toBeInTheDocument();
    expect(screen.queryByText('simulators.cdn.datacenters.sg.name')).not.toBeInTheDocument();
    await act(() => instance.changeLanguage('pt'));
    expect(screen.getByRole('button', { name: /Japão Ásia/ })).toBeInTheDocument();
    expect(screen.getByText('Singapura')).toBeInTheDocument();
  });

  it('translates consensus step explanations and role names', async () => {
    await renderLocalized(<ConsensusSimulator />);
    expect(screen.getByRole('heading', { name: 'Step 1: Initial state (Raft)' })).toBeInTheDocument();
    expect(screen.getByText('All nodes start as followers in term 0.')).toBeInTheDocument();
    expect(screen.getAllByText('Follower').length).toBeGreaterThan(1);
    expect(screen.queryByText('Estado Inicial (Raft)')).not.toBeInTheDocument();
  });

  it('translates sample log messages while preserving technical JSON identifiers', async () => {
    await renderLocalized(<LogSimulator />);
    fireEvent.click(screen.getByRole('button', { name: 'Add Good INFO' }));
    expect(screen.getByText(/User logged in successfully/)).toBeInTheDocument();
    expect(screen.queryByText(/Usuário logado com sucesso/)).not.toBeInTheDocument();
    expect(screen.getByText(/trace-123/)).toBeInTheDocument();
  });

  it('uses Portuguese query vocabulary for the inverted index', async () => {
    await renderLocalized(<InvertedIndexSimulator />, 'pt');
    expect(screen.getByRole('button', { name: 'rede' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'network' })).not.toBeInTheDocument();
  });

  it('translates circuit states and their configuration labels', async () => {
    await renderLocalized(<CircuitBreaker />, 'pt');
    expect(screen.getAllByText('Fechado').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Configurações' }));
    expect(screen.getByText('Limite de falhas')).toBeInTheDocument();
    expect(screen.queryByText('CLOSED')).not.toBeInTheDocument();
  });
});
