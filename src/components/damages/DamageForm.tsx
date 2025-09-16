import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface DamageFormData {
  name: string;
  defaultDiscount: string;
}

interface DamageFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: DamageFormData;
  onFormChange: (updates: Partial<DamageFormData>) => void;
  onSave: () => void;
}

export function DamageForm({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSave
}: DamageFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Avaria</DialogTitle>
          <DialogDescription>
            Crie um novo tipo de avaria que será adicionado à matriz
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="damageName">Nome da Avaria</Label>
            <Input
              id="damageName"
              placeholder="Ex: Display, Bateria, Carcaça"
              value={formData.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="damageDiscount">Desconto Padrão (R$)</Label>
            <Input
              id="damageDiscount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.defaultDiscount}
              onChange={(e) => onFormChange({ defaultDiscount: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave} className="bg-gradient-primary">
            Criar Avaria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}