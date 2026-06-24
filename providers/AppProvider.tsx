"use client";

import * as React from "react";

import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { PersonaProvider } from "./PersonaProvider";
import { FeedProvider } from "./FeedProvider";
import CircleProvider from "./CircleProvider";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PersonaProvider>
          <FeedProvider>
            <CircleProvider>
              {children}
            </CircleProvider>
          </FeedProvider>
        </PersonaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}