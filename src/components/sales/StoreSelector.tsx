import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Store } from "lucide-react";

interface StoreSelectorProps {
  selectedStore: string;
  selectedStoreData?: { id: string; name: string; city?: string };
  allowedStores: Array<{ id: string; name: string; city?: string; active: boolean }>;
  onStoreChange: (storeId: string) => void;
  showModal: boolean;
  onShowModalChange: (show: boolean) => void;
  isSingleStoreUser: boolean;
}

export function StoreSelector({
  selectedStore,
  selectedStoreData,
  allowedStores,
  onStoreChange,
  showModal,
  onShowModalChange,
  isSingleStoreUser
}: StoreSelectorProps) {
  const handleStoreSelect = (storeId: string) => {
    onStoreChange(storeId);
    onShowModalChange(false);
  };

  return (
    <>
      {/* Store Selection Field */}
      <div>
        <Label htmlFor="store-select" className="flex items-center gap-2 text-sm font-medium">
          <Store className="h-4 w-4 text-primary" />
          Loja
        </Label>
        <div className="flex gap-2">
          <div className="flex-1">
            {selectedStore ? (
              <div className="flex items-center justify-between p-2 border rounded-md bg-muted">
                <span className="font-medium">
                  {selectedStoreData?.city || selectedStoreData?.name}
                </span>
                {!isSingleStoreUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShowModalChange(true)}
                    className="h-auto p-1"
                  >
                    <Store className="h-4 w-4" />
                  </Button>
                )}
                {isSingleStoreUser && (
                  <Badge variant="secondary" className="text-xs">
                    Fixo
                  </Badge>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => onShowModalChange(true)}
                className="w-full justify-start"
                disabled={isSingleStoreUser}
              >
                <Store className="h-4 w-4 mr-2" />
                {isSingleStoreUser ? "Loja única atribuída" : "Selecionar Loja"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Store Selection Modal */}
      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          // Only allow closing if there's already a store selected
          if (!open && selectedStore) {
            onShowModalChange(false);
          }
        }}
      >
        <DialogContent
          className="max-w-md"
          onInteractOutside={(e) => {
            // Prevent closing on outside click if no store is selected
            if (!selectedStore) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              {selectedStore ? "Trocar Loja" : "Selecionar Loja"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {allowedStores.length === 0 ? (
              <div className="text-center py-8">
                <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma loja disponível para seu usuário
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {allowedStores.map((store) => (
                  <Button
                    key={store.id}
                    variant={selectedStore === store.id ? "default" : "outline"}
                    className="justify-start h-auto p-4"
                    onClick={() => handleStoreSelect(store.id)}
                  >
                    <div className="text-left">
                      <div className="font-semibold">
                        {store.city || store.name}
                      </div>
                      {store.city && store.name !== store.city && (
                        <div className="text-sm text-muted-foreground">
                          {store.name}
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}