import { Toaster, toast as hotToast, ToastBar } from "react-hot-toast";
import { useTheme } from "./ThemeContext";
import { useEffect } from "react";

export function showToast(
  message: string,
  type: "success" | "error" | "info" = "info",
) {
  if (type === "success") hotToast.success(message);
  else if (type === "error") hotToast.error(message);
  else hotToast(message);
}

export function GlobalToaster() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    document.body.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          fontFamily: "Cairo, sans-serif",
          fontSize: "var(--appFontSize)",
          background: "var(--backgroundColor)",
          color: "var(--textColor)",
          border: "1px solid var(--borderColor)",
          borderRadius: "1rem",
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)",
        },
        success: {
          iconTheme: { primary: "var(--primeColor)", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "var(--errorColor)", secondary: "#fff" },
        },
      }}
    >
      {(t) => <ToastBar toast={t} style={{ direction: "rtl" }} />}
    </Toaster>
  );
}
