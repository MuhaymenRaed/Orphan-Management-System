import { useEffect } from "react";
import { useGetSettings } from "../ReactQuerry/Settings/useSettings";
import { useTheme } from "../ThemeContext";
import { useFontSize } from "../FontSizeContext";

/**
 * Fetches user settings from Supabase on mount and applies
 * theme_mode + font_size globally. This replaces the need
 * to visit the Settings page for preferences to take effect.
 */
export function useGlobalSettings() {
  const { data: settings } = useGetSettings();
  const { setTheme } = useTheme();
  const { setFontSize } = useFontSize();

  useEffect(() => {
    if (!settings) return;

    if (settings.theme_mode) {
      setTheme(settings.theme_mode);
    }
    if (settings.font_size) {
      setFontSize(settings.font_size);
    }
  }, [settings, setTheme, setFontSize]);
}
