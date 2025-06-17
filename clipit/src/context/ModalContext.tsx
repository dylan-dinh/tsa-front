import React, { createContext, useContext, useState, useCallback, useMemo, FC, useEffect } from 'react';

type ModalContextType = {
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
};

const defaultContextValue: ModalContextType = {
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  openRegisterModal: () => {},
  closeRegisterModal: () => {},
};

const ModalContext = createContext<ModalContextType>(defaultContextValue);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    console.error('useModal must be used within a ModalProvider');
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  console.log('ModalProvider: Initializing');
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log('ModalProvider: Mounted');
    return () => {
      console.log('ModalProvider: Unmounted');
    };
  }, []);

  const openLoginModal = useCallback(() => {
    console.log('ModalProvider: Opening login modal');
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  }, []);

  const closeLoginModal = useCallback(() => {
    console.log('ModalProvider: Closing login modal');
    setIsLoginModalOpen(false);
  }, []);

  const openRegisterModal = useCallback(() => {
    console.log('ModalProvider: Opening register modal');
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  }, []);

  const closeRegisterModal = useCallback(() => {
    console.log('ModalProvider: Closing register modal');
    setIsRegisterModalOpen(false);
  }, []);

  const contextValue = useMemo(() => {
    console.log('ModalProvider: Updating context value');
    return {
      isLoginModalOpen,
      isRegisterModalOpen,
      openLoginModal,
      closeLoginModal,
      openRegisterModal,
      closeRegisterModal,
    };
  }, [
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
}; 