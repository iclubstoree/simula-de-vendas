import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, EyeOff, Crown, UserCheck, User as UserIcon, Users as UsersIcon } from "lucide-react";
import { stores, type User } from "@/data/mockData";

interface UsersTableProps {
  users: User[];
  showPasswords: boolean;
  onTogglePasswords: () => void;
  onEditUser: (user: User) => void;
  onToggleUserActive: (userId: string) => void;
}

export function UsersTable({
  users,
  showPasswords,
  onTogglePasswords,
  onEditUser,
  onToggleUserActive
}: UsersTableProps) {
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Usuários Cadastrados ({users.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePasswords}
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
              {users.map((user) => (
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
                        onClick={() => onEditUser(user)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={user.active ? "destructive" : "default"}
                        onClick={() => onToggleUserActive(user.id)}
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

          {users.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}