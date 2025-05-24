import React from 'react';
import { ModalProvider } from '../context/ModalContext';
import LandingPage from '../components/Landing';

export default function Index() {
  return (
    <ModalProvider>
      <LandingPage />
    </ModalProvider>
  );
} 