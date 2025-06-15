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
import { Pencil, Plus, Star, Trash2, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase, type Avaliacao, type Usuario, type Filme } from "@/lib/supabase"

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [novaAvaliacao, setNovaAvaliacao] = useState({
    filme_id: 0,
    usuario_id: 0,
    nota: 0,
    comentario: "",
  })

  const [avaliacaoEditando, setAvaliacaoEditando] = useState<Avaliacao | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)

  // Carregar dados
  const carregarDados = async () => {
    try {
      const [avaliacoesResult, usuariosResult, filmesResult] = await Promise.all([
        supabase
          .from("avaliacoes")
          .select(`
            *,
            filmes(titulo),
            usuarios(nome)
          `)
          .order("id", { ascending: true }),
        supabase.from("usuarios").select("*").order("nome"),
        supabase.from("filmes").select("*").order("titulo"),
      ])

      if (avaliacoesResult.error) throw avaliacoesResult.error
      if (usuariosResult.error) throw usuariosResult.error
      if (filmesResult.error) throw filmesResult.error

      setAvaliacoes(avaliacoesResult.data || [])
      setUsuarios(usuariosResult.data || [])
      setFilmes(filmesResult.data || [])
    } catch (error: any) {
      alert("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const adicionarAvaliacao = async () => {
    if (!novaAvaliacao.filme_id || !novaAvaliacao.usuario_id || !novaAvaliacao.nota) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from("avaliacoes").insert([novaAvaliacao])

      if (error) throw error

      alert("Avaliação adicionada com sucesso")

      setNovaAvaliacao({
        filme_id: 0,
        usuario_id: 0,
        nota: 0,
        comentario: "",
      })
      setDialogAberto(false)
      carregarDados()
    } catch (error: any) {
      alert(error.message || "Erro ao adicionar avaliação")
    } finally {
      setSubmitting(false)
    }
  }

  const atualizarAvaliacao = async () => {
    if (!avaliacaoEditando) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from("avaliacoes")
        .update({
          nota: avaliacaoEditando.nota,
          comentario: avaliacaoEditando.comentario,
        })
        .eq("id", avaliacaoEditando.id)

      if (error) throw error

      alert("Avaliação atualizada com sucesso")

      setAvaliacaoEditando(null)
      setDialogAberto(false)
      setModoEdicao(false)
      carregarDados()
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar avaliação")
    } finally {
      setSubmitting(false)
    }
  }

  const excluirAvaliacao = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return

    try {
      const { error } = await supabase.from("avaliacoes").delete().eq("id", id)

      if (error) throw error

      alert("Avaliação excluída com sucesso")

      carregarDados()
    } catch (error: any) {
      alert(error.message || "Erro ao excluir avaliação")
    }
  }

  const abrirDialogCriacao = () => {
    setNovaAvaliacao({
      filme_id: 0,
      usuario_id: 0,
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
                        value={novaAvaliacao.usuario_id.toString()}
                        onValueChange={(value) => {
                          setNovaAvaliacao({ ...novaAvaliacao, usuario_id: Number.parseInt(value) })
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
                        value={novaAvaliacao.filme_id.toString()}
                        onValueChange={(value) => {
                          setNovaAvaliacao({ ...novaAvaliacao, filme_id: Number.parseInt(value) })
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
                <Button variant="outline" onClick={() => setDialogAberto(false)} disabled={submitting}>
                  Cancelar
                </Button>
                <Button onClick={modoEdicao ? atualizarAvaliacao : adicionarAvaliacao} disabled={submitting}>
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
                <TableHead>Nota</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Comentário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {avaliacoes.map((avaliacao) => (
                <TableRow key={avaliacao.id}>
                  <TableCell>{avaliacao.filmes?.titulo}</TableCell>
                  <TableCell>{avaliacao.usuarios?.nome}</TableCell>
                  <TableCell>
                    <div className="flex items-center">{renderEstrelas(avaliacao.nota)}</div>
                  </TableCell>
                  <TableCell>{new Date(avaliacao.data_avaliacao).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{avaliacao.comentario || "Nenhum comentário"}</div>
                  </TableCell>
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
