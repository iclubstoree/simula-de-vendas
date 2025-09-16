import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { stores, type User } from "@/data/mockData";

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

interface UserFormProps {
  userForm: UserFormData;
  editingUser: User | null;
  onFormChange: (updates: Partial<UserFormData>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function UserForm({
  userForm,
  editingUser,
  onFormChange,
  onSave,
  onCancel
}: UserFormProps) {
  const handleStoreChange = (storeId: string, checked: boolean) => {
    if (checked) {
      onFormChange({
        allowedStores: [...userForm.allowedStores, storeId]
      });
    } else {
      onFormChange({
        allowedStores: userForm.allowedStores.filter(id => id !== storeId)
      });
    }
  };

  const handlePermissionChange = (permission: keyof UserFormData['permissions'], checked: boolean) => {
    onFormChange({
      permissions: {
        ...userForm.permissions,
        [permission]: checked
      }
    });
  };

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

    onFormChange({
      type,
      permissions
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="login">Login</Label>
          <Input
            id="login"
            placeholder="usuario123"
            value={userForm.login}
            onChange={(e) => onFormChange({ login: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@email.com"
            value={userForm.email}
            onChange={(e) => onFormChange({ email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            placeholder="João da Silva"
            value={userForm.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder={editingUser ? "Deixe vazio para manter" : "Digite a senha"}
            value={userForm.password}
            onChange={(e) => onFormChange({ password: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Usuário</Label>
          <Select
            value={userForm.type}
            onValueChange={handleTypeChange}
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
                  onCheckedChange={(checked) => handleStoreChange(store.id, !!checked)}
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
                onCheckedChange={(checked) => handlePermissionChange('configuracoes', !!checked)}
              />
              <Label htmlFor="canViewReports">Configurações</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="canEditPrices"
                checked={userForm.permissions.relatorios}
                onCheckedChange={(checked) => handlePermissionChange('relatorios', !!checked)}
              />
              <Label htmlFor="canEditPrices">Relatórios</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="canManageUsers"
                checked={userForm.permissions.dashboard}
                onCheckedChange={(checked) => handlePermissionChange('dashboard', !!checked)}
              />
              <Label htmlFor="canManageUsers">Dashboard</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="canAccessConfig"
                checked={userForm.permissions.simulador}
                onCheckedChange={(checked) => handlePermissionChange('simulador', !!checked)}
              />
              <Label htmlFor="canAccessConfig">Simulador</Label>
            </div>
          </div>
        </div>

        <div className="col-span-2 flex items-center space-x-2">
          <Switch
            id="active"
            checked={userForm.active}
            onCheckedChange={(checked) => onFormChange({ active: checked })}
          />
          <Label htmlFor="active">Usuário ativo</Label>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSave} className="bg-gradient-primary">
          {editingUser ? 'Salvar' : 'Criar'}
        </Button>
      </DialogFooter>
    </>
  );
}