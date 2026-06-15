"use client";

import * as React from "react";

import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { PersonaProvider } from "./PersonaProvider";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PersonaProvider>
          {children}
        </PersonaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}