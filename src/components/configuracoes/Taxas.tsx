import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Edit, CreditCard, Trash2, Settings } from "lucide-react";
import { 
  stores,
  type CardMachine 
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

export function Taxas() {
  const { cardMachines, updateCardMachine, addCardMachine, deleteCardMachine } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ratesDialogOpen, setRatesDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<CardMachine | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>("all");
  
  const [machineForm, setMachineForm] = useState({
    name: "",
    stores: [] as string[],
    maxInstallments: "12",
    active: true,
    paymentTypes: {
      debit: true,
      credit: true
    }
  });
  
  const [ratesForm, setRatesForm] = useState<{[key: number]: string}>({});
  const [debitRateForm, setDebitRateForm] = useState<string>("");
  
  const { toast } = useToast();

  // Filter machines by store
  const filteredMachines = cardMachines.filter(machine => {
    if (selectedStore === "all") return true;
    return machine.stores.includes(selectedStore);
  });

  const handleOpenDialog = (machine?: CardMachine) => {
    if (machine) {
      setEditingMachine(machine);
      setMachineForm({
        name: machine.name,
        stores: machine.stores, // Use the array of stores directly
        maxInstallments: machine.maxInstallments.toString(),
        active: machine.active ?? true,
        paymentTypes: machine.paymentTypes || { debit: true, credit: true }
      });
    } else {
      setEditingMachine(null);
      setMachineForm({
        name: "",
        stores: [],
        maxInstallments: "12",
        active: true,
        paymentTypes: {
          debit: true,
          credit: true
        }
      });
    }
    setDialogOpen(true);
  };

  const handleOpenRatesDialog = (machine: CardMachine) => {
    setEditingMachine(machine);
    const rates: {[key: number]: string} = {};

    // Initialize rates form with current machine rates
    for (let i = 1; i <= machine.maxInstallments; i++) {
      rates[i] = (machine.rates[i] || 0).toString();
    }
    setRatesForm(rates);
    setDebitRateForm((machine.debitRate || 0).toString());
    setRatesDialogOpen(true);
  };

  const handleSaveMachine = () => {
    if (!machineForm.name.trim() || machineForm.stores.length === 0) {
      toast({
        title: "Erro",
        description: "Nome e pelo menos uma loja são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const maxInstallments = parseInt(machineForm.maxInstallments);
    if (isNaN(maxInstallments) || maxInstallments < 1 || maxInstallments > 24) {
      toast({
        title: "Erro",
        description: "Número máximo de parcelas deve ser entre 1 e 24",
        variant: "destructive"
      });
      return;
    }


    if (editingMachine) {
      // Edit existing machine
      updateCardMachine(editingMachine.id, {
        name: machineForm.name,
        stores: machineForm.stores, // Use all selected stores
        maxInstallments,
        active: machineForm.active,
        paymentTypes: machineForm.paymentTypes
      });
      toast({
        title: "Sucesso",
        description: "Máquina atualizada com sucesso"
      });
    } else {
      // Create new machine with default rates
      const defaultRates: { [key: number]: number } = {};
      for (let i = 1; i <= maxInstallments; i++) {
        defaultRates[i] = i === 1 ? 0 : i * 1.5; // Default rate calculation
      }

      // Create single machine for all selected stores
      const newMachine: CardMachine = {
        id: `machine-${Date.now()}`,
        name: machineForm.name,
        stores: machineForm.stores,
        maxInstallments,
        rates: defaultRates,
        active: machineForm.active,
        paymentTypes: machineForm.paymentTypes
      };

      addCardMachine(newMachine);
      toast({
        title: "Sucesso",
        description: "Máquina criada com sucesso"
      });
    }

    setDialogOpen(false);
    setEditingMachine(null);
  };

  const handleSaveRates = () => {
    if (!editingMachine) return;

    const newRates: { [key: number]: number } = {};
    let hasError = false;

    // Validate and convert rates
    for (let i = 1; i <= editingMachine.maxInstallments; i++) {
      const rateValue = parseFloat(ratesForm[i] || "0");
      if (isNaN(rateValue) || rateValue < 0 || rateValue > 100) {
        toast({
          title: "Erro",
          description: `Taxa da ${i}x deve ser um número entre 0 and 100`,
          variant: "destructive"
        });
        hasError = true;
        break;
      }
      newRates[i] = rateValue;
    }

    if (hasError) return;

    // Validate debit rate
    const debitRateValue = parseFloat(debitRateForm || "0");
    if (isNaN(debitRateValue) || debitRateValue < 0 || debitRateValue > 100) {
      toast({
        title: "Erro",
        description: "Taxa de débito deve ser um número entre 0 e 100",
        variant: "destructive"
      });
      return;
    }

    // Update machine rates and debit rate
    updateCardMachine(editingMachine.id, {
      rates: newRates,
      debitRate: debitRateValue
    });

    setRatesDialogOpen(false);
    setEditingMachine(null);
    toast({
      title: "Sucesso",
      description: "Taxas atualizadas com sucesso"
    });
  };

  const deleteMachine = (machineId: string) => {
    const machine = cardMachines.find(m => m.id === machineId);
    deleteCardMachine(machineId);
    toast({
      title: "Máquina removida",
      description: `${machine?.name} foi removida do sistema`
    });
  };

  const generateDefaultRates = () => {
    if (!editingMachine) return;

    const defaultRates: {[key: number]: string} = {};
    for (let i = 1; i <= editingMachine.maxInstallments; i++) {
      defaultRates[i] = i === 1 ? "0" : (i * 1.5).toString();
    }
    setRatesForm(defaultRates);
    setDebitRateForm("1.2");
    
    toast({
      title: "Taxas geradas",
      description: "Taxas padrão foram aplicadas"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Máquinas de Cartão</h3>
          <p className="text-sm text-muted-foreground">
            Configure as máquinas de cartão e suas respectivas taxas por parcela
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-gradient-primary hover:bg-primary-hover press-effect"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Máquina
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMachine ? 'Editar Máquina' : 'Nova Máquina'}
              </DialogTitle>
              <DialogDescription>
                {editingMachine 
                  ? 'Atualize as informações da máquina'
                  : 'Cadastre uma nova máquina de cartão'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="machineName">Nome da Máquina</Label>
                  <Input
                    id="machineName"
                    placeholder="Ex: Stone, Cielo, Rede"
                    value={machineForm.name}
                    onChange={(e) => setMachineForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Lojas que usam esta máquina</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {stores.filter(store => store.active).map(store => (
                      <label key={store.id} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={machineForm.stores.includes(store.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMachineForm(prev => ({
                                ...prev,
                                stores: [...prev.stores, store.id]
                              }));
                            } else {
                              setMachineForm(prev => ({
                                ...prev,
                                stores: prev.stores.filter(id => id !== store.id)
                              }));
                            }
                          }}
                          className="rounded border-input"
                        />
                        <span className="text-sm">{store.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxInstallments">Máximo de Parcelas</Label>
                <Input
                  id="maxInstallments"
                  type="number"
                  min="1"
                  max="24"
                  placeholder="12"
                  value={machineForm.maxInstallments}
                  onChange={(e) => setMachineForm(prev => ({ ...prev, maxInstallments: e.target.value }))}
                />
              </div>

              {/* Payment Types Section */}
              <div className="space-y-3">
                <Label>Tipos de Pagamento Aceitos</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="debit"
                      checked={machineForm.paymentTypes.debit}
                      onChange={(e) =>
                        setMachineForm(prev => ({
                          ...prev,
                          paymentTypes: { ...prev.paymentTypes, debit: e.target.checked }
                        }))
                      }
                      className="rounded border-input"
                    />
                    <Label htmlFor="debit" className="text-sm">Débito</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="credit"
                      checked={machineForm.paymentTypes.credit}
                      onChange={(e) =>
                        setMachineForm(prev => ({
                          ...prev,
                          paymentTypes: { ...prev.paymentTypes, credit: e.target.checked }
                        }))
                      }
                      className="rounded border-input"
                    />
                    <Label htmlFor="credit" className="text-sm">Crédito</Label>
                  </div>
                </div>
              </div>


              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={machineForm.active}
                  onCheckedChange={(checked) => setMachineForm(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Máquina ativa</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveMachine} className="bg-gradient-primary">
                {editingMachine ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Loja</Label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Lojas</SelectItem>
                  {stores.filter(store => store.active).map(store => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machines Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Máquinas Cadastradas ({filteredMachines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Máquina</TableHead>
                  <TableHead>Lojas</TableHead>
                  <TableHead>Máx. Parcelas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMachines.map((machine) => (
                  <TableRow key={machine.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        {machine.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {machine.stores.map(storeId => {
                          const store = stores.find(s => s.id === storeId);
                          return store ? (
                            <Badge key={storeId} variant="outline" className="text-xs">
                              {store.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {machine.maxInstallments}x
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOpenRatesDialog(machine)}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOpenDialog(machine)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMachine(machine.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredMachines.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma máquina encontrada
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rates Dialog */}
      <Dialog open={ratesDialogOpen} onOpenChange={setRatesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Configurar Taxas - {editingMachine?.name}
            </DialogTitle>
            <DialogDescription>
              Configure as taxas por parcela para esta máquina
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Taxas em porcentagem (%)
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateDefaultRates}
              >
                Gerar Taxas Padrão
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Debit Rate Section */}
              {editingMachine?.paymentTypes?.debit && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Taxa de Débito</h4>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                    <Label htmlFor="debit-rate" className="font-medium text-blue-700">
                      Débito
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="debit-rate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0.0"
                        value={debitRateForm}
                        onChange={(e) => setDebitRateForm(e.target.value)}
                        className="text-center w-20"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Installments Section */}
              {editingMachine?.paymentTypes?.credit && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Taxas de Crédito por Parcela</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {editingMachine && Array.from({ length: editingMachine.maxInstallments }, (_, i) => i + 1).map((installment) => (
                      <div key={installment} className="flex items-center justify-between p-3 border rounded-lg">
                        <Label htmlFor={`rate-${installment}`} className="font-medium">
                          {installment}x
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id={`rate-${installment}`}
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="0.0"
                            value={ratesForm[installment] || ""}
                            onChange={(e) => setRatesForm(prev => ({
                              ...prev,
                              [installment]: e.target.value
                            }))}
                            className="text-center w-20"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRatesDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRates} className="bg-gradient-primary">
              Salvar Taxas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}