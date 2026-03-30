import React, { createContext, useContext, useEffect, useState } from "react";

interface FontSizeContextType {
  fontSize: string;
  setFontSize: (size: string) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined,
);

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || "medium";
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--appFontSize",
      fontSize === "small" ? "13px" : fontSize === "large" ? "17px" : "15px",
    );
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const ctx = useContext(FontSizeContext);
  if (!ctx) throw new Error("useFontSize must be used within FontSizeProvider");
  return ctx;
};
