
import { ClipboardEdit, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isAdminPage = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="gradient-header text-primary-foreground sticky top-0 z-50">
      <div className="container py-4 px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <ClipboardEdit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Atualização de Dados</h1>
              <p className="text-sm text-primary-foreground/80">Sistema de Gestão de Funcionários</p>
            </div>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-2">
                <Link to={isAdminPage ? "/" : "/admin"}>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">{isAdminPage ? "Formulário" : "Painel Admin"}</span>
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" className="gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
