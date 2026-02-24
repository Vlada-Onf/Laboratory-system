import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProviderWrapper } from "./context/ThemeProvider";
import HistoryProvider from "./store/HistoryProvider";
import AppRoutes from "./routes/AppRoutes";
import LayoutWithSearch from './components/layout/LayoutWithSearch';
import { useAuth } from '@clerk/clerk-react';

import '@fontsource/geologica/500.css';

function AppContent() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (import.meta.env.DEV && isLoaded && isSignedIn) {
      const hasForcedLogout = localStorage.getItem('forcedLogout');

      if (!hasForcedLogout) {
        localStorage.setItem('forcedLogout', 'true');
        localStorage.clear();
        window.location.replace('/sign-in');
      }
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return <div>Завантажуємо...</div>;

  return (
    <LayoutWithSearch>
      <AppRoutes />
    </LayoutWithSearch>
  );
}


function App() {
  return (
    <ThemeProviderWrapper>
      <HistoryProvider>
          <BrowserRouter>
          <LayoutWithSearch>
            <AppRoutes />
          </LayoutWithSearch>
        </BrowserRouter>
      </HistoryProvider>
    </ThemeProviderWrapper>
  );
}

export default App;
