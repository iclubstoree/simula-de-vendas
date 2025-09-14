import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, type DamageType } from "@/data/mockData";

interface DamageEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  damage: DamageType | null;
  onSave: (damage: DamageType) => void;
  onDelete: (damageId: string) => void;
}

export function DamageEditModal({ 
  open, 
  onOpenChange, 
  damage, 
  onSave,
  onDelete 
}: DamageEditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    discount: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    if (damage && open) {
      setFormData({
        name: damage.name,
        discount: damage.discount.toString()
      });
    } else {
      setFormData({
        name: "",
        discount: ""
      });
    }
  }, [damage, open]);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.discount) {
      toast({
        title: "Erro",
        description: "Nome e desconto são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const discount = parseFloat(formData.discount);
    if (isNaN(discount) || discount < 0) {
      toast({
        title: "Erro",
        description: "Desconto deve ser um número válido não negativo",
        variant: "destructive"
      });
      return;
    }

    if (!damage) return;

    const updatedDamage: DamageType = {
      ...damage,
      name: formData.name,
      discount
    };

    onSave(updatedDamage);
    // O componente pai controla o fechamento do modal
  };

  const handleDelete = () => {
    if (!damage) return;
    
    if (confirm(`Tem certeza que deseja excluir a avaria "${damage.name}"? Esta ação não pode ser desfeita.`)) {
      onDelete(damage.id);
      onOpenChange(false);
      toast({
        title: "Avaria excluída",
        description: `${damage.name} foi removida do sistema`
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!damage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Avaria
          </DialogTitle>
          <DialogDescription>
            Modifique as informações da avaria
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <Badge variant="outline" className="text-sm">
              ID: {damage.id}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="damage-name">Nome da Avaria</Label>
              <Input
                id="damage-name"
                placeholder="Ex: Display, Bateria, Carcaça"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="damage-discount">Desconto Padrão (R$)</Label>
              <Input
                id="damage-discount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Valor atual: {formatCurrency(damage.discount)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="bg-success hover:bg-success/90">
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}