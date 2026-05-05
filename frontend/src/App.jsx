import { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import { ThemeProviderWrapper } from "./context/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import LayoutWithSearch from './components/layout/LayoutWithSearch';
import { useAuth } from '@clerk/clerk-react';
import { useProfileStore } from './store/useProfileStore';
import { useComponentsStore } from './store/useComponentsStore';
import { useSearchStore } from './store/useSearchStore';
import '@fontsource/geologica/500.css';

function App() {
  const { isLoaded, isSignedIn } = useAuth();
  const [, setIsDataReady] = useState(false);
  const profile = useProfileStore(state => state.profile);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !profile) {
      useSearchStore.getState().setSearchData({ components: [], schematics: [] });
      return;
    }
    const initData = async () => {
      try {
        const componentsStore = useComponentsStore.getState();
        if (componentsStore.components?.length === 0) {
          await useComponentsStore.getState().fetchComponents();
        }
        let attempts = 0;
        while (attempts < 20) {
          const store = useComponentsStore.getState();
          if (store.components?.length > 0) break;
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        const store = useComponentsStore.getState();

        useSearchStore.getState().setSearchData({
          components: store.components || [],
          schematics: []
        });

        setIsDataReady(true);
      } catch (error) {
        console.error('APP initData FAILED:', error);
        setIsDataReady(true);
      }
    };

    initData();
  }, [isLoaded, isSignedIn, profile]);

  return (
    <ThemeProviderWrapper>
      <HashRouter>
        <LayoutWithSearch>
          <AppRoutes />
        </LayoutWithSearch>
      </HashRouter>
    </ThemeProviderWrapper>
  );
}

export default App;