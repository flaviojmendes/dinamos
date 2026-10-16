import { afterEach, describe, expect, it } from 'vitest';
import { contentRegistry, menuKey, setRegistryLessons } from '../contentRegistry';
import en from '../../locales/en/translation.json';
import pt from '../../locales/pt/translation.json';

const lookup = (resource: unknown, key: string): unknown => key.split('.').reduce<unknown>(
  (current, part) => current && typeof current === 'object' ? (current as Record<string, unknown>)[part] : undefined,
  resource,
);

afterEach(() => setRegistryLessons([]));

describe('localized navigation keys', () => {
  it.each([
    ['/componentes/load-balancer/simulator', 'menu.componentes.load_balancer.simulator.name'],
    ['/theoretical-foundations/flp-impossibility', 'menu.theoretical_foundations.flp.name'],
    ['/principios-design/disponibilidade/disaster-recovery', 'menu.principios_design.disponibilidade.disaster_recovery.name'],
    ['/sistemas-ia/rag/simulator', 'menu.ai_systems.rag.simulator.name'],
    ['/sistemas-ia/agentic-systems', 'menu.ai_systems.agentic.name'],
    ['/dados-armazenamento/consistent-hashing/simulator', 'menu.data_storage.consistent_hashing.simulator.name'],
    ['/seguranca/tokens/simulador', 'menu.seguranca.tokens.simulator.name'],
    ['/backpressure', 'menu.principios_design.backpressure.simulator.name'],
    ['/circuit-breaker', 'menu.principios_design.tolerancia_falhas.circuit_breaker.simulator.name'],
    ['/cdn', 'menu.componentes.cdn.simulator.name'],
  ])('maps %s to its locale resource', (path, key) => {
    expect(menuKey(path, 'name')).toBe(key);
    expect(menuKey(`${path}/`, 'name')).toBe(key);
    expect(lookup(en, key)).toEqual(expect.any(String));
    expect(lookup(pt, key)).toEqual(expect.any(String));
  });

  it('localizes every registered simulator and tool without falling back to its URL slug', () => {
    setRegistryLessons([]);
    const missing = contentRegistry.flatMap(item => {
      const key = menuKey(item.path, 'name');
      return Object.entries({ en, pt }).flatMap(([locale, resource]) => typeof lookup(resource, key) === 'string' ? [] : [`${locale}: ${item.path} → ${key}`]);
    });
    expect(missing).toEqual([]);
  });

  it('preserves the requested display field', () => {
    expect(menuKey('/componentes/load-balancer', 'description')).toBe('menu.componentes.load_balancer.description');
    expect(lookup(en, menuKey('/componentes/load-balancer', 'description'))).toEqual(expect.any(String));
  });
});
