import { IconButton, Tooltip } from "@mui/material";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle({ size = "medium" }: { size?: "small" | "medium" }) {
  const { theme, toggle } = useTheme();
  return (
    <Tooltip title={theme === "dark" ? "Light mode" : "Dark mode"}>
      <IconButton onClick={toggle} size={size} sx={{ borderRadius: 2 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: "inline-flex" }}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </motion.span>
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  );
}
