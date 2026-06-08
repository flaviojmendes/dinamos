import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

interface AdminCard {
  to: string;
  title: string;
  description: string;
  /** Heroicons-style path(s) drawn inside a 24x24 stroked viewBox. */
  icon: string;
  accent: 'cyan' | 'green' | 'amber' | 'violet' | 'rose';
}

interface AdminSection {
  title: string;
  cards: AdminCard[];
}

const SECTIONS: AdminSection[] = [
  {
    title: 'Content & Learning',
    cards: [
      {
        to: '/admin/content-tree',
        title: 'Organize Content',
        description: 'Drag & drop modules and lessons to nest, reorder, and reassign.',
        icon: 'M4 6h16M4 6a2 2 0 00-2 2v0M9 12h11M9 12a2 2 0 00-2 2M14 18h6',
        accent: 'green',
      },
      {
        to: '/admin/content',
        title: 'Content Pages',
        description: 'Create and edit MDX lessons, titles, and simulators per language.',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        accent: 'cyan',
      },
      {
        to: '/admin/modules',
        title: 'Modules',
        description: 'Define learning modules, tiers, and base paths.',
        icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
        accent: 'cyan',
      },
      {
        to: '/admin/challenges',
        title: 'Challenges',
        description: 'Manage system-design challenges and their solutions.',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        accent: 'green',
      },
      {
        to: '/admin/quizzes',
        title: 'Quizzes',
        description: 'Author quizzes, questions, and themes.',
        icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        accent: 'violet',
      },
      {
        to: '/admin/game',
        title: 'Game Mode',
        description: 'Configure gamified learning experiences.',
        icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        accent: 'violet',
      },
    ],
  },
  {
    title: 'Community',
    cards: [
      {
        to: '/admin/forum/categories',
        title: 'Forum Categories',
        description: 'Organize discussion categories for the community forum.',
        icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
        accent: 'amber',
      },
      {
        to: '/admin/notifications',
        title: 'Notifications',
        description: 'Broadcast announcements and manage notifications.',
        icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
        accent: 'amber',
      },
    ],
  },
  {
    title: 'People & System',
    cards: [
      {
        to: '/admin/users',
        title: 'Users',
        description: 'View users, subscriptions, and account details.',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        accent: 'rose',
      },
      {
        to: '/admin/roles',
        title: 'Roles',
        description: 'Manage roles and permission assignments.',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        accent: 'rose',
      },
      {
        to: '/admin/dashboard',
        title: 'Analytics',
        description: 'Platform metrics, growth, and engagement charts.',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        accent: 'green',
      },
      {
        to: '/admin/settings',
        title: 'Settings',
        description: 'Global platform configuration.',
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
        accent: 'violet',
      },
    ],
  },
];

const accentClasses: Record<AdminCard['accent'], string> = {
  cyan: 'text-brand-600 dark:text-signal-cyan border-brand-200 dark:border-signal-cyan/30 bg-brand-50 dark:bg-signal-cyan/10',
  green: 'text-emerald-600 dark:text-signal-green border-emerald-200 dark:border-signal-green/30 bg-emerald-50 dark:bg-signal-green/10',
  amber: 'text-amber-600 dark:text-signal-amber border-amber-200 dark:border-signal-amber/30 bg-amber-50 dark:bg-signal-amber/10',
  violet: 'text-violet-600 dark:text-violet-300 border-violet-200 dark:border-violet-400/30 bg-violet-50 dark:bg-violet-400/10',
  rose: 'text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-400/30 bg-rose-50 dark:bg-rose-400/10',
};

export default function AdminHub() {
  const { appUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && appUser && appUser.role !== 'Admin') {
      navigate('/design-lab');
    }
  }, [appUser, loading, navigate]);

  if (!appUser || appUser.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600 dark:text-tactical-dim">Access Denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text">
            Admin Control Center
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-tactical-dim">
            Everything you can manage, in one place.
          </p>
        </div>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-tactical-label mb-3">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.cards.map((card) => (
                  <Link
                    key={card.to}
                    to={card.to}
                    className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-md dark:border-tactical-border dark:bg-tactical-surface dark:hover:border-signal-green/50"
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${accentClasses[card.accent]}`}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d={card.icon}
                        />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text group-hover:text-brand-700 dark:group-hover:text-signal-green">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-tactical-dim">
                        {card.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
