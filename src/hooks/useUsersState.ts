import { useState } from "react";
import { users, type User } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export interface UserFormData {
  login: string;
  email: string;
  name: string;
  password: string;
  type: "dono" | "gerente" | "vendedor";
  allowedStores: string[];
  permissions: {
    configuracoes: boolean;
    relatorios: boolean;
    dashboard: boolean;
    simulador: boolean;
  };
  active: boolean;
}

export function useUsersState() {
  const [usersList, setUsersList] = useState<User[]>(users);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showPasswords, setShowPasswords] = useState(false);

  const [userForm, setUserForm] = useState<UserFormData>({
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

  const handleFormChange = (updates: Partial<UserFormData>) => {
    setUserForm(prev => ({ ...prev, ...updates }));
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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
  };

  const togglePasswords = () => {
    setShowPasswords(prev => !prev);
  };

  return {
    usersList,
    filteredUsers,
    dialogOpen,
    setDialogOpen,
    editingUser,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    showPasswords,
    userForm,
    handleOpenDialog,
    handleFormChange,
    handleSave,
    toggleUserActive,
    clearFilters,
    togglePasswords
  };
}