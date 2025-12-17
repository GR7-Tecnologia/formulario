import { Employee } from "@/types/employee";
import { Users, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts } from "./DashboardCharts";
import { LocationStats } from "./LocationStats";

interface DashboardStatsProps {
  employees: Employee[];
}

export function DashboardStats({ employees }: DashboardStatsProps) {
  const totalEmployees = employees.length;
  
  const employeesByUnit = employees.reduce((acc, emp) => {
    acc[emp.workUnit] = (acc[emp.workUnit] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total de Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{totalEmployees}</p>
          </CardContent>
        </Card>

        <Card className="bg-accent/50 border-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Unidades Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{Object.keys(employeesByUnit).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <DashboardCharts employees={employees} />

      {/* Location Stats */}
      <LocationStats employees={employees} />
    </div>
  );
}
