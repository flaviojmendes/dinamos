import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import en from '../en/translation.json';
import pt from '../pt/translation.json';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const loaders = readFileSync(resolve(root, 'src/config/simulatorLoaders.ts'), 'utf8');
const files = [...loaders.matchAll(/import\('([^']+)'\)/g)]
  .map(match => resolve(root, 'src/config', `${match[1]}.tsx`));

function resourceKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object') return prefix ? [prefix] : [];
  return [prefix, ...Object.entries(value).flatMap(([key, child]) => resourceKeys(child, prefix ? `${prefix}.${key}` : key))];
}

/** Include dynamic key suffixes and statically known base namespaces. */
function translationPatterns(file: string, literalsOnly = false): string[] {
  const ast = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const constants = new Map<string, string>();
  const patterns: string[] = [];
  const visitConstants = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
      constants.set(node.name.getText(ast), node.initializer.text);
    }
    ts.forEachChild(node, visitConstants);
  };
  visitConstants(ast);
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && node.expression.getText(ast) === 't') {
      const first = node.arguments[0];
      if (first && ts.isStringLiteral(first)) patterns.push(first.text);
      if (!literalsOnly && first && ts.isTemplateExpression(first)) {
        let pattern = first.head.text;
        first.templateSpans.forEach(span => {
          pattern += (constants.get(span.expression.getText(ast)) ?? '*') + span.literal.text;
        });
        patterns.push(pattern);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return patterns;
}

describe('registered simulator translation coverage', () => {
  for (const [language, resource] of Object.entries({ en, pt })) {
    it(`resolves every statically identifiable simulator translation in ${language}`, () => {
      const keys = resourceKeys(resource);
      const missing = files.flatMap(file => translationPatterns(file).filter(pattern => {
        const regex = new RegExp(`^${pattern.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^.]+')}$`);
        return !keys.some(key => regex.test(key));
      }).map(pattern => `${file.replace(root, '')}: ${pattern}`));
      expect(missing).toEqual([]);
    });
  }

  it('keeps translated service architecture data structurally equivalent', () => {
    const shape = (architectures: typeof en.simulators.service_architecture.architectures) => architectures.map(architecture => ({
      type: architecture.type,
      modules: architecture.modules.map(module => ({ id: module.id, color: module.color, dependencies: 'dependencies' in module ? module.dependencies : undefined })),
    }));
    expect(shape(en.simulators.service_architecture.architectures)).toEqual(shape(pt.simulators.service_architecture.architectures));
  });

  it('ships matching lazy namespaces and complete translation resources for the whole app', () => {
    for (const [language, resource] of Object.entries({ en, pt })) {
      const manifest = JSON.parse(readFileSync(resolve(root, `src/locales/${language}/namespaces/_manifest.json`), 'utf8')) as string[];
      expect(manifest.sort()).toEqual(Object.keys(resource).sort());
      for (const namespace of manifest) {
        const lazy = JSON.parse(readFileSync(resolve(root, `src/locales/${language}/namespaces/${namespace}.json`), 'utf8'));
        expect(lazy).toEqual(resource[namespace as keyof typeof resource]);
      }
    }
    // Localized lists can legitimately have different lengths, e.g. legal copy.
    const namedKeys = (resource: unknown) => resourceKeys(resource).filter(key => !/\.\d+(?:\.|$)/.test(key)).sort();
    const enKeys = new Set(namedKeys(en));
    const ptKeys = new Set(namedKeys(pt));
    expect({
      missingEnglish: [...ptKeys].filter(key => !enKeys.has(key)),
      missingPortuguese: [...enKeys].filter(key => !ptKeys.has(key)),
    }).toEqual({ missingEnglish: [], missingPortuguese: [] });
  });

  it('resolves every literal translation key used anywhere in the app in both languages', () => {
    const sourceFiles = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(resolve(directory, entry.name));
      return /\.tsx?$/.test(entry.name) && !entry.name.includes('.test.') ? [resolve(directory, entry.name)] : [];
    });
    for (const [language, resource] of Object.entries({ en, pt })) {
      const keys = new Set(resourceKeys(resource));
      const missing = sourceFiles(resolve(root, 'src')).flatMap(file => translationPatterns(file, true)
        .filter(key => !keys.has(key)).map(key => `${language}: ${file.replace(root, '')}: ${key}`));
      expect(missing).toEqual([]);
    }
  });
});
