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
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Plus, Star, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Avaliacao {
  id: number
  filmeId: number
  filmeTitulo: string
  usuarioId: number
  usuarioNome: string
  nota: number
  comentario: string
  data: string
}

interface Usuario {
  id: number
  nome: string
}

interface Filme {
  id: number
  titulo: string
}

export default function AvaliacoesPage() {
  const usuarios: Usuario[] = [
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos" },
    { id: 3, nome: "Pedro Oliveira" },
  ]

  const filmes: Filme[] = [
    { id: 1, titulo: "Interestelar" },
    { id: 2, titulo: "Pulp Fiction" },
    { id: 3, titulo: "Parasita" },
  ]

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([
    {
      id: 1,
      filmeId: 1,
      filmeTitulo: "Interestelar",
      usuarioId: 1,
      usuarioNome: "João Silva",
      nota: 5,
      comentario: "Um dos melhores filmes de ficção científica que já assisti!",
      data: "15/05/2023",
    },
    {
      id: 2,
      filmeId: 2,
      filmeTitulo: "Pulp Fiction",
      usuarioId: 2,
      usuarioNome: "Maria Santos",
      nota: 4,
      comentario: "Clássico do cinema, diálogos brilhantes.",
      data: "22/06/2023",
    },
    {
      id: 3,
      filmeId: 3,
      filmeTitulo: "Parasita",
      usuarioId: 3,
      usuarioNome: "Pedro Oliveira",
      nota: 5,
      comentario: "Obra-prima do cinema coreano, merece todos os prêmios que recebeu.",
      data: "10/07/2023",
    },
  ])

  const [novaAvaliacao, setNovaAvaliacao] = useState<Omit<Avaliacao, "id" | "filmeTitulo" | "usuarioNome" | "data">>({
    filmeId: 0,
    usuarioId: 0,
    nota: 0,
    comentario: "",
  })

  const [avaliacaoEditando, setAvaliacaoEditando] = useState<Avaliacao | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)

  const adicionarAvaliacao = () => {
    const hoje = new Date()
    const dataFormatada = hoje.toLocaleDateString("pt-BR")

    const novoId = avaliacoes.length > 0 ? Math.max(...avaliacoes.map((a) => a.id)) + 1 : 1

    const filmeEncontrado = filmes.find((f) => f.id === novaAvaliacao.filmeId)
    const usuarioEncontrado = usuarios.find((u) => u.id === novaAvaliacao.usuarioId)

    if (!filmeEncontrado || !usuarioEncontrado) return

    setAvaliacoes([
      ...avaliacoes,
      {
        id: novoId,
        filmeId: novaAvaliacao.filmeId,
        filmeTitulo: filmeEncontrado.titulo,
        usuarioId: novaAvaliacao.usuarioId,
        usuarioNome: usuarioEncontrado.nome,
        nota: novaAvaliacao.nota,
        comentario: novaAvaliacao.comentario,
        data: dataFormatada,
      },
    ])

    setNovaAvaliacao({
      filmeId: 0,
      usuarioId: 0,
      nota: 0,
      comentario: "",
    })
    setDialogAberto(false)
  }

  const atualizarAvaliacao = () => {
    if (!avaliacaoEditando) return

    setAvaliacoes(avaliacoes.map((a) => (a.id === avaliacaoEditando.id ? avaliacaoEditando : a)))

    setAvaliacaoEditando(null)
    setDialogAberto(false)
    setModoEdicao(false)
  }

  const excluirAvaliacao = (id: number) => {
    setAvaliacoes(avaliacoes.filter((a) => a.id !== id))
  }

  const abrirDialogCriacao = () => {
    setNovaAvaliacao({
      filmeId: 0,
      usuarioId: 0,
      nota: 0,
      comentario: "",
    })
    setModoEdicao(false)
    setDialogAberto(true)
  }

  const abrirDialogEdicao = (avaliacao: Avaliacao) => {
    setAvaliacaoEditando(avaliacao)
    setModoEdicao(true)
    setDialogAberto(true)
  }

  const renderEstrelas = (nota: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < nota ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
      ))
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Avaliações</CardTitle>
            <CardDescription>Gerencie as avaliações de filmes</CardDescription>
          </div>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button onClick={abrirDialogCriacao}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Avaliação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{modoEdicao ? "Editar Avaliação" : "Adicionar Avaliação"}</DialogTitle>
                <DialogDescription>
                  {modoEdicao
                    ? "Edite os dados da avaliação e clique em salvar quando terminar."
                    : "Preencha os dados da nova avaliação e clique em adicionar quando terminar."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {!modoEdicao && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="usuario">Usuário</Label>
                      <Select
                        value={novaAvaliacao.usuarioId.toString()}
                        onValueChange={(value) => {
                          setNovaAvaliacao({ ...novaAvaliacao, usuarioId: Number.parseInt(value) })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um usuário" />
                        </SelectTrigger>
                        <SelectContent>
                          {usuarios.map((usuario) => (
                            <SelectItem key={usuario.id} value={usuario.id.toString()}>
                              {usuario.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filme">Filme</Label>
                      <Select
                        value={novaAvaliacao.filmeId.toString()}
                        onValueChange={(value) => {
                          setNovaAvaliacao({ ...novaAvaliacao, filmeId: Number.parseInt(value) })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um filme" />
                        </SelectTrigger>
                        <SelectContent>
                          {filmes.map((filme) => (
                            <SelectItem key={filme.id} value={filme.id.toString()}>
                              {filme.titulo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="nota">Nota (1-5)</Label>
                  <Select
                    value={(modoEdicao ? avaliacaoEditando?.nota.toString() : novaAvaliacao.nota.toString()) || "0"}
                    onValueChange={(value) => {
                      if (modoEdicao && avaliacaoEditando) {
                        setAvaliacaoEditando({ ...avaliacaoEditando, nota: Number.parseInt(value) })
                      } else {
                        setNovaAvaliacao({ ...novaAvaliacao, nota: Number.parseInt(value) })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma nota" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Péssimo</SelectItem>
                      <SelectItem value="2">2 - Ruim</SelectItem>
                      <SelectItem value="3">3 - Regular</SelectItem>
                      <SelectItem value="4">4 - Bom</SelectItem>
                      <SelectItem value="5">5 - Excelente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="comentario">Comentário</Label>
                  <Textarea
                    id="comentario"
                    rows={3}
                    value={modoEdicao ? avaliacaoEditando?.comentario || "" : novaAvaliacao.comentario}
                    onChange={(e) => {
                      if (modoEdicao && avaliacaoEditando) {
                        setAvaliacaoEditando({ ...avaliacaoEditando, comentario: e.target.value })
                      } else {
                        setNovaAvaliacao({ ...novaAvaliacao, comentario: e.target.value })
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={modoEdicao ? atualizarAvaliacao : adicionarAvaliacao}>
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
                <TableHead>Filme</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {avaliacoes.map((avaliacao) => (
                <TableRow key={avaliacao.id}>
                  <TableCell>{avaliacao.id}</TableCell>
                  <TableCell>{avaliacao.filmeTitulo}</TableCell>
                  <TableCell>{avaliacao.usuarioNome}</TableCell>
                  <TableCell>
                    <div className="flex items-center">{renderEstrelas(avaliacao.nota)}</div>
                  </TableCell>
                  <TableCell>{avaliacao.data}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => abrirDialogEdicao(avaliacao)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => excluirAvaliacao(avaliacao.id)}>
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
