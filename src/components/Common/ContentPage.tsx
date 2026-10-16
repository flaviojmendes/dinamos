import React from 'react';
import { useLocation } from 'react-router-dom';
import ContentLayout from './ContentLayout';

interface Props {
  children: React.ReactNode;
}

export default function ContentPage({ children }: Props) {
  const location = useLocation();
  const childPaths = location.state?.childPaths || [];
  
  return (
    <ContentLayout childPaths={childPaths}>
      {children}
    </ContentLayout>
  );
} 
