import { useState } from "react";
import { Employee } from "@/types/employee";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileDown, Eye, Filter, X } from "lucide-react";
import { EmployeeDetailModal } from "./EmployeeDetailModal";
import { generateEmployeePDF, generateAllEmployeesPDF } from "@/lib/pdfGenerator";

interface EmployeeTableProps {
  employees: Employee[];
}

const workUnits = [
  "DaVinci Hotel",
  "Eros Motel",
  "Aphrodite Park Motel",
  "Chateau Motel",
  "LPM Imóveis",
];

const maritalStatusLabels: Record<string, string> = {
  single: "Solteiro(a)",
  married: "Casado(a)",
  divorced: "Divorciado(a)",
  widowed: "Viúvo(a)",
  separated: "Separado(a)",
};

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = unitFilter === "all" || emp.workUnit === unitFilter;
    const matchesBlood = bloodTypeFilter === "all" || emp.bloodType === bloodTypeFilter;
    return matchesSearch && matchesUnit && matchesBlood;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setUnitFilter("all");
    setBloodTypeFilter("all");
  };

  const hasActiveFilters = searchTerm || unitFilter !== "all" || bloodTypeFilter !== "all";

  const bloodTypes = [...new Set(employees.map(e => e.bloodType))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={unitFilter} onValueChange={setUnitFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Unidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Unidades</SelectItem>
            {workUnits.map((unit) => (
              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={bloodTypeFilter} onValueChange={setBloodTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Tipo Sanguíneo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            {bloodTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "unknown" ? "Não informado" : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {filteredEmployees.length} funcionário(s) encontrado(s)
        </p>
        <Button
          onClick={() => generateAllEmployeesPDF(filteredEmployees)}
          className="gap-2"
          disabled={filteredEmployees.length === 0}
        >
          <FileDown className="h-4 w-4" />
          Exportar Todos (PDF)
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Unidade</TableHead>
              <TableHead className="hidden md:table-cell">Cidade/UF</TableHead>
              <TableHead className="hidden lg:table-cell">Tipo Sang.</TableHead>
              <TableHead className="hidden lg:table-cell">Estado Civil</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum funcionário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <p className="font-medium">{employee.fullName}</p>
                      <p className="text-sm text-muted-foreground md:hidden">
                        {employee.workUnit}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className="font-normal">
                      {employee.workUnit}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {employee.city}/{employee.state}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant={employee.bloodType === "unknown" ? "outline" : "destructive"} className="font-normal">
                      {employee.bloodType === "unknown" ? "N/I" : employee.bloodType}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {maritalStatusLabels[employee.maritalStatus] || employee.maritalStatus}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedEmployee(employee)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => generateEmployeePDF(employee)}
                        title="Exportar PDF"
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
}
