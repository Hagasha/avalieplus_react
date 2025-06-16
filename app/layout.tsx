import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { NotificationContainer } from "@/components/notification"

export const metadata = {
  title: "Avalieplus - Sistema de Avaliação de Filmes",
  description: "Sistema de avaliação de filmes com gerenciamento de usuários, filmes e avaliações",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main>{children}</main>
          <NotificationContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}
