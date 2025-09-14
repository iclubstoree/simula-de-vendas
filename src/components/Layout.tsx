import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // Start collapsed on mobile

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onToggleSidebar={toggleSidebar} sidebarExpanded={sidebarExpanded} />
      
      <div className="flex pt-16 relative gap-x-4">
        <Sidebar expanded={sidebarExpanded} />
        
        {/* Overlay for mobile when sidebar is expanded */}
        {sidebarExpanded && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarExpanded(false)}
          />
        )}
        
        <main 
          className={`flex-1 transition-all duration-300 relative z-10 ml-0 pl-0 h-[calc(100vh-4rem)] overflow-y-auto ${
            sidebarExpanded ? 'lg:ml-0' : 'lg:ml-0'
          }`}
        >
          <div className="w-full max-w-none md:ml-0 md:pl-0 pr-4 pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}