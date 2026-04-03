import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../utils/ThemeContext.tsx";
import { FontSizeProvider } from "../utils/FontSizeContext.tsx";
import { AuthProvider } from "../utils/Supabase/Auth/useAuthUser";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,               // Retry once instead of 3 times
      retryDelay: 1000,       // 1 second between retries
      staleTime: 1000 * 60,   // Data stays fresh for 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FontSizeProvider>
          <BrowserRouter>
            <AuthProvider>
              <div
                className="min-h-screen overflow-hidden bg-[var(--backgroundColor)] text-[var(--textColor)] transition-colors duration-300"
                style={{ fontSize: "var(--appFontSize)" }}
              >
                <App />
              </div>
            </AuthProvider>
          </BrowserRouter>
        </FontSizeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
