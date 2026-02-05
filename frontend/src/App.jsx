import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProviderWrapper } from "./context/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";

import '@fontsource/geologica/400.css';
import '@fontsource/geologica/500.css';
import '@fontsource/geologica/700.css';

function App() {
  return (
    <ThemeProviderWrapper>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProviderWrapper>
  );
}

export default App;
