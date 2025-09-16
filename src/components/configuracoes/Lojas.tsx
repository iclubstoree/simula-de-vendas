import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, Edit, MapPin, Store as StoreIcon, Info } from "lucide-react";
import { type Store } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

export function Lojas() {
  const { stores: storesList, addStore, updateStore } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    active: true
  });
  const { toast } = useToast();

  const handleOpenDialog = (store?: Store) => {
    if (store) {
      setEditingStore(store);
      setFormData({
        name: store.name,
        city: store.city,
        active: store.active
      });
    } else {
      setEditingStore(null);
      setFormData({
        name: "",
        city: "",
        active: true
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.city.trim()) {
      toast({
        title: "Erro",
        description: "Nome e cidade são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (editingStore) {
      // Edit existing store
      updateStore(editingStore.id, formData);
      toast({
        title: "Sucesso",
        description: "Loja atualizada com sucesso"
      });
    } else {
      // Create new store
      addStore(formData);
      toast({
        title: "Sucesso",
        description: "Loja criada com sucesso"
      });
    }

    setDialogOpen(false);
    setEditingStore(null);
  };

  const toggleStoreActive = (storeId: string) => {
    const store = storesList.find(s => s.id === storeId);
    if (store) {
      updateStore(storeId, { active: !store.active });
      toast({
        title: !store.active ? "Loja ativada" : "Loja desativada",
        description: `${store.name} foi ${!store.active ? 'ativada' : 'desativada'} com sucesso`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Lojas Cadastradas</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie as lojas do sistema
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-gradient-primary hover:bg-primary-hover press-effect"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Loja
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStore ? 'Editar Loja' : 'Nova Loja'}
              </DialogTitle>
              <DialogDescription>
                {editingStore 
                  ? 'Atualize as informações da loja'
                  : 'Cadastre uma nova loja no sistema'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Loja</Label>
                <Input
                  id="name"
                  placeholder="Ex: iClub Castanhal"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Ex: Castanhal"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Loja ativa</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-gradient-primary">
                {editingStore ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Importante sobre lojas</p>
              <p className="text-sm text-muted-foreground">
                Configure as lojas do sistema. Cada loja pode ter preços diferentes para os produtos. 
                Lojas inativas serão removidas de todos os formulários e configurações.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stores Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {storesList.map((store) => (
          <Card key={store.id} className="hover-float">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <StoreIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{store.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {store.city}
                    </CardDescription>
                  </div>
                  <Switch
                    checked={store.active}
                    onCheckedChange={() => toggleStoreActive(store.id)}
                    size="sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleOpenDialog(store)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    const updatedStores = storesList.filter(s => s.id !== store.id);
                    setStoresList(updatedStores);
                    toast({
                      title: "Loja excluída",
                      description: `${store.name} foi removida do sistema`
                    });
                  }}
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {storesList.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <StoreIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma loja cadastrada</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando sua primeira loja no sistema
            </p>
            <Button onClick={() => handleOpenDialog()} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Loja
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}