import React from 'react';
import { ModalProvider } from '../src/context/ModalContext';
import LandingPage from '../src/components/Landing';

export default function Index() {
  return (
    <ModalProvider>
      <LandingPage />
    </ModalProvider>
  );
} 