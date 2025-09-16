import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Dashboard } from "./components/Dashboard";
import { Profile } from "./components/Profile";
import Configuracoes from "./pages/Configuracoes";
import Tutorial from "./pages/Tutorial";
import FAQ from "./pages/FAQ";
import { FiltersProvider } from "./contexts/FiltersContext";
import { DataProvider } from "./contexts/DataContext";
import { UpdateProvider } from "./contexts/UpdateContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UpdateProvider>
      <DataProvider>
        <FiltersProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tutorial" element={<Tutorial />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/configuracoes" element={<Configuracoes />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </FiltersProvider>
      </DataProvider>
    </UpdateProvider>
  </QueryClientProvider>
);

export default App;