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

interface Usuario {
  id: number
  nome: string
  email: string
  dataCadastro: string
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nome: "João Silva", email: "joao@email.com", dataCadastro: "10/06/2023" },
    { id: 2, nome: "Maria Santos", email: "maria@email.com", dataCadastro: "15/07/2023" },
    { id: 3, nome: "Pedro Oliveira", email: "pedro@email.com", dataCadastro: "22/08/2023" },
  ])

  const [novoUsuario, setNovoUsuario] = useState<Omit<Usuario, "id" | "dataCadastro">>({
    nome: "",
    email: "",
  })

  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)

  const adicionarUsuario = () => {
    const hoje = new Date()
    const dataFormatada = hoje.toLocaleDateString("pt-BR")

    const novoId = usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1

    setUsuarios([
      ...usuarios,
      {
        id: novoId,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        dataCadastro: dataFormatada,
      },
    ])

    setNovoUsuario({ nome: "", email: "" })
    setDialogAberto(false)
  }

  const atualizarUsuario = () => {
    if (!usuarioEditando) return

    setUsuarios(usuarios.map((u) => (u.id === usuarioEditando.id ? usuarioEditando : u)))

    setUsuarioEditando(null)
    setDialogAberto(false)
    setModoEdicao(false)
  }

  const excluirUsuario = (id: number) => {
    setUsuarios(usuarios.filter((u) => u.id !== id))
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
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={modoEdicao ? atualizarUsuario : adicionarUsuario}>
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
                  <TableCell>{usuario.dataCadastro}</TableCell>
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
