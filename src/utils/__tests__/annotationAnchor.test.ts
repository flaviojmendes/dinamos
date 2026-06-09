// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  serializeRange,
  findRange,
  highlightRange,
  clearHighlights,
  HIGHLIGHT_CLASS,
  type TextAnchor,
} from '../annotationAnchor';

function mount(html: string): HTMLElement {
  const root = document.createElement('div');
  root.innerHTML = html;
  document.body.appendChild(root);
  return root;
}

/** Build a Range covering [start, end) character offsets within `root`. */
function rangeFor(root: HTMLElement, start: number, end: number): Range {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let idx = 0;
  let node = walker.nextNode() as Text | null;
  let startSet = false;
  while (node) {
    const len = node.textContent?.length ?? 0;
    if (!startSet && start <= idx + len) {
      range.setStart(node, start - idx);
      startSet = true;
    }
    if (startSet && end <= idx + len) {
      range.setEnd(node, end - idx);
      break;
    }
    idx += len;
    node = walker.nextNode() as Text | null;
  }
  return range;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('serializeRange', () => {
  it('captures the quote, offsets and surrounding context', () => {
    const root = mount('<p>The quick brown fox jumps over the lazy dog.</p>');
    const anchor = serializeRange(root, rangeFor(root, 4, 9)); // "quick"
    expect(anchor).not.toBeNull();
    expect(anchor!.quote).toBe('quick');
    expect(anchor!.start).toBe(4);
    expect(anchor!.end).toBe(9);
    expect(anchor!.prefix).toBe('The ');
    expect(anchor!.suffix.startsWith(' brown')).toBe(true);
  });

  it('returns null for an empty/whitespace selection', () => {
    const root = mount('<p>   hello   </p>');
    const anchor = serializeRange(root, rangeFor(root, 0, 3)); // three spaces
    expect(anchor).toBeNull();
  });
});

describe('findRange', () => {
  it('round-trips a serialized anchor back to the same text', () => {
    const root = mount('<p>alpha beta gamma delta</p>');
    const anchor = serializeRange(root, rangeFor(root, 6, 10))!; // "beta"
    const found = findRange(root, anchor);
    expect(found).not.toBeNull();
    expect(found!.toString()).toBe('beta');
  });

  it('relocates a quote that shifted using the prefix hint', () => {
    const root = mount('<p>intro text. target word here. target word again.</p>');
    // Anchor originally pointed at the first "target" but stale offsets are off.
    const anchor: TextAnchor = {
      quote: 'target',
      prefix: 'intro text. ',
      suffix: ' word',
      start: 0,
      end: 6,
    };
    const found = findRange(root, anchor);
    expect(found).not.toBeNull();
    expect(found!.toString()).toBe('target');
    // Prefix "intro text. " should pull it to the first occurrence (index 12).
    expect(found!.startOffset).toBe(12);
  });

  it('returns null when the quote is absent', () => {
    const root = mount('<p>nothing relevant here</p>');
    const anchor: TextAnchor = { quote: 'missing', prefix: '', suffix: '', start: 0, end: 7 };
    expect(findRange(root, anchor)).toBeNull();
  });
});

describe('highlightRange / clearHighlights', () => {
  it('wraps matched text in a tagged mark and can remove it again', () => {
    const root = mount('<p>highlight me please</p>');
    const range = rangeFor(root, 10, 12); // "me"
    expect(highlightRange(range, 42, 'green')).toBe(true);

    const mark = root.querySelector(`mark.${HIGHLIGHT_CLASS}`) as HTMLElement;
    expect(mark).not.toBeNull();
    expect(mark.getAttribute('data-annotation-id')).toBe('42');
    expect(mark.textContent).toBe('me');

    clearHighlights(root);
    expect(root.querySelector(`mark.${HIGHLIGHT_CLASS}`)).toBeNull();
    expect(root.textContent).toBe('highlight me please');
  });
});
