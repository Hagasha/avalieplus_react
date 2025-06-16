"use client"

import { useState, useEffect } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Pencil, Plus, Trash2, Check, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { supabase, type WatchlistItem, type Usuario, type Filme } from "@/lib/supabase"
import { useNotifications } from "@/components/notification"

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { success, error, warning, info } = useNotifications()

  const [novoItem, setNovoItem] = useState({
    filme_id: 0,
    usuario_id: 0,
    status: "Para Assistir" as const,
    prioridade: "Média" as const,
    notas: "",
  })

  const [itemEditando, setItemEditando] = useState<WatchlistItem | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)

  // Carregar dados
  const carregarDados = async () => {
    try {
      const [watchlistResult, usuariosResult, filmesResult] = await Promise.all([
        supabase
          .from("watchlist")
          .select(`
            *,
            filmes(titulo),
            usuarios(nome)
          `)
          .order("id", { ascending: true }),
        supabase.from("usuarios").select("*").order("nome"),
        supabase.from("filmes").select("*").order("titulo"),
      ])

      if (watchlistResult.error) throw watchlistResult.error
      if (usuariosResult.error) throw usuariosResult.error
      if (filmesResult.error) throw filmesResult.error

      setWatchlist(watchlistResult.data || [])
      setUsuarios(usuariosResult.data || [])
      setFilmes(filmesResult.data || [])
    } catch (err: any) {
      error("Erro ao carregar dados", "Não foi possível carregar as informações da watchlist")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const adicionarItem = async () => {
    if (!novoItem.filme_id || !novoItem.usuario_id) {
      error("Campos obrigatórios", "Selecione um filme e um usuário para continuar")
      return
    }

    // Verificar se já existe o mesmo filme na watchlist do usuário
    const itemExistente = watchlist.find(
      (item) => item.filme_id === novoItem.filme_id && item.usuario_id === novoItem.usuario_id,
    )

    if (itemExistente) {
      warning("Item já existe", "Este filme já está na watchlist deste usuário")
      return
    }

    setSubmitting(true)
    try {
      const { error: supabaseError } = await supabase.from("watchlist").insert([novoItem])

      if (supabaseError) throw supabaseError

      const filme = filmes.find((f) => f.id === novoItem.filme_id)
      const usuario = usuarios.find((u) => u.id === novoItem.usuario_id)

      success("Adicionado à watchlist!", `"${filme?.titulo}" foi adicionado à watchlist de ${usuario?.nome}`)

      setNovoItem({
        filme_id: 0,
        usuario_id: 0,
        status: "Para Assistir",
        prioridade: "Média",
        notas: "",
      })
      setDialogAberto(false)
      carregarDados()
    } catch (err: any) {
      error("Erro ao adicionar item", err.message || "Ocorreu um erro inesperado")
    } finally {
      setSubmitting(false)
    }
  }

  const atualizarItem = async () => {
    if (!itemEditando) return

    setSubmitting(true)
    try {
      const updateData: any = {
        status: itemEditando.status,
        prioridade: itemEditando.prioridade,
        notas: itemEditando.notas,
      }

      if (itemEditando.status === "Assistido" && !itemEditando.data_assistido) {
        updateData.data_assistido = new Date().toISOString()
      }

      const { error: supabaseError } = await supabase.from("watchlist").update(updateData).eq("id", itemEditando.id)

      if (supabaseError) throw supabaseError

      const statusMessage =
        itemEditando.status === "Assistido" ? "Filme marcado como assistido! 🎬" : "Item atualizado com sucesso!"

      success("Watchlist atualizada!", statusMessage)

      setItemEditando(null)
      setDialogAberto(false)
      setModoEdicao(false)
      carregarDados()
    } catch (err: any) {
      error("Erro ao atualizar item", err.message || "Ocorreu um erro inesperado")
    } finally {
      setSubmitting(false)
    }
  }

  const excluirItem = async (id: number, filme: string, usuario: string) => {
    if (!confirm(`Tem certeza que deseja remover "${filme}" da watchlist de ${usuario}?`)) return

    try {
      const { error: supabaseError } = await supabase.from("watchlist").delete().eq("id", id)

      if (supabaseError) throw supabaseError

      success("Item removido!", `"${filme}" foi removido da watchlist de ${usuario}`)

      carregarDados()
    } catch (err: any) {
      error("Erro ao excluir item", err.message || "Ocorreu um erro inesperado")
    }
  }

  const marcarComoAssistido = async (id: number, filme: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from("watchlist")
        .update({
          status: "Assistido",
          data_assistido: new Date().toISOString(),
        })
        .eq("id", id)

      if (supabaseError) throw supabaseError

      success("Filme assistido! 🎉", `"${filme}" foi marcado como assistido`)

      carregarDados()
    } catch (err: any) {
      error("Erro ao marcar como assistido", err.message || "Ocorreu um erro inesperado")
    }
  }

  // Adicionar uma função para recarregar apenas usuários e filmes
  const recarregarOpcoesSelect = async () => {
    try {
      const [usuariosResult, filmesResult] = await Promise.all([
        supabase.from("usuarios").select("*").order("nome"),
        supabase.from("filmes").select("*").order("titulo"),
      ])

      if (usuariosResult.error) throw usuariosResult.error
      if (filmesResult.error) throw filmesResult.error

      setUsuarios(usuariosResult.data || [])
      setFilmes(filmesResult.data || [])
    } catch (err: any) {
      console.error("Erro ao recarregar opções:", err)
    }
  }

  // Modificar a função abrirDialogCriacao para recarregar os dados
  const abrirDialogCriacao = async () => {
    setNovoItem({
      filme_id: 0,
      usuario_id: 0,
      status: "Para Assistir",
      prioridade: "Média",
      notas: "",
    })
    setModoEdicao(false)
    setDialogAberto(true)

    // Recarregar as opções dos selects
    await recarregarOpcoesSelect()
    info("Carregando opções...", "Atualizando lista de filmes e usuários")
  }

  const abrirDialogEdicao = (item: WatchlistItem) => {
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

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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
                        value={novoItem.usuario_id.toString()}
                        onValueChange={(value) => {
                          setNovoItem({ ...novoItem, usuario_id: Number.parseInt(value) })
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
                        value={novoItem.filme_id.toString()}
                        onValueChange={(value) => {
                          setNovoItem({ ...novoItem, filme_id: Number.parseInt(value) })
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
                        setItemEditando({ ...itemEditando, status: value as WatchlistItem["status"] })
                      } else {
                        setNovoItem({ ...novoItem, status: value as typeof novoItem.status })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Para Assistir">📋 Para Assistir</SelectItem>
                      <SelectItem value="Assistindo">▶️ Assistindo</SelectItem>
                      <SelectItem value="Assistido">✅ Assistido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select
                    value={modoEdicao ? itemEditando?.prioridade : novoItem.prioridade}
                    onValueChange={(value) => {
                      if (modoEdicao && itemEditando) {
                        setItemEditando({ ...itemEditando, prioridade: value as WatchlistItem["prioridade"] })
                      } else {
                        setNovoItem({ ...novoItem, prioridade: value as typeof novoItem.prioridade })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">🟢 Baixa</SelectItem>
                      <SelectItem value="Média">🟡 Média</SelectItem>
                      <SelectItem value="Alta">🔴 Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notas">Notas (opcional)</Label>
                  <Input
                    id="notas"
                    placeholder="Ex: Recomendado por amigos, assistir no fim de semana..."
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
                <Button variant="outline" onClick={() => setDialogAberto(false)} disabled={submitting}>
                  Cancelar
                </Button>
                <Button onClick={modoEdicao ? atualizarItem : adicionarItem} disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                  <TableCell className="font-medium">{item.filmes?.titulo}</TableCell>
                  <TableCell>{item.usuarios?.nome}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{getPrioridadeBadge(item.prioridade)}</TableCell>
                  <TableCell>{new Date(item.data_adicionado).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={item.notas}>
                      {item.notas || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {item.status !== "Assistido" && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => marcarComoAssistido(item.id, item.filmes?.titulo || "filme")}
                          title="Marcar como assistido"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="icon" onClick={() => abrirDialogEdicao(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          excluirItem(item.id, item.filmes?.titulo || "filme", item.usuarios?.nome || "usuário")
                        }
                      >
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
