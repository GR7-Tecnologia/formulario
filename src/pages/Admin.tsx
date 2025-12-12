import { useState } from "react";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { EmployeeTable } from "@/components/admin/EmployeeTable";
import { mockEmployees } from "@/types/employee";
import { LayoutDashboard, Users } from "lucide-react";

const Admin = () => {
  const [employees] = useState(mockEmployees);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie os dados dos funcionários</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-2">
              <Users className="h-4 w-4" />
              Funcionários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats employees={employees} />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeTable employees={employees} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
