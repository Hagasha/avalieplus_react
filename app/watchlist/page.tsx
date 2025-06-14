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
import { Badge } from "@/components/ui/badge"
import { Pencil, Plus, Trash2, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ItemWatchlist {
  id: number
  filmeId: number
  filmeTitulo: string
  usuarioId: number
  usuarioNome: string
  status: "Para Assistir" | "Assistindo" | "Assistido"
  prioridade: "Baixa" | "Média" | "Alta"
  dataAdicionado: string
  dataAssistido?: string
  notas?: string
}

interface Usuario {
  id: number
  nome: string
}

interface Filme {
  id: number
  titulo: string
}

export default function WatchlistPage() {
  const usuarios: Usuario[] = [
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos" },
    { id: 3, nome: "Pedro Oliveira" },
  ]

  const filmes: Filme[] = [
    { id: 1, titulo: "Interestelar" },
    { id: 2, titulo: "Pulp Fiction" },
    { id: 3, titulo: "Parasita" },
    { id: 4, titulo: "O Poderoso Chefão" },
    { id: 5, titulo: "Cidade de Deus" },
    { id: 6, titulo: "Matrix" },
  ]

  const [watchlist, setWatchlist] = useState<ItemWatchlist[]>([
    {
      id: 1,
      filmeId: 1,
      filmeTitulo: "Interestelar",
      usuarioId: 1,
      usuarioNome: "João Silva",
      status: "Para Assistir",
      prioridade: "Alta",
      dataAdicionado: "15/05/2023",
      notas: "Recomendado por amigos",
    },
    {
      id: 2,
      filmeId: 4,
      filmeTitulo: "O Poderoso Chefão",
      usuarioId: 2,
      usuarioNome: "Maria Santos",
      status: "Assistindo",
      prioridade: "Média",
      dataAdicionado: "22/06/2023",
      notas: "Clássico que preciso ver",
    },
    {
      id: 3,
      filmeId: 3,
      filmeTitulo: "Parasita",
      usuarioId: 3,
      usuarioNome: "Pedro Oliveira",
      status: "Assistido",
      prioridade: "Alta",
      dataAdicionado: "10/07/2023",
      dataAssistido: "15/07/2023",
      notas: "Filme incrível, superou expectativas",
    },
  ])

  const [novoItem, setNovoItem] = useState<
    Omit<ItemWatchlist, "id" | "filmeTitulo" | "usuarioNome" | "dataAdicionado">
  >({
    filmeId: 0,
    usuarioId: 0,
    status: "Para Assistir",
    prioridade: "Média",
    notas: "",
  })

  const [itemEditando, setItemEditando] = useState<ItemWatchlist | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)

  const adicionarItem = () => {
    const hoje = new Date()
    const dataFormatada = hoje.toLocaleDateString("pt-BR")

    const novoId = watchlist.length > 0 ? Math.max(...watchlist.map((w) => w.id)) + 1 : 1

    const filmeEncontrado = filmes.find((f) => f.id === novoItem.filmeId)
    const usuarioEncontrado = usuarios.find((u) => u.id === novoItem.usuarioId)

    if (!filmeEncontrado || !usuarioEncontrado) return

    setWatchlist([
      ...watchlist,
      {
        id: novoId,
        filmeId: novoItem.filmeId,
        filmeTitulo: filmeEncontrado.titulo,
        usuarioId: novoItem.usuarioId,
        usuarioNome: usuarioEncontrado.nome,
        status: novoItem.status,
        prioridade: novoItem.prioridade,
        dataAdicionado: dataFormatada,
        notas: novoItem.notas,
      },
    ])

    setNovoItem({
      filmeId: 0,
      usuarioId: 0,
      status: "Para Assistir",
      prioridade: "Média",
      notas: "",
    })
    setDialogAberto(false)
  }

  const atualizarItem = () => {
    if (!itemEditando) return

    setWatchlist(watchlist.map((w) => (w.id === itemEditando.id ? itemEditando : w)))

    setItemEditando(null)
    setDialogAberto(false)
    setModoEdicao(false)
  }

  const excluirItem = (id: number) => {
    setWatchlist(watchlist.filter((w) => w.id !== id))
  }

  const marcarComoAssistido = (id: number) => {
    const hoje = new Date()
    const dataFormatada = hoje.toLocaleDateString("pt-BR")

    setWatchlist(
      watchlist.map((w) => (w.id === id ? { ...w, status: "Assistido" as const, dataAssistido: dataFormatada } : w)),
    )
  }

  const abrirDialogCriacao = () => {
    setNovoItem({
      filmeId: 0,
      usuarioId: 0,
      status: "Para Assistir",
      prioridade: "Média",
      notas: "",
    })
    setModoEdicao(false)
    setDialogAberto(true)
  }

  const abrirDialogEdicao = (item: ItemWatchlist) => {
    setItemEditando(item)
    setModoEdicao(true)
    setDialogAberto(true)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      "Para Assistir": "default",
      Assistindo: "secondary",
      Assistido: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>
  }

  const getPrioridadeBadge = (prioridade: string) => {
    const variants = {
      Baixa: "secondary",
      Média: "default",
      Alta: "destructive",
    } as const

    return <Badge variant={variants[prioridade as keyof typeof variants] || "default"}>{prioridade}</Badge>
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Watchlist</CardTitle>
            <CardDescription>Gerencie suas listas de filmes para assistir</CardDescription>
          </div>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button onClick={abrirDialogCriacao}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar à Watchlist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{modoEdicao ? "Editar Item" : "Adicionar à Watchlist"}</DialogTitle>
                <DialogDescription>
                  {modoEdicao
                    ? "Edite os dados do item e clique em salvar quando terminar."
                    : "Preencha os dados para adicionar um filme à watchlist."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {!modoEdicao && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="usuario">Usuário</Label>
                      <Select
                        value={novoItem.usuarioId.toString()}
                        onValueChange={(value) => {
                          setNovoItem({ ...novoItem, usuarioId: Number.parseInt(value) })
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
                        value={novoItem.filmeId.toString()}
                        onValueChange={(value) => {
                          setNovoItem({ ...novoItem, filmeId: Number.parseInt(value) })
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
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={modoEdicao ? itemEditando?.status : novoItem.status}
                    onValueChange={(value) => {
                      if (modoEdicao && itemEditando) {
                        setItemEditando({ ...itemEditando, status: value as ItemWatchlist["status"] })
                      } else {
                        setNovoItem({ ...novoItem, status: value as ItemWatchlist["status"] })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Para Assistir">Para Assistir</SelectItem>
                      <SelectItem value="Assistindo">Assistindo</SelectItem>
                      <SelectItem value="Assistido">Assistido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={modoEdicao ? itemEditando?.prioridade : novoItem.prioridade}
                    onValueChange={(value) => {
                      if (modoEdicao && itemEditando) {
                        setItemEditando({ ...itemEditando, prioridade: value as ItemWatchlist["prioridade"] })
                      } else {
                        setNovoItem({ ...novoItem, prioridade: value as ItemWatchlist["prioridade"] })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notas">Notas (opcional)</Label>
                  <Input
                    id="notas"
                    placeholder="Adicione suas notas sobre o filme"
                    value={modoEdicao ? itemEditando?.notas || "" : novoItem.notas}
                    onChange={(e) => {
                      if (modoEdicao && itemEditando) {
                        setItemEditando({ ...itemEditando, notas: e.target.value })
                      } else {
                        setNovoItem({ ...novoItem, notas: e.target.value })
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={modoEdicao ? atualizarItem : adicionarItem}>
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
                <TableHead>Filme</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Data Adicionado</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlist.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.filmeTitulo}</TableCell>
                  <TableCell>{item.usuarioNome}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{getPrioridadeBadge(item.prioridade)}</TableCell>
                  <TableCell>{item.dataAdicionado}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.notas || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {item.status !== "Assistido" && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => marcarComoAssistido(item.id)}
                          title="Marcar como assistido"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="icon" onClick={() => abrirDialogEdicao(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => excluirItem(item.id)}>
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
