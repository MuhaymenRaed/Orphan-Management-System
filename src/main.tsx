import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../utils/ThemeContext.tsx";
import { FontSizeProvider } from "../utils/FontSizeContext.tsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FontSizeProvider>
          <BrowserRouter>
            <div
              className="min-h-screen overflow-hidden bg-[var(--backgroundColor)] text-[var(--textColor)] transition-colors duration-300"
              style={{ fontSize: "var(--appFontSize)" }}
            >
              <App />
            </div>
          </BrowserRouter>
        </FontSizeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
