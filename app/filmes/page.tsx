"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Filme {
  id: number
  titulo: string
  diretor: string
  anoLancamento: string
  genero: string
  sinopse: string
}

export default function FilmesPage() {
  const [filmes, setFilmes] = useState<Filme[]>([
    {
      id: 1,
      titulo: "Interestelar",
      diretor: "Christopher Nolan",
      anoLancamento: "2014",
      genero: "Ficção Científica",
      sinopse:
        "Um grupo de astronautas viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.",
    },
    {
      id: 2,
      titulo: "Pulp Fiction",
      diretor: "Quentin Tarantino",
      anoLancamento: "1994",
      genero: "Crime",
      sinopse:
        "As vidas de dois assassinos da máfia, um boxeador, um gângster e sua esposa, e um par de bandidos se entrelaçam em quatro histórias de violência e redenção.",
    },
    {
      id: 3,
      titulo: "Parasita",
      diretor: "Bong Joon-ho",
      anoLancamento: "2019",
      genero: "Drama",
      sinopse:
        "A família Kim, pobre e desempregada, desenvolve interesse pela rica família Park, até que se envolvem em um incidente inesperado.",
    },
  ])

  const [novoFilme, setNovoFilme] = useState<Omit<Filme, "id">>({
    titulo: "",
    diretor: "",
    anoLancamento: "",
    genero: "",
    sinopse: "",
  })

  const [filmeEditando, setFilmeEditando] = useState<Filme | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)

  const generos = [
    "Ação",
    "Aventura",
    "Animação",
    "Comédia",
    "Crime",
    "Documentário",
    "Drama",
    "Fantasia",
    "Ficção Científica",
    "Musical",
    "Romance",
    "Suspense",
    "Terror",
  ]

  const adicionarFilme = () => {
    const novoId = filmes.length > 0 ? Math.max(...filmes.map((f) => f.id)) + 1 : 1

    setFilmes([
      ...filmes,
      {
        id: novoId,
        ...novoFilme,
      },
    ])

    setNovoFilme({
      titulo: "",
      diretor: "",
      anoLancamento: "",
      genero: "",
      sinopse: "",
    })
    setDialogAberto(false)
  }

  const atualizarFilme = () => {
    if (!filmeEditando) return

    setFilmes(filmes.map((f) => (f.id === filmeEditando.id ? filmeEditando : f)))

    setFilmeEditando(null)
    setDialogAberto(false)
    setModoEdicao(false)
  }

  const excluirFilme = (id: number) => {
    setFilmes(filmes.filter((f) => f.id !== id))
  }

  const abrirDialogCriacao = () => {
    setNovoFilme({
      titulo: "",
      diretor: "",
      anoLancamento: "",
      genero: "",
      sinopse: "",
    })
    setModoEdicao(false)
    setDialogAberto(true)
  }

  const abrirDialogEdicao = (filme: Filme) => {
    setFilmeEditando(filme)
    setModoEdicao(true)
    setDialogAberto(true)
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Filmes</CardTitle>
            <CardDescription>Gerencie o catálogo de filmes</CardDescription>
          </div>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button onClick={abrirDialogCriacao}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Filme
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{modoEdicao ? "Editar Filme" : "Adicionar Filme"}</DialogTitle>
                <DialogDescription>
                  {modoEdicao
                    ? "Edite os dados do filme e clique em salvar quando terminar."
                    : "Preencha os dados do novo filme e clique em adicionar quando terminar."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={modoEdicao ? filmeEditando?.titulo || "" : novoFilme.titulo}
                    onChange={(e) => {
                      if (modoEdicao && filmeEditando) {
                        setFilmeEditando({ ...filmeEditando, titulo: e.target.value })
                      } else {
                        setNovoFilme({ ...novoFilme, titulo: e.target.value })
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="diretor">Diretor</Label>
                  <Input
                    id="diretor"
                    value={modoEdicao ? filmeEditando?.diretor || "" : novoFilme.diretor}
                    onChange={(e) => {
                      if (modoEdicao && filmeEditando) {
                        setFilmeEditando({ ...filmeEditando, diretor: e.target.value })
                      } else {
                        setNovoFilme({ ...novoFilme, diretor: e.target.value })
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="anoLancamento">Ano de Lançamento</Label>
                  <Input
                    id="anoLancamento"
                    value={modoEdicao ? filmeEditando?.anoLancamento || "" : novoFilme.anoLancamento}
                    onChange={(e) => {
                      if (modoEdicao && filmeEditando) {
                        setFilmeEditando({ ...filmeEditando, anoLancamento: e.target.value })
                      } else {
                        setNovoFilme({ ...novoFilme, anoLancamento: e.target.value })
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="genero">Gênero</Label>
                  <Select
                    value={modoEdicao ? filmeEditando?.genero || "" : novoFilme.genero}
                    onValueChange={(value) => {
                      if (modoEdicao && filmeEditando) {
                        setFilmeEditando({ ...filmeEditando, genero: value })
                      } else {
                        setNovoFilme({ ...novoFilme, genero: value })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      {generos.map((genero) => (
                        <SelectItem key={genero} value={genero}>
                          {genero}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sinopse">Sinopse</Label>
                  <Textarea
                    id="sinopse"
                    rows={3}
                    value={modoEdicao ? filmeEditando?.sinopse || "" : novoFilme.sinopse}
                    onChange={(e) => {
                      if (modoEdicao && filmeEditando) {
                        setFilmeEditando({ ...filmeEditando, sinopse: e.target.value })
                      } else {
                        setNovoFilme({ ...novoFilme, sinopse: e.target.value })
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={modoEdicao ? atualizarFilme : adicionarFilme}>
                  {modoEdicao ? "Salvar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Diretor</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Gênero</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filmes.map((filme) => (
                <TableRow key={filme.id}>
                  <TableCell>{filme.id}</TableCell>
                  <TableCell>{filme.titulo}</TableCell>
                  <TableCell>{filme.diretor}</TableCell>
                  <TableCell>{filme.anoLancamento}</TableCell>
                  <TableCell>{filme.genero}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => abrirDialogEdicao(filme)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => excluirFilme(filme.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
