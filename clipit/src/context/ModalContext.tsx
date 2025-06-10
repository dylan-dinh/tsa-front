import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

type ModalContextType = {
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
};

// Créer le contexte avec une valeur par défaut
const ModalContext = createContext<ModalContextType>({
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  openRegisterModal: () => {},
  closeRegisterModal: () => {},
});

// Hook personnalisé pour utiliser le contexte
export function useModal() {
  return useContext(ModalContext);
}

// Provider component
export function ModalProvider({ children }: { children: React.ReactNode }) {
  // État local pour les modales
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Callbacks pour ouvrir/fermer les modales
  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const openRegisterModal = useCallback(() => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  }, []);

  const closeRegisterModal = useCallback(() => {
    setIsRegisterModalOpen(false);
  }, []);

  // Mémoriser la valeur du contexte
  const contextValue = useMemo(() => ({
    isLoginModalOpen,
    isRegisterModalOpen,
    openLoginModal,
    closeLoginModal,
    openRegisterModal,
    closeRegisterModal,
  }), [
    isLoginModalOpen,
    isRegisterModalOpen,
    openLoginModal,
    closeLoginModal,
    openRegisterModal,
    closeRegisterModal,
  ]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
} 