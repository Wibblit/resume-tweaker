"use client"

import * as React from "react"
// import { MoonIcon, SunIcon, DesktopIcon } from "@radix-ui/react-icons"
import { Sun, Moon, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const themes = [
  { name: "Light", icon: <Sun className="h-[1.2rem] w-[1.2rem]" /> },
  { name: "Dark", icon: <Moon className="h-[1.2rem] w-[1.2rem]" /> },
  { name: "System", icon: <Laptop className="h-[1.2rem] w-[1.2rem]" /> },
]

export function ModeToggle() {
  const { setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const toggleRef = React.useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme)
    setIsOpen(false)
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toggleRef.current && !toggleRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block text-left" ref={toggleRef}>
      <Button variant="outline" size="icon" onClick={toggleDropdown} className={`${isOpen ? "opacity-0" : ""} md:opacity-100 transition-all duration-300 `}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile view */}
            <motion.div
              className="absolute left-0 top-0 gap-2 flex origin-top-left flex-start items-start md:hidden"
              initial={{ opacity: 1, x: 0, y: 0,}}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {themes.map((theme, index) => (
                <motion.button
                  key={theme.name}
                  onClick={() => changeTheme(theme.name.toLowerCase())}
                  className="mb-2 flex h-[2.30rem] w-[2.30rem]  items-center justify-center rounded-lg z-10 bg-background shadow-lg border"
                  initial={{ opacity: 0, x: -40 * index  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 * index }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: "easeInOut" }}
                >
                  {theme.icon}
                </motion.button>
              ))}
            </motion.div>

            {/* Tablet and above view */}
            <motion.div
              className="absolute right-0 mt-2 hidden origin-top-right rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:block"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {themes.map((theme, index) => (
                <motion.button
                  key={theme.name}
                  onClick={() => changeTheme(theme.name.toLowerCase())}
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
                >
                  <span className="mr-2">{theme.icon}</span>
                  {theme.name}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

