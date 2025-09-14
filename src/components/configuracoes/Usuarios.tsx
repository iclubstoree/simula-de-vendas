import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Users as UsersIcon, Search, Eye, EyeOff, Crown, UserCheck, User as UserIcon } from "lucide-react";
import { 
  users, 
  stores,
  type User 
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export function Usuarios() {
  const [usersList, setUsersList] = useState<User[]>(users);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showPasswords, setShowPasswords] = useState(false);
  
  const [userForm, setUserForm] = useState({
    login: "",
    email: "",
    name: "",
    password: "",
    type: "vendedor" as "dono" | "gerente" | "vendedor",
    allowedStores: [] as string[],
    permissions: {
      configuracoes: false,
      relatorios: false,
      dashboard: false,
      simulador: true,
    },
    active: true
  });
  
  const { toast } = useToast();

  // Filter users
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.login.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || user.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        login: user.login,
        email: user.email,
        name: user.name,
        password: "",
        type: user.type,
        allowedStores: [...user.allowedStores],
        permissions: { ...user.permissions },
        active: user.active
      });
    } else {
      setEditingUser(null);
      setUserForm({
        login: "",
        email: "",
        name: "",
        password: "",
        type: "vendedor",
        allowedStores: [],
        permissions: {
          configuracoes: false,
          relatorios: false,
          dashboard: false,
          simulador: true,
        },
        active: true
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!userForm.login.trim() || !userForm.email.trim() || !userForm.name.trim()) {
      toast({
        title: "Erro",
        description: "Login, email e nome são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (!editingUser && !userForm.password.trim()) {
      toast({
        title: "Erro",
        description: "Senha é obrigatória para novos usuários",
        variant: "destructive"
      });
      return;
    }

    if (userForm.allowedStores.length === 0) {
      toast({
        title: "Erro",
        description: "Usuário deve ter acesso a pelo menos uma loja",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userForm.email)) {
      toast({
        title: "Erro",
        description: "Email deve ter um formato válido",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate login/email
    const existingUser = usersList.find(user => 
      user.id !== editingUser?.id && 
      (user.login === userForm.login || user.email === userForm.email)
    );
    
    if (existingUser) {
      toast({
        title: "Erro",
        description: "Login ou email já está em uso",
        variant: "destructive"
      });
      return;
    }

    if (editingUser) {
      // Edit existing user
      setUsersList(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              ...userForm,
              password: userForm.password ? userForm.password : undefined
            }
          : user
      ));
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso"
      });
    } else {
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        ...userForm,
        createdAt: new Date()
      };
      setUsersList(prev => [...prev, newUser]);
      toast({
        title: "Sucesso", 
        description: "Usuário criado com sucesso"
      });
    }

    setDialogOpen(false);
    setEditingUser(null);
  };

  const toggleUserActive = (userId: string) => {
    setUsersList(prev => prev.map(user =>
      user.id === userId
        ? { ...user, active: !user.active }
        : user
    ));
    
    const user = usersList.find(u => u.id === userId);
    toast({
      title: user?.active ? "Usuário desativado" : "Usuário ativado",
      description: `${user?.name} foi ${user?.active ? 'desativado' : 'ativado'} com sucesso`
    });
  };

  const handleStoreChange = (storeId: string, checked: boolean) => {
    if (checked) {
      setUserForm(prev => ({
        ...prev,
        allowedStores: [...prev.allowedStores, storeId]
      }));
    } else {
      setUserForm(prev => ({
        ...prev,
        allowedStores: prev.allowedStores.filter(id => id !== storeId)
      }));
    }
  };

  const handlePermissionChange = (permission: keyof typeof userForm.permissions, checked: boolean) => {
    setUserForm(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };

  // Auto-set permissions based on user type
  const handleTypeChange = (type: "dono" | "gerente" | "vendedor") => {
    let permissions = {
      configuracoes: false,
      relatorios: false,
      dashboard: false,
      simulador: true,
    };

    if (type === "dono") {
      permissions = {
        configuracoes: true,
        relatorios: true,
        dashboard: true,
        simulador: true,
      };
    } else if (type === "gerente") {
      permissions = {
        configuracoes: false,
        relatorios: true,
        dashboard: true,
        simulador: true,
      };
    }

    setUserForm(prev => ({
      ...prev,
      type,
      permissions
    }));
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'dono':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'gerente':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case 'dono':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">Dono</Badge>;
      case 'gerente':
        return <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">Gerente</Badge>;
      default:
        return <Badge variant="secondary">Vendedor</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Usuários do Sistema</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie usuários e suas permissões de acesso
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-gradient-primary hover:bg-primary-hover press-effect"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {editingUser 
                  ? 'Atualize as informações do usuário'
                  : 'Cadastre um novo usuário no sistema'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  placeholder="usuario123"
                  value={userForm.login}
                  onChange={(e) => setUserForm(prev => ({ ...prev, login: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@email.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="João da Silva"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={editingUser ? "Deixe vazio para manter" : "Digite a senha"}
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de Usuário</Label>
                <Select 
                  value={userForm.type} 
                  onValueChange={(value: "dono" | "gerente" | "vendedor") => setUserForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dono">Dono</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Lojas Permitidas</Label>
                <div className="space-y-2">
                  {stores.filter(store => store.active).map(store => (
                    <div key={store.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`store-${store.id}`}
                        checked={userForm.allowedStores.includes(store.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setUserForm(prev => ({ 
                              ...prev, 
                              allowedStores: [...prev.allowedStores, store.id]
                            }));
                          } else {
                            setUserForm(prev => ({ 
                              ...prev, 
                              allowedStores: prev.allowedStores.filter(id => id !== store.id)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`store-${store.id}`}>{store.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="col-span-2 space-y-3">
                <Label>Permissões</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canViewReports"
                      checked={userForm.permissions.configuracoes}
                      onCheckedChange={(checked) => 
                        setUserForm(prev => ({ 
                          ...prev, 
                          permissions: { ...prev.permissions, configuracoes: checked as boolean }
                        }))
                      }
                    />
                    <Label htmlFor="canViewReports">Configurações</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canEditPrices"
                      checked={userForm.permissions.relatorios}
                      onCheckedChange={(checked) => 
                        setUserForm(prev => ({ 
                          ...prev, 
                          permissions: { ...prev.permissions, relatorios: checked as boolean }
                        }))
                      }
                    />
                    <Label htmlFor="canEditPrices">Relatórios</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canManageUsers"
                      checked={userForm.permissions.dashboard}
                      onCheckedChange={(checked) => 
                        setUserForm(prev => ({ 
                          ...prev, 
                          permissions: { ...prev.permissions, dashboard: checked as boolean }
                        }))
                      }
                    />
                    <Label htmlFor="canManageUsers">Dashboard</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canAccessConfig"
                      checked={userForm.permissions.simulador}
                      onCheckedChange={(checked) => 
                        setUserForm(prev => ({ 
                          ...prev, 
                          permissions: { ...prev.permissions, simulador: checked as boolean }
                        }))
                      }
                    />
                    <Label htmlFor="canAccessConfig">Simulador</Label>
                  </div>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={userForm.active}
                  onCheckedChange={(checked) => setUserForm(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Usuário ativo</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-gradient-primary">
                {editingUser ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              Filtros
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
              }}
              className="text-sm"
            >
              Limpar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome, email, login..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Usuário</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="dono">Dono</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Usuários Cadastrados ({filteredUsers.length})
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPasswords ? 'Ocultar' : 'Mostrar'} Senhas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Login</TableHead>
                  {showPasswords && <TableHead>Senha</TableHead>}
                  <TableHead>Tipo</TableHead>
                  <TableHead>Lojas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          {getUserTypeIcon(user.type)}
                          {user.name}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{user.login}</TableCell>
                    {showPasswords && (
                      <TableCell className="font-mono text-sm">
                        {user.password ? '••••••••' : 'Não definida'}
                      </TableCell>
                    )}
                    <TableCell>
                      {getUserTypeBadge(user.type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.allowedStores.map(storeId => (
                          <Badge key={storeId} variant="outline" className="text-xs">
                            {stores.find(s => s.id === storeId)?.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.active ? 'default' : 'secondary'}>
                        {user.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString('pt-BR')
                        : 'Nunca'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={user.active ? "destructive" : "default"}
                          onClick={() => toggleUserActive(user.id)}
                          className={!user.active ? "bg-gradient-primary" : ""}
                        >
                          {user.active ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}