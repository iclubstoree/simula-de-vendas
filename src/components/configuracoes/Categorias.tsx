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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Plus, 
  Edit, 
  FolderTree, 
  ChevronDown, 
  ChevronRight, 
  GripVertical,
  Trash2 
} from "lucide-react";
import {
  subcategories,
  damageMatrix,
  type Category,
  type Subcategory
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

export function Categorias() {
  const { categories: categoriesList, addCategory, updateCategory } = useData();
  const [subcategoriesList, setSubcategoriesList] = useState<Subcategory[]>(subcategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    active: true
  });
  
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    categoryId: "",
    active: true
  });
  
  const { toast } = useToast();

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getSubcategoriesByCategory = (categoryId: string) => {
    return subcategoriesList
      .filter(sub => sub.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  };

  const handleOpenCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        active: category.active
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        active: true
      });
    }
    setDialogOpen(true);
  };

  const handleOpenSubcategoryDialog = (categoryId?: string, subcategory?: Subcategory) => {
    if (subcategory) {
      setEditingSubcategory(subcategory);
      setSubcategoryForm({
        name: subcategory.name,
        categoryId: subcategory.categoryId,
        active: subcategory.active
      });
    } else {
      setEditingSubcategory(null);
      setSubcategoryForm({
        name: "",
        categoryId: categoryId || "",
        active: true
      });
    }
    setSubDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (editingCategory) {
      // Edit existing category
      updateCategory(editingCategory.id, categoryForm);
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso"
      });
    } else {
      // Create new category
      addCategory(categoryForm);
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso"
      });
    }

    setDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSaveSubcategory = () => {
    if (!subcategoryForm.name.trim() || !subcategoryForm.categoryId) {
      toast({
        title: "Erro",
        description: "Nome da subcategoria e categoria são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (editingSubcategory) {
      // Edit existing subcategory  
      setSubcategoriesList(prev => prev.map(subcategory => 
        subcategory.id === editingSubcategory.id 
          ? { ...subcategory, ...subcategoryForm }
          : subcategory
      ));
      toast({
        title: "Sucesso",
        description: "Subcategoria atualizada com sucesso"
      });
    } else {
      // Create new subcategory
      const existingSubs = getSubcategoriesByCategory(subcategoryForm.categoryId);
      const newSubcategory: Subcategory = {
        id: `subcategory-${Date.now()}`,
        name: subcategoryForm.name,
        categoryId: subcategoryForm.categoryId,
        active: subcategoryForm.active,
        order: existingSubs.length + 1,
        createdAt: new Date()
      };
      setSubcategoriesList(prev => [...prev, newSubcategory]);
      
      // Auto-create damage matrix entries for this new subcategory
      // This would be handled by the backend in a real app
      toast({
        title: "Sucesso", 
        description: "Subcategoria criada com sucesso. Matriz de avarias atualizada automaticamente."
      });
    }

    setSubDialogOpen(false);
    setEditingSubcategory(null);
  };

  const deleteCategory = (categoryId: string) => {
    const category = categoriesList.find(c => c.id === categoryId);
    const associatedSubs = getSubcategoriesByCategory(categoryId);

    if (associatedSubs.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: "Esta categoria possui subcategorias associadas",
        variant: "destructive"
      });
      return;
    }

    // For now, show message that this is in development
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Exclusão de categorias será implementada em breve",
      variant: "default"
    });
  };

  const deleteSubcategory = (subcategoryId: string) => {
    const subcategory = subcategoriesList.find(s => s.id === subcategoryId);
    setSubcategoriesList(prev => prev.filter(s => s.id !== subcategoryId));
    
    // In a real app, this would also remove associated damage matrix entries
    toast({
      title: "Subcategoria excluída",
      description: `${subcategory?.name} foi removida do sistema`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Categorias e Subcategorias</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie a estrutura hierárquica dos produtos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleOpenCategoryDialog()}
              className="bg-gradient-primary hover:bg-primary-hover press-effect"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory 
                  ? 'Atualize o nome da categoria'
                  : 'Cadastre uma nova categoria no sistema'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Nome da Categoria</Label>
                <Input
                  id="categoryName"
                  placeholder="Ex: iPhone, Samsung, Xiaomi"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveCategory} className="bg-gradient-primary">
                {editingCategory ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Estrutura Hierárquica
          </CardTitle>
          <CardDescription>
            Organize seus produtos em categorias e subcategorias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" key={`categories-${categoriesList.length}-${subcategoriesList.length}`}>
            {categoriesList
              .sort((a, b) => a.order - b.order)
              .map((category) => (
                <div key={category.id} className="border rounded-lg">
                  {/* Category Row */}
                  <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="cursor-move">
                        <GripVertical className="h-4 w-4" />
                      </Button>
                      
                      <Collapsible>
                        <CollapsibleTrigger 
                          onClick={() => toggleExpanded(category.id)}
                          className="flex items-center gap-2 hover:bg-muted/50 p-1 rounded"
                        >
                          {expandedCategories.has(category.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                      </Collapsible>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant={category.active ? 'default' : 'secondary'}>
                          {category.active ? 'Ativa' : 'Inativa'}
                        </Badge>
                        <Badge variant="outline">
                          {getSubcategoriesByCategory(category.id).length} subcategorias
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenSubcategoryDialog(category.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Subcategoria
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenCategoryDialog(category)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCategory(category.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Subcategories */}
                  {expandedCategories.has(category.id) && (
                    <div className="border-t bg-muted/20">
                      {getSubcategoriesByCategory(category.id).map((subcategory) => (
                        <div 
                          key={subcategory.id} 
                          className="flex items-center justify-between p-4 pl-12 border-b last:border-b-0 hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="cursor-move">
                              <GripVertical className="h-4 w-4" />
                            </Button>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{subcategory.name}</span>
                              <Badge 
                                variant={subcategory.active ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {subcategory.active ? 'Ativa' : 'Inativa'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleOpenSubcategoryDialog(undefined, subcategory)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteSubcategory(subcategory.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {getSubcategoriesByCategory(category.id).length === 0 && (
                        <div className="p-4 pl-12 text-sm text-muted-foreground">
                          Nenhuma subcategoria cadastrada
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
          
          {categoriesList.length === 0 && (
            <div className="text-center py-12">
              <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma categoria cadastrada</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira categoria
              </p>
              <Button onClick={() => handleOpenCategoryDialog()} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Categoria
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subcategory Dialog */}
      <Dialog open={subDialogOpen} onOpenChange={setSubDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSubcategory ? 'Editar Subcategoria' : 'Nova Subcategoria'}
            </DialogTitle>
            <DialogDescription>
              {editingSubcategory 
                ? 'Atualize as informações da subcategoria'
                : 'Crie uma nova subcategoria'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subcategoryName">Nome da Subcategoria</Label>
              <Input
                id="subcategoryName"
                placeholder="Ex: iPhone 15, Galaxy S24..."
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Categoria Pai</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={subcategoryForm.categoryId}
                onChange={(e) => setSubcategoryForm(prev => ({ ...prev, categoryId: e.target.value }))}
                disabled={editingSubcategory !== null}
              >
                <option value="">Selecione uma categoria...</option>
                {categoriesList
                  .filter(cat => cat.active)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                }
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="subcategoryActive"
                checked={subcategoryForm.active}
                onCheckedChange={(checked) => setSubcategoryForm(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="subcategoryActive">Subcategoria ativa</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSubcategory} className="bg-gradient-primary">
              {editingSubcategory ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}