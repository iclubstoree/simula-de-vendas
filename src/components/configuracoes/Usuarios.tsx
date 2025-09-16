import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

// Components
import { UserForm } from "../users/UserForm";
import { UserFilters } from "../users/UserFilters";
import { UsersTable } from "../users/UsersTable";
import { useUsersState } from "@/hooks/useUsersState";

export function Usuarios() {
  const {
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
  } = useUsersState();


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

            <UserForm
              userForm={userForm}
              editingUser={editingUser}
              onFormChange={handleFormChange}
              onSave={handleSave}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <UserFilters
        searchQuery={searchQuery}
        selectedType={selectedType}
        onSearchChange={setSearchQuery}
        onTypeChange={setSelectedType}
        onClearFilters={clearFilters}
      />

      {/* Tabela de Usuários */}
      <UsersTable
        users={filteredUsers}
        showPasswords={showPasswords}
        onTogglePasswords={togglePasswords}
        onEditUser={handleOpenDialog}
        onToggleUserActive={toggleUserActive}
      />
    </div>
  );
}