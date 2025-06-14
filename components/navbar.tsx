"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Home, Star, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/usuarios", label: "Usuários", icon: User },
    { href: "/filmes", label: "Filmes", icon: Film },
    { href: "/avaliacoes", label: "Avaliações", icon: Star },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <Film className="h-6 w-6" />
          <span className="text-xl font-bold">Avalieplus</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
