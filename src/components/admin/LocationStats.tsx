import { Employee } from "@/types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building, Map } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LocationStatsProps {
  employees: Employee[];
}

export function LocationStats({ employees }: LocationStatsProps) {
  const employeesByNeighborhood = Object.entries(
    employees.reduce((acc, emp) => {
      acc[emp.neighborhood] = (acc[emp.neighborhood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const employeesByCity = Object.entries(
    employees.reduce((acc, emp) => {
      acc[emp.city] = (acc[emp.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const employeesByState = Object.entries(
    employees.reduce((acc, emp) => {
      acc[emp.state] = (acc[emp.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* By Neighborhood */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Por Bairro
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bairro</TableHead>
                <TableHead className="text-right w-20">Qtd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesByNeighborhood.map(([neighborhood, count]) => (
                <TableRow key={neighborhood}>
                  <TableCell className="font-medium truncate max-w-[150px]">
                    {neighborhood}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-semibold">
                      {count}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {employeesByNeighborhood.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Nenhum dado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* By City */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5 text-destructive" />
            Por Cidade
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cidade</TableHead>
                <TableHead className="text-right w-20">Qtd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesByCity.map(([city, count]) => (
                <TableRow key={city}>
                  <TableCell className="font-medium truncate max-w-[150px]">
                    {city}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-md text-sm font-semibold">
                      {count}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {employeesByCity.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Nenhum dado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* By State */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Map className="h-5 w-5 text-accent-foreground" />
            Por Estado
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right w-20">Qtd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesByState.map(([state, count]) => (
                <TableRow key={state}>
                  <TableCell className="font-medium">{state}</TableCell>
                  <TableCell className="text-right">
                    <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-sm font-semibold">
                      {count}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {employeesByState.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Nenhum dado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
