import React from 'react';
import { useLocation } from 'react-router-dom';
import CompletionButton from './CompletionButton';

interface Props {
  children: React.ReactNode;
  hideCompletion?: boolean;
  childPaths?: string[];
}

export default function ContentLayout({ children, hideCompletion = false, childPaths = [] }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="relative">
      {children}
      {!hideCompletion && (
        <CompletionButton path={currentPath} childPaths={childPaths} />
      )}
    </div>
  );
} 