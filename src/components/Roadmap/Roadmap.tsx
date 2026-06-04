import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContentProgress } from '../../hooks/useContentProgress';
import ContentLayout from '../Common/ContentLayout';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Add a declaration for the window object with our custom property
declare global {
  interface Window {
    __APP_DATA__?: {
      menuItems: MenuItem[];
    }
  }
}

// Use the same MenuItem interface that App.tsx uses
interface MenuItem {
  name: string;
  description: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  status?: "recommended" | "new" | "coming-soon" | "required";
  prerequisites?: string[];
  category?: "Básico" | "Intermediário" | "Avançado" | "Foundational" | "Building Blocks" | "Application" | "Advanced Concepts" | "Security & Safety";
  skills?: string[];
  badges?: { text: string; color: string }[];
  component?: React.ComponentType;
  disabled?: boolean;
  customStyle?: string;
  customHoverStyle?: string;
}

const getChildPaths = (item: MenuItem): string[] => {
  const paths: string[] = [];
  if (item.children) {
    for (const child of item.children) {
      paths.push(child.path);
      // Get paths from child's children (simulators, etc)
      if (child.children) {
        for (const grandchild of child.children) {
          paths.push(grandchild.path);
        }
      }
    }
  }
  return paths;
};

export default function Roadmap() {
  const { isCompleted } = useContentProgress();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { t } = useTranslation();

  // Access the menuItems array from the window object
  // This is added to window by App.tsx when it initializes
  useEffect(() => {
    // Check if we can access App's menuItems through the window object
    // This is a hack, but it avoids circular dependencies
    const getMenuItems = () => {
      // Try to access from window.__APP_DATA__ if available (you need to add this in App.tsx)
      if (window.__APP_DATA__ && window.__APP_DATA__.menuItems) {
        return window.__APP_DATA__.menuItems;
      }
      return [];
    };

    // Set menu items from App
    const items = getMenuItems();
    if (items && items.length > 0) {
      setMenuItems(items);
    }
  }, [location]); // Re-run when location changes to catch any updates

  // Transform menuItems to the roadmap structure
  const roadmapItems = menuItems.filter(item => 
    // Filter out special items like "Comece Aqui", the roadmap itself, and external tools
    item.path !== "/roadmap" && 
    !item.path.includes("editor") && 
    !item.path.startsWith("http")
  );

  const getStepStatus = (item: MenuItem) => {
    if (isCompleted(item.path)) {
      return 'text-signal-green';
    }

    if (item.badges?.some(badge => badge.text === "Grátis" || badge.text === "Free")) {
      return 'text-signal-green'; // Free content
    } else if (item.status === 'recommended' || item.status === 'new') {
      return 'text-signal-cyan'; // Recommended content
    } else if (item.status === 'required') {
      return 'text-brand-600 dark:text-signal-amber'; // Required content
    } else {
      return 'text-brand-600 dark:text-tactical-dim'; // Default content
    }
  };
  const makeMenuKey = (path: string, field: 'name' | 'description') => `menu.${path.replace(/^\//, '').replace(/\//g, '.')}.${field}`;
  
  const translateBadgeText = (badgeText: string) => {
    if (!badgeText) return '';
    if (badgeText.toLowerCase() === 'grátis') return t('badges.free');
    if (badgeText.toLowerCase() === 'novo') return t('badges.new');
    return badgeText;
  };
      
  const calculateProgress = () => {
    const getAllItems = (items: MenuItem[]): MenuItem[] => {
      return items.reduce((acc: MenuItem[], item) => {
        if (item.path !== '/roadmap' && !item.disabled) {
          acc.push(item);
          if (item.children) {
            acc.push(...getAllItems(item.children));
          }
        }
        return acc;
    }, []);
    };

    const allItems = getAllItems(menuItems);
    const completedItems = allItems.filter(item => isCompleted(item.path));
    return Math.round((completedItems.length / allItems.length) * 100);
  };

  const renderItem = (item: MenuItem, index: number, isChild = false) => {
    const childPaths = getChildPaths(item);
    const defaultIcon = (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );

    const statusLabel = isCompleted(item.path)
      ? t('roadmap.completed')
      : item.badges?.some(badge => badge.text === "Grátis" || badge.text === "Free")
        ? t('roadmap.free')
        : item.status === 'recommended'
          ? t('status.recommended')
          : item.status === 'new'
            ? t('status.new')
            : t('status.content');

    const displayName = t(makeMenuKey(item.path, 'name'), { defaultValue: item.name });
    const displayDescription = t(makeMenuKey(item.path, 'description'), { defaultValue: item.description });

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        key={item.path}
        className={`relative ${isChild ? 'ml-8 mt-4' : 'mb-8'}`}
      >
        <div className="tactical-panel p-6 hover:border-slate-400 dark:hover:border-signal-green transition-colors">
          <div className="flex items-start gap-4">
            <div className={`p-3 border relative group ${
              isCompleted(item.path) ? 'border-signal-green/50 bg-signal-green/10' : 'border-brand-500/30 bg-brand-500/10 dark:border-signal-cyan/30 dark:bg-signal-cyan/10'
            }`}>
              <div className="text-brand-600 dark:text-brand-400">
                {item.icon ? React.cloneElement(item.icon as React.ReactElement, {
                  className: `w-6 h-6 ${isCompleted(item.path) ? 'text-green-400' : 'text-brand-600 dark:text-brand-400'}`
                }) : 
                React.cloneElement(defaultIcon, {
                  className: `w-6 h-6 ${isCompleted(item.path) ? 'text-green-400' : 'text-brand-600 dark:text-brand-400'}`
                })}
              </div>
              {isCompleted(item.path) && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-3 mb-2">
                <h3 className="text-xl font-mono font-semibold text-slate-900 dark:text-tactical-text">{displayName}</h3>
                <span className={`font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 border border-slate-200 dark:border-tactical-border ${getStepStatus(item)}`}>
                  {statusLabel}
                </span>
                {item.badges?.map((badge, i) => (
                  <span key={i} className="font-mono text-[11px] uppercase tracking-wider text-signal-green">
                    [{translateBadgeText(badge.text)}]
                  </span>
                ))}
              </div>
              <p className="text-slate-600 dark:text-tactical-dim mb-4">{displayDescription}</p>
              
              {item.prerequisites && item.prerequisites.length > 0 && (
                <div className="mb-4">
                  <div className="label-mono mb-2">{t('roadmap.prerequisites')}</div>
                  <div className="flex flex-wrap gap-2">
                    {item.prerequisites.map(prereq => (
                      <span key={prereq} className="font-mono text-xs border border-slate-200 dark:border-tactical-border px-2 py-1 text-slate-600 dark:text-tactical-dim">
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.skills && item.skills.length > 0 && (
                <div className="mb-4">
                  <div className="label-mono mb-2">{t('roadmap.skills')}</div>
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map(skill => (
                      <span key={skill} className="font-mono text-xs border border-slate-200 dark:border-tactical-border px-2 py-1 text-slate-600 dark:text-tactical-dim">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                to={item.path}
                state={{ childPaths }}
                className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-brand-600 dark:text-signal-green hover:opacity-80 transition-opacity"
              >
                {isCompleted(item.path) ? t('roadmap.review_module') : t('roadmap.start_module')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {item.children && (
            <div className="mt-4 ml-8 space-y-4">
              {item.children.map((child, childIndex) => renderItem(child, childIndex, true))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Display a loading state until we've fetched the menu items
  if (menuItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ContentLayout hideCompletion>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-300">{t('common.loading')}</p>
            </div>
          </div>
        </ContentLayout>
      </div>
    );
  }

  const percent = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ContentLayout hideCompletion>
        <div className="space-y-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-tactical-text">{t('roadmap.title')}</h1>
              <span className="font-mono text-[11px] uppercase tracking-wider text-signal-amber">[OPS MAP]</span>
            </div>
            <p className="text-lg text-slate-600 dark:text-tactical-dim mb-4">
              {t('roadmap.description_1')}
              {" "}
              {t('roadmap.description_2')}
            </p>

            <div className="bg-slate-200 dark:bg-tactical-raised h-4 overflow-hidden">
              <div
                className="seg-bar h-full text-signal-green transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="label-mono mt-2">
              {t('roadmap.completed_percent', { percent })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="tactical-panel p-4">
              <div className="label-mono mb-2 text-signal-green">{t('roadmap.free')}</div>
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-tactical-text">
                {menuItems.filter(item => item.badges?.some(b => b.text === "Grátis" || b.text === "Free")).length} {t('roadmap.modules')}
              </div>
            </div>
            <div className="tactical-panel p-4">
              <div className="label-mono mb-2 text-signal-cyan">{t('roadmap.premium')}</div>
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-tactical-text">
                {menuItems.filter(item => !item.badges?.some(b => b.text === "Grátis" || b.text === "Free") && !item.disabled).length} {t('roadmap.modules')}
              </div>
            </div>
            <div className="tactical-panel p-4">
              <div className="label-mono mb-2 text-signal-amber">{t('roadmap.in_dev')}</div>
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-tactical-text">
                {menuItems.filter(item => item.status === 'coming-soon' || item.disabled).length} {t('roadmap.modules')}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {roadmapItems.map((item, index) => renderItem(item, index))}
          </div>
        </div>
      </ContentLayout>
    </div>
  );
} 