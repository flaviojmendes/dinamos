export interface LessonHeading {
  id: string;
  label: string;
  element: HTMLHeadingElement;
}

/** IDs belong to headings, never to a duplicate copy of the lesson text. */
export function collectLessonHeadings(
  container: HTMLElement,
  generatedIds: Map<HTMLHeadingElement, string>,
): LessonHeading[] {
  const elements = Array.from(container.querySelectorAll<HTMLHeadingElement>('h2'))
    .filter((element) => !element.closest('[data-lesson-grid]') && element.textContent?.trim());
  const candidates = new Set<Element>(elements);
  const reserved = new Set(
    Array.from(container.ownerDocument.querySelectorAll<HTMLElement>('[id]'))
      .filter((element) => !candidates.has(element))
      .map((element) => element.id),
  );
  const used = new Set<string>();
  const existingIds = new Set(elements
    .filter((element) => element.id)
    .map((element) => element.id));

  return elements.map((element) => {
    const label = (element.textContent ?? '').replace(/\s+/g, ' ').trim();
    let id = element.id;
    if (!id || reserved.has(id) || used.has(id)) {
      const slug = label.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
      const base = `lesson-${slug || 'section'}`;
      id = base;
      let suffix = 2;
      while (reserved.has(id) || used.has(id) || existingIds.has(id)) id = `${base}-${suffix++}`;
      element.id = id;
      generatedIds.set(element, id);
    }
    used.add(id);
    return { id, label, element };
  });
}

export function clearGeneratedHeadingIds(generatedIds: Map<HTMLHeadingElement, string>): void {
  generatedIds.forEach((id, element) => {
    // A content author or another integration may have replaced an ID since.
    if (element.id === id) element.removeAttribute('id');
  });
  generatedIds.clear();
}
