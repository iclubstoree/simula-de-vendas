import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PhoneModel } from '@/data/mockData';
import { phoneModels as mockPhoneModels } from '@/data/mockData';

// API simulation functions
const fetchModels = async (): Promise<PhoneModel[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPhoneModels;
};

const updateModelsBulk = async (updates: { id: string; name?: string; pricesByStore?: Record<string, number> }[]): Promise<PhoneModel[]> => {
  console.log('🔄 updateModelsBulk called with:', updates);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock implementation - in real app this would call the backend
  const updatedModels = mockPhoneModels.map(model => {
    const update = updates.find(u => u.id === model.id);
    if (update) {
      const updatedModel = {
        ...model,
        ...(update.name && { name: update.name }),
        ...(update.pricesByStore && { prices: { ...model.prices, ...update.pricesByStore } })
      };
      console.log(`📝 Updated model ${model.id}:`, { 
        old: model.prices, 
        new: updatedModel.prices 
      });
      return updatedModel;
    }
    return model;
  });
  
  // Update the mock data in place
  mockPhoneModels.splice(0, mockPhoneModels.length, ...updatedModels);
  
  console.log('✅ updateModelsBulk completed, returning:', updatedModels.length, 'models');
  return updatedModels;
};

// React Query hooks
export const useModels = () => {
  return useQuery({
    queryKey: ['models'],
    queryFn: fetchModels,
  });
};

export const useBulkUpdateModels = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateModelsBulk,
    onMutate: async (updates) => {
      console.log('🚀 onMutate called with:', updates);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['models'] });

      // Snapshot the previous value
      const previousModels = queryClient.getQueryData<PhoneModel[]>(['models']);
      console.log('📸 Previous models count:', previousModels?.length);

      // Optimistically update to the new value
      if (previousModels) {
        const updatedModels = previousModels.map(model => {
          const update = updates.find(u => u.id === model.id);
          if (update) {
            const optimisticModel = {
              ...model,
              ...(update.name && { name: update.name }),
              ...(update.pricesByStore && { 
                prices: { 
                  ...model.prices, 
                  ...Object.entries(update.pricesByStore).reduce((acc, [storeId, price]) => ({
                    ...acc,
                    [storeId]: price
                  }), {})
                }
              })
            };
            console.log(`🔄 Optimistic update for ${model.id}:`, {
              old: model.prices,
              new: optimisticModel.prices
            });
            return optimisticModel;
          }
          return model;
        });

        queryClient.setQueryData(['models'], updatedModels);
        console.log('✨ Optimistic update applied to cache');
      }

      // Return a context object with the snapshotted value
      return { previousModels };
    },
    onError: (_error, _updates, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousModels) {
        queryClient.setQueryData(['models'], context.previousModels);
      }
    },
    onSuccess: (serverData) => {
      // Update with server data to ensure consistency
      queryClient.setQueryData(['models'], serverData);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['models'] });
    },
  });
};