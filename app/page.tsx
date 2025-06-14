import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Film, Star, User } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-4xl font-bold text-center">Bem-vindo ao Avalieplus</h1>
        <p className="text-xl text-center text-muted-foreground max-w-2xl">
          Seu sistema de avaliação de filmes. Gerencie usuários, filmes e avaliações de forma simples e eficiente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
          <Link href="/usuarios" className="w-full">
            <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all flex flex-col items-center space-y-4">
              <User size={48} className="text-primary" />
              <h2 className="text-2xl font-semibold">Usuários</h2>
              <p className="text-center text-muted-foreground">Gerencie os usuários do sistema</p>
              <Button className="w-full">Acessar</Button>
            </div>
          </Link>

          <Link href="/filmes" className="w-full">
            <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all flex flex-col items-center space-y-4">
              <Film size={48} className="text-primary" />
              <h2 className="text-2xl font-semibold">Filmes</h2>
              <p className="text-center text-muted-foreground">Cadastre e gerencie filmes</p>
              <Button className="w-full">Acessar</Button>
            </div>
          </Link>

          <Link href="/avaliacoes" className="w-full">
            <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all flex flex-col items-center space-y-4">
              <Star size={48} className="text-primary" />
              <h2 className="text-2xl font-semibold">Avaliações</h2>
              <p className="text-center text-muted-foreground">Gerencie as avaliações dos filmes</p>
              <Button className="w-full">Acessar</Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
