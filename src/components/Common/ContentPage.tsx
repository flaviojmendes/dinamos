import React from 'react';
import { useLocation } from 'react-router-dom';
import ContentLayout from './ContentLayout';

interface Props {
  children: React.ReactNode;
}

export default function ContentPage({ children }: Props) {
  const location = useLocation();
  const childPaths = location.state?.childPaths || [];
  
  // Log for debugging
  console.log('Current path:', location.pathname);
  console.log('Child paths:', childPaths);

  return (
    <ContentLayout childPaths={childPaths}>
      {children}
    </ContentLayout>
  );
} 
