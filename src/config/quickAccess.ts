// Top-level destinations surfaced both in the sidebar and the always-visible
// top status bar, so quick access is reachable from anywhere in the app.
export interface QuickAccessLink {
  to: string;
  labelKey: string;
  label: string;
  d: string;
}

export const quickAccessLinks: QuickAccessLink[] = [
  { to: '/', labelKey: 'command_center', label: 'Command Center', d: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/roadmap', labelKey: 'roadmap', label: 'Roadmap', d: 'M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 012.447-1.842L9 5m0 15l6-3m-6 3V5m6 12l5.447 2.724A2 2 0 0021 15.382V5.618a2 2 0 00-2.447-1.842L15 5m0 12V5' },
  { to: '/editor', labelKey: 'editor', label: 'System Editor', d: 'M11 4H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-7m-9 2l9-9 3 3-9 9H8v-2z' },
  { to: '/forum', labelKey: 'forum', label: 'Forum', d: 'M8 12h8M8 8h8m-8 8h5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/preferences', labelKey: 'preferences', label: 'Preferences', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];
