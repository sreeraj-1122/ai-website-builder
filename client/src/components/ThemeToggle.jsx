import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

function ThemeToggle({ className = "" }) {
    const [theme, setTheme] = useState(() => localStorage.getItem("genweb-theme") || "light")

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(theme)
        localStorage.setItem("genweb-theme", theme)
    }, [theme])

    return (
        <button
            type='button'
            aria-label='Toggle theme'
            onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
            className={`grid h-9 w-9 place-items-center rounded-md bg-[--color-bg-elevated] text-[--color-text-secondary] shadow-sm transition hover:-translate-y-0.5 hover:bg-[--color-bg-hover] hover:text-[--color-text-primary] ${className}`}
        >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
    )
}

export default ThemeToggle
