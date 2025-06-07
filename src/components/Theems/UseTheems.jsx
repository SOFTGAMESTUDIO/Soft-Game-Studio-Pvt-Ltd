import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    let initialTheme;

    if (storedTheme) {
      initialTheme = storedTheme;
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      initialTheme = prefersDark ? "dark" : "light";
    }

    document.documentElement.classList.remove("light", "dark"); // 🧹 Remove both
    document.documentElement.classList.add(initialTheme);
    setTheme(initialTheme);
  }, []);

  const toggleTheme = (newTheme) => {
    // 🧹 Remove the previous theme
    document.documentElement.classList.remove("light", "dark");
    // ✅ Add the new one
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return {
    theme,
    setTheme: toggleTheme, // ✅ Expose toggleTheme
  };
}
