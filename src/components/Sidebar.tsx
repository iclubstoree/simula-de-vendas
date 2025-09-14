import { 
  Calculator, 
  Settings, 
  BookOpen, 
  HelpCircle, 
  Crown,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  expanded: boolean;
}

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Calculator, label: "Simulador", path: "/" },
  { icon: BookOpen, label: "Tutorial", path: "/tutorial" },
  { icon: HelpCircle, label: "FAQ", path: "/faq" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export function Sidebar({ expanded }: SidebarProps) {
  const location = useLocation();
  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-border z-30 transition-all duration-300 ease-in-out ${
        expanded 
          ? 'w-64 translate-x-0 shadow-xl' 
          : 'w-[72px] -translate-x-full lg:translate-x-0'
      } lg:relative lg:translate-x-0 lg:shadow-none lg:top-0 lg:h-screen`}
    >
      <div className="flex flex-col h-full">
        {/* Navigation Menu */}
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink key={index} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 transition-all duration-200",
                    isActive 
                      ? "bg-gradient-primary text-primary-foreground shadow-lg hover:shadow-xl" 
                      : "hover:bg-sidebar-accent",
                    !expanded && 'px-2'
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !expanded && 'mx-auto')} />
                  {expanded && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Button>
              </NavLink>
            );
          })}
        </nav>

        {/* Pro Version Card */}
        {expanded && (
          <Card className="mx-2 mb-2 p-4 bg-gradient-primary text-primary-foreground hover-float">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5" />
              <Badge variant="secondary" className="text-xs">
                PRO
              </Badge>
            </div>
            <p className="text-sm opacity-90 mb-3">
              Recursos avançados e relatórios completos
            </p>
            <Button 
              size="sm" 
              variant="secondary"
              className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
            >
              Upgrade
            </Button>
          </Card>
        )}
      </div>
    </aside>
  );
}