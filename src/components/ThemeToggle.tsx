import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const [isPaperTheme, setIsPaperTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "paper") {
      setIsPaperTheme(true);
      document.documentElement.classList.add("paper");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isPaperTheme;
    setIsPaperTheme(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("paper");
      localStorage.setItem("theme", "paper");
    } else {
      document.documentElement.classList.remove("paper");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-card/80 backdrop-blur-sm border hover:bg-accent transition-all duration-300"
      aria-label="Toggle theme"
    >
      {isPaperTheme ? (
        <Moon className="h-5 w-5 text-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-teal" />
      )}
    </Button>
  );
};