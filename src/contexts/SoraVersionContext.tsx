import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SoraVersion } from '../types/content';
import { contentService } from '../services/contentService';

interface SoraVersionContextType {
  version: SoraVersion;
  setVersion: (version: SoraVersion) => void;
}

const SoraVersionContext = createContext<SoraVersionContextType | undefined>(undefined);

export const SoraVersionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [version, setVersionState] = useState<SoraVersion>(contentService.getVersion());

  const setVersion = (newVersion: SoraVersion) => {
    contentService.setVersion(newVersion);
    setVersionState(newVersion);
  };

  return (
    <SoraVersionContext.Provider value={{ version, setVersion }}>
      {children}
    </SoraVersionContext.Provider>
  );
};

export const useSoraVersion = (): SoraVersionContextType => {
  const context = useContext(SoraVersionContext);
  if (context === undefined) {
    throw new Error('useSoraVersion must be used within a SoraVersionProvider');
  }
  return context;
};
