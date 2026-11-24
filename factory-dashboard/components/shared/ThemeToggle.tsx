'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-base border border-border bg-surface" />;
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center justify-center w-8 h-8 rounded-base border border-border bg-surface hover:bg-surface-elevated transition shadow-2xs text-ink"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-muted hover:text-ink transition" />
      ) : (
        <Moon className="w-4 h-4 text-muted hover:text-ink transition" />
      )}
    </button>
  );
}
