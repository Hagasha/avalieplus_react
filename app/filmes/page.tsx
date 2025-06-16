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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Plus, Trash2, Loader2, ImageIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase, type Filme } from "@/lib/supabase"
import { useNotifications } from "@/components/notification"
import { ImageUpload } from "@/components/image-upload"

export default function FilmesPage() {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { success, error } = useNotifications()

  const [novoFilme, setNovoFilme] = useState({
    titulo: "",
    diretor: "",
    ano_lancamento: "",
    genero: "",
    sinopse: "",
    capa_url: "",
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

  // Carregar filmes
  const carregarFilmes = async () => {
    try {
      const { data, error: supabaseError } = await supabase.from("filmes").select("*").order("id", { ascending: true })

      if (supabaseError) throw supabaseError
      setFilmes(data || [])
    } catch (err) {
      error("Erro ao carregar filmes", "Não foi possível carregar a lista de filmes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarFilmes()
  }, [])

  const adicionarFilme = async () => {
    if (!novoFilme.titulo || !novoFilme.diretor || !novoFilme.ano_lancamento || !novoFilme.genero) {
      error("Campos obrigatórios", "Preencha todos os campos obrigatórios")
      return
    }

    setSubmitting(true)
    try {
      const { error: supabaseError } = await supabase.from("filmes").insert([novoFilme])

      if (supabaseError) throw supabaseError

      success("Filme adicionado!", `O filme "${novoFilme.titulo}" foi adicionado com sucesso`)

      setNovoFilme({
        titulo: "",
        diretor: "",
        ano_lancamento: "",
        genero: "",
        sinopse: "",
        capa_url: "",
      })
      setDialogAberto(false)
      carregarFilmes()
    } catch (err: any) {
      error("Erro ao adicionar filme", err.message || "Ocorreu um erro inesperado")
    } finally {
      setSubmitting(false)
    }
  }

  const atualizarFilme = async () => {
    if (!filmeEditando) return

    setSubmitting(true)
    try {
      const { error: supabaseError } = await supabase
        .from("filmes")
        .update({
          titulo: filmeEditando.titulo,
          diretor: filmeEditando.diretor,
          ano_lancamento: filmeEditando.ano_lancamento,
          genero: filmeEditando.genero,
          sinopse: filmeEditando.sinopse,
          capa_url: filmeEditando.capa_url,
        })
        .eq("id", filmeEditando.id)

      if (supabaseError) throw supabaseError

      success("Filme atualizado!", `O filme "${filmeEditando.titulo}" foi atualizado com sucesso`)

      setFilmeEditando(null)
      setDialogAberto(false)
      setModoEdicao(false)
      carregarFilmes()
    } catch (err: any) {
      error("Erro ao atualizar filme", err.message || "Ocorreu um erro inesperado")
    } finally {
      setSubmitting(false)
    }
  }

  const excluirFilme = async (id: number, titulo: string) => {
    if (!confirm(`Tem certeza que deseja excluir o filme "${titulo}"?`)) return

    try {
      const { error: supabaseError } = await supabase.from("filmes").delete().eq("id", id)

      if (supabaseError) throw supabaseError

      success("Filme excluído!", `O filme "${titulo}" foi excluído com sucesso`)

      carregarFilmes()
    } catch (err: any) {
      error("Erro ao excluir filme", err.message || "Ocorreu um erro inesperado")
    }
  }

  const abrirDialogCriacao = () => {
    setNovoFilme({
      titulo: "",
      diretor: "",
      ano_lancamento: "",
      genero: "",
      sinopse: "",
      capa_url: "",
    })
    setModoEdicao(false)
    setDialogAberto(true)
  }

  const abrirDialogEdicao = (filme: Filme) => {
    setFilmeEditando({ ...filme, capa_url: filme.capa_url || "" })
    setModoEdicao(true)
    setDialogAberto(true)
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{modoEdicao ? "Editar Filme" : "Adicionar Filme"}</DialogTitle>
                <DialogDescription>
                  {modoEdicao
                    ? "Edite os dados do filme e clique em salvar quando terminar."
                    : "Preencha os dados do novo filme e clique em adicionar quando terminar."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="anoLancamento">Ano de Lançamento</Label>
                    <Input
                      id="anoLancamento"
                      value={modoEdicao ? filmeEditando?.ano_lancamento || "" : novoFilme.ano_lancamento}
                      onChange={(e) => {
                        if (modoEdicao && filmeEditando) {
                          setFilmeEditando({ ...filmeEditando, ano_lancamento: e.target.value })
                        } else {
                          setNovoFilme({ ...novoFilme, ano_lancamento: e.target.value })
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
                </div>
                <div className="grid gap-2">
                  <ImageUpload
                    value={modoEdicao ? filmeEditando?.capa_url || "" : novoFilme.capa_url}
                    onChange={(value) => {
                      if (modoEdicao && filmeEditando) {
                        setFilmeEditando({ ...filmeEditando, capa_url: value })
                      } else {
                        setNovoFilme({ ...novoFilme, capa_url: value })
                      }
                    }}
                    disabled={submitting}
                  />
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
                <Button variant="outline" onClick={() => setDialogAberto(false)} disabled={submitting}>
                  Cancelar
                </Button>
                <Button onClick={modoEdicao ? atualizarFilme : adicionarFilme} disabled={submitting}>
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
                <TableHead>Capa</TableHead>
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
                  <TableCell>
                    <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {filme.capa_url ? (
                        <img
                          src={filme.capa_url || "/placeholder.svg"}
                          alt={`Capa de ${filme.titulo}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{filme.titulo}</TableCell>
                  <TableCell>{filme.diretor}</TableCell>
                  <TableCell>{filme.ano_lancamento}</TableCell>
                  <TableCell>{filme.genero}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => abrirDialogEdicao(filme)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => excluirFilme(filme.id, filme.titulo)}>
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
