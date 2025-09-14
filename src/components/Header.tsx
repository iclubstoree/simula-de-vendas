import { Menu, Bell, Sun, Moon, User, Settings, LogOut, UserCircle, TrendingDown, AlertTriangle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarExpanded: boolean;
}

export function Header({ onToggleSidebar, sidebarExpanded }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const handleSettingsClick = () => {
    navigate('/configuracoes');
  };

  const handleLogout = () => {
    // Logic for logout
    console.log('Logout clicked');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-border/20">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost" 
            size="sm"
            onClick={onToggleSidebar}
            className={`hover:bg-primary/10 transition-all duration-200 ${
              sidebarExpanded ? 'bg-primary/5' : ''
            }`}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              iClub Vendas
            </h1>
            <Badge variant="secondary" className="text-xs">
              v1.0
            </Badge>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="hover:bg-primary/10"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-4 border-b">
                <h4 className="font-semibold">Notificações</h4>
                <p className="text-sm text-muted-foreground">Você tem 3 alertas importantes</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-3 hover:bg-muted/50 border-b">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Samsung Galaxy S24 com queda nas vendas</p>
                      <p className="text-xs text-muted-foreground">Redução de 25% nas simulações esta semana</p>
                      <p className="text-xs text-muted-foreground">há 2 horas</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-muted/50 border-b">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-orange-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vendedor Carlos Santos - baixa performance</p>
                      <p className="text-xs text-muted-foreground">Apenas 8 simulações nos últimos 3 dias</p>
                      <p className="text-xs text-muted-foreground">há 6 horas</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-muted/50">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-green-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">iPhone 15 Pro Max - alta demanda detectada</p>
                      <p className="text-xs text-muted-foreground">+35% de simulações nos últimos 2 dias</p>
                      <p className="text-xs text-muted-foreground">há 1 dia</p>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 bg-gradient-primary cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-medium">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">Ana Silva</p>
                <p className="text-xs text-muted-foreground">ana.silva@iclub.com</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <UserCircle className="mr-2 h-4 w-4" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}