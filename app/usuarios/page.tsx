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
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react"
import { supabase, type Usuario } from "@/lib/supabase"

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
  })

  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)

  // Carregar usuários
  const carregarUsuarios = async () => {
    try {
      const { data, error } = await supabase.from("usuarios").select("*").order("id", { ascending: true })

      if (error) throw error
      setUsuarios(data || [])
    } catch (error) {
      alert("Erro ao carregar usuários")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const adicionarUsuario = async () => {
    if (!novoUsuario.nome || !novoUsuario.email) {
      alert("Preencha todos os campos")
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from("usuarios").insert([novoUsuario])

      if (error) throw error

      alert("Usuário adicionado com sucesso")

      setNovoUsuario({ nome: "", email: "" })
      setDialogAberto(false)
      carregarUsuarios()
    } catch (error: any) {
      alert(error.message || "Erro ao adicionar usuário")
    } finally {
      setSubmitting(false)
    }
  }

  const atualizarUsuario = async () => {
    if (!usuarioEditando) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from("usuarios")
        .update({
          nome: usuarioEditando.nome,
          email: usuarioEditando.email,
        })
        .eq("id", usuarioEditando.id)

      if (error) throw error

      alert("Usuário atualizado com sucesso")

      setUsuarioEditando(null)
      setDialogAberto(false)
      setModoEdicao(false)
      carregarUsuarios()
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar usuário")
    } finally {
      setSubmitting(false)
    }
  }

  const excluirUsuario = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return

    try {
      const { error } = await supabase.from("usuarios").delete().eq("id", id)

      if (error) throw error

      alert("Usuário excluído com sucesso")

      carregarUsuarios()
    } catch (error: any) {
      alert(error.message || "Erro ao excluir usuário")
    }
  }

  const abrirDialogCriacao = () => {
    setNovoUsuario({ nome: "", email: "" })
    setModoEdicao(false)
    setDialogAberto(true)
  }

  const abrirDialogEdicao = (usuario: Usuario) => {
    setUsuarioEditando(usuario)
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
            <CardTitle>Usuários</CardTitle>
            <CardDescription>Gerencie os usuários do sistema</CardDescription>
          </div>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button onClick={abrirDialogCriacao}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{modoEdicao ? "Editar Usuário" : "Adicionar Usuário"}</DialogTitle>
                <DialogDescription>
                  {modoEdicao
                    ? "Edite os dados do usuário e clique em salvar quando terminar."
                    : "Preencha os dados do novo usuário e clique em adicionar quando terminar."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={modoEdicao ? usuarioEditando?.nome || "" : novoUsuario.nome}
                    onChange={(e) => {
                      if (modoEdicao && usuarioEditando) {
                        setUsuarioEditando({ ...usuarioEditando, nome: e.target.value })
                      } else {
                        setNovoUsuario({ ...novoUsuario, nome: e.target.value })
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={modoEdicao ? usuarioEditando?.email || "" : novoUsuario.email}
                    onChange={(e) => {
                      if (modoEdicao && usuarioEditando) {
                        setUsuarioEditando({ ...usuarioEditando, email: e.target.value })
                      } else {
                        setNovoUsuario({ ...novoUsuario, email: e.target.value })
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogAberto(false)} disabled={submitting}>
                  Cancelar
                </Button>
                <Button onClick={modoEdicao ? atualizarUsuario : adicionarUsuario} disabled={submitting}>
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
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.id}</TableCell>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{new Date(usuario.data_cadastro).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => abrirDialogEdicao(usuario)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => excluirUsuario(usuario.id)}>
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
