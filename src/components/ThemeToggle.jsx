import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function ThemeToggle() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    // Set initial theme based on user's preference
    useEffect(() => {
        const userPrefersDark = window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (!localStorage.getItem("theme")) {
            setTheme(userPrefersDark ? "dark" : "light");
        }
    }, []);

    // Update the document and localStorage when theme changes
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-primary text-primary-foreground shadow-md hover:opacity-80 transition"
        >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
    );
}
