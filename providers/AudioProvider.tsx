'use client';

import { AudioContextType, AudioProps } from '@/types';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Key for localStorage
const AUDIO_STORAGE_KEY = 'currentAudio';

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audio, _setAudio] = useState<AudioProps | undefined>();
  const pathname = usePathname();

  // Load audio from localStorage on initial render
  useEffect(() => {
    const savedAudio = localStorage.getItem(AUDIO_STORAGE_KEY);
    if (savedAudio) {
      try {
        const parsedAudio = JSON.parse(savedAudio) as AudioProps;
        _setAudio(parsedAudio);
      } catch (error) {
        console.error('Failed to parse audio from localStorage', error);
        localStorage.removeItem(AUDIO_STORAGE_KEY);
      }
    }
  }, []);

  // Wrapper function to save to localStorage when setting audio
  const setAudio = (value: React.SetStateAction<AudioProps | undefined>) => {
    _setAudio((prev) => {
      const newValue = typeof value === 'function' ? value(prev) : value;

      // Save to localStorage whenever audio changes
      if (newValue) {
        localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(newValue));
      } else {
        localStorage.removeItem(AUDIO_STORAGE_KEY);
      }

      return newValue;
    });
  };

  // Clear audio when navigating to create-podcast page
  useEffect(() => {
    if (pathname === '/create-podcast') {
      setAudio(undefined);
    }
  }, [pathname]);

  return (
    <AudioContext.Provider value={{ audio, setAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);

  if (!context)
    throw new Error('useAudio must be used within an AudioProvider');

  return context;
};

export default AudioProvider;
