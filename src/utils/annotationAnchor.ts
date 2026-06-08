/**
 * Lightweight text anchoring for content annotations.
 *
 * A selection is stored as a combination of a TextPosition (start/end character
 * offsets into the container's text content) and a TextQuote (the selected text
 * plus a little surrounding context). On load we try the position first and, if
 * the text shifted, fall back to locating the quote — this survives most content
 * edits without a heavy dependency.
 */

export interface TextAnchor {
  quote: string;
  prefix: string;
  suffix: string;
  start: number;
  end: number;
}

const CONTEXT = 32;
const HIGHLIGHT_ATTR = 'data-annotation-id';
const HIGHLIGHT_CLASS = 'annotation-highlight';

/** Character offset of a (node, offset) boundary within `root`'s text. */
function offsetWithin(root: Node, node: Node, nodeOffset: number): number {
  const range = document.createRange();
  range.selectNodeContents(root);
  try {
    range.setEnd(node, nodeOffset);
  } catch {
    return 0;
  }
  return range.toString().length;
}

/** Build a serializable anchor from a live selection range. */
export function serializeRange(root: HTMLElement, range: Range): TextAnchor | null {
  const quote = range.toString();
  if (!quote.trim()) return null;
  const start = offsetWithin(root, range.startContainer, range.startOffset);
  const end = offsetWithin(root, range.endContainer, range.endOffset);
  const full = root.textContent ?? '';
  return {
    quote,
    prefix: full.slice(Math.max(0, start - CONTEXT), start),
    suffix: full.slice(end, end + CONTEXT),
    start,
    end,
  };
}

/** Map a character range back to a DOM Range inside `root`. */
function rangeFromOffsets(root: HTMLElement, start: number, end: number): Range | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let idx = 0;
  let startNode: Text | null = null;
  let startOffset = 0;
  let endNode: Text | null = null;
  let endOffset = 0;
  let node = walker.nextNode() as Text | null;
  while (node) {
    const len = node.textContent?.length ?? 0;
    if (!startNode && start <= idx + len) {
      startNode = node;
      startOffset = start - idx;
    }
    if (startNode && end <= idx + len) {
      endNode = node;
      endOffset = end - idx;
      break;
    }
    idx += len;
    node = walker.nextNode() as Text | null;
  }
  if (!startNode || !endNode) return null;
  const range = document.createRange();
  try {
    range.setStart(startNode, Math.max(0, startOffset));
    range.setEnd(endNode, Math.max(0, endOffset));
  } catch {
    return null;
  }
  return range;
}

/** Locate the best matching offsets for an anchor in the current text. */
function resolveOffsets(root: HTMLElement, anchor: TextAnchor): { start: number; end: number } | null {
  const full = root.textContent ?? '';
  if (full.slice(anchor.start, anchor.end) === anchor.quote) {
    return { start: anchor.start, end: anchor.end };
  }
  if (!anchor.quote) return null;

  // Find all occurrences of the quote and pick the one closest to the original
  // position, preferring a matching prefix.
  const positions: number[] = [];
  let from = 0;
  for (;;) {
    const at = full.indexOf(anchor.quote, from);
    if (at === -1) break;
    positions.push(at);
    from = at + 1;
  }
  if (positions.length === 0) return null;

  let best = positions[0];
  let bestScore = Infinity;
  for (const pos of positions) {
    const prefixOk = full.slice(Math.max(0, pos - anchor.prefix.length), pos) === anchor.prefix;
    const distance = Math.abs(pos - anchor.start);
    const score = distance - (prefixOk ? 1_000_000 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = pos;
    }
  }
  return { start: best, end: best + anchor.quote.length };
}

/** Find a live DOM Range for an anchor, or null if it can't be located. */
export function findRange(root: HTMLElement, anchor: TextAnchor): Range | null {
  const resolved = resolveOffsets(root, anchor);
  if (!resolved) return null;
  return rangeFromOffsets(root, resolved.start, resolved.end);
}

/** Remove every highlight wrapper we previously injected into `root`. */
export function clearHighlights(root: HTMLElement): void {
  const marks = root.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`);
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
  });
  root.normalize();
}

const COLOR_RGBA: Record<string, string> = {
  none: 'rgba(250, 204, 21, 0.35)',
  amber: 'rgba(251, 191, 36, 0.40)',
  green: 'rgba(52, 211, 153, 0.38)',
  cyan: 'rgba(34, 211, 238, 0.35)',
  rose: 'rgba(251, 113, 133, 0.35)',
};

/**
 * Wrap the text inside `range` with <mark> elements tagged with the annotation
 * id. Handles ranges that span multiple text nodes.
 */
export function highlightRange(
  range: Range,
  annotationId: number,
  color: string | null
): boolean {
  const textNodes: { node: Text; start: number; end: number }[] = [];
  const ancestor =
    range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentNode!
      : range.commonAncestorContainer;
  const walker = document.createTreeWalker(ancestor, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode() as Text | null;
  while (node) {
    if (range.intersectsNode(node)) {
      const start = node === range.startContainer ? range.startOffset : 0;
      const end = node === range.endContainer ? range.endOffset : node.textContent?.length ?? 0;
      if (end > start) textNodes.push({ node, start, end });
    }
    node = walker.nextNode() as Text | null;
  }
  if (textNodes.length === 0) return false;

  const bg = COLOR_RGBA[color ?? 'none'] ?? COLOR_RGBA.none;
  for (const { node: textNode, start, end } of textNodes) {
    try {
      let target = textNode;
      if (start > 0) target = target.splitText(start);
      if (end - start < (target.textContent?.length ?? 0)) target.splitText(end - start);
      const mark = document.createElement('mark');
      mark.className = HIGHLIGHT_CLASS;
      mark.setAttribute(HIGHLIGHT_ATTR, String(annotationId));
      mark.style.backgroundColor = bg;
      mark.style.borderRadius = '2px';
      mark.style.cursor = 'pointer';
      mark.style.color = 'inherit';
      target.parentNode?.insertBefore(mark, target);
      mark.appendChild(target);
    } catch {
      /* ignore a node we couldn't wrap */
    }
  }
  return true;
}

export { HIGHLIGHT_ATTR, HIGHLIGHT_CLASS };
