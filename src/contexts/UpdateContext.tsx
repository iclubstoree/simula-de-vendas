import React, { createContext, useContext, useState, useCallback } from "react";

interface UpdateContextType {
  triggerDashboardUpdate: () => void;
  triggerSimulatorUpdate: () => void;
  dashboardUpdateKey: number;
  simulatorUpdateKey: number;
  lastConfigUpdate: Date | null;
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

export function UpdateProvider({ children }: { children: React.ReactNode }) {
  const [dashboardUpdateKey, setDashboardUpdateKey] = useState(0);
  const [simulatorUpdateKey, setSimulatorUpdateKey] = useState(0);
  const [lastConfigUpdate, setLastConfigUpdate] = useState<Date | null>(null);

  const triggerDashboardUpdate = useCallback(() => {
    console.log('📊 Triggering dashboard update...');
    setDashboardUpdateKey(prev => prev + 1);
    setLastConfigUpdate(new Date());
  }, []);

  const triggerSimulatorUpdate = useCallback(() => {
    console.log('🎯 Triggering simulator update...');
    setSimulatorUpdateKey(prev => prev + 1);
    setLastConfigUpdate(new Date());
  }, []);

  const value: UpdateContextType = {
    triggerDashboardUpdate,
    triggerSimulatorUpdate,
    dashboardUpdateKey,
    simulatorUpdateKey,
    lastConfigUpdate
  };

  return (
    <UpdateContext.Provider value={value}>
      {children}
    </UpdateContext.Provider>
  );
}

export function useUpdates() {
  const context = useContext(UpdateContext);
  if (context === undefined) {
    throw new Error('useUpdates must be used within an UpdateProvider');
  }
  return context;
}