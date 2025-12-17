import { Employee } from "@/types/employee";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileDown, User, MapPin, CreditCard, Phone, Heart, Users, Building2 } from "lucide-react";
import { generateEmployeePDF } from "@/lib/pdfGenerator";

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
}

const maritalStatusLabels: Record<string, string> = {
  single: "Solteiro(a)",
  married: "Casado(a)",
  divorced: "Divorciado(a)",
  widowed: "Viúvo(a)",
  separated: "Separado(a)",
};

const pixTypeLabels: Record<string, string> = {
  cpf: "CPF",
  phone: "Telefone",
  email: "E-mail",
  random: "Chave Aleatória",
};

const relationLabels: Record<string, string> = {
  spouse: "Cônjuge",
  parent: "Pai/Mãe",
  mother: "Mãe",
  father: "Pai",
  sibling: "Irmão(ã)",
  child: "Filho(a)",
  friend: "Amigo(a)",
  other: "Outro",
};

export function EmployeeDetailModal({ employee, onClose }: EmployeeDetailModalProps) {
  if (!employee) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  };

  const placeOfBirth = employee.foreignCountry
    ? [employee.foreignCity, employee.foreignState, employee.foreignCountry].filter(Boolean).join(', ')
    : employee.birthPlace
      ? `${employee.birthPlace} - ${employee.birthPlaceState}`
      : '-';

  return (
    <Dialog open={!!employee} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl">{employee.fullName}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateEmployeePDF(employee)}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Exportar PDF
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Data */}
          <section>
            <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
              <User className="h-4 w-4" />
              Dados Pessoais
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Data de Nascimento</span>
                <p className="font-medium">{formatDate(employee.birthDate)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Nacionalidade</span>
                <p className="font-medium">{employee.nationality}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Naturalidade</span>
                <p className="font-medium">{placeOfBirth}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Address */}
          <section>
            <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4" />
              Endereço
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">{employee.street}</p>
              <p className="text-muted-foreground">
                {employee.neighborhood} - {employee.city}/{employee.state}
              </p>
              <p className="text-muted-foreground">CEP: {employee.zipCode}</p>
            </div>
          </section>

          <Separator />

          {/* Payment */}
          <section>
            <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4" />
              Dados de Pagamento
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Banco</span>
                <p className="font-medium">{employee.bank}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tipo PIX</span>
                <p className="font-medium">{pixTypeLabels[employee.pixType] || employee.pixType}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Chave PIX</span>
                <p className="font-medium break-all">{employee.pixKey}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Emergency Contact */}
          <section>
            <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
              <Phone className="h-4 w-4" />
              Contato de Emergência
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Nome</span>
                <p className="font-medium">{employee.emergencyName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Telefone</span>
                <p className="font-medium">{employee.emergencyPhone}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Relação</span>
                <p className="font-medium">{relationLabels[employee.emergencyRelation] || employee.emergencyRelation}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Health & Family */}
          <section>
            <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4" />
              Saúde e Família
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Tipo Sanguíneo</span>
                <p>
                  <Badge variant={employee.bloodType === "unknown" ? "outline" : "destructive"}>
                    {employee.bloodType === "unknown" ? "Não informado" : employee.bloodType}
                  </Badge>
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Estado Civil</span>
                <p className="font-medium">{maritalStatusLabels[employee.maritalStatus]}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Filhos</span>
                <p className="font-medium">
                  {employee.hasChildren ? `Sim (${employee.childrenCount})` : "Não"}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Work Unit */}
          <section>
            <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4" />
              Unidade de Trabalho
            </h3>
            <Badge className="text-base px-4 py-2">{employee.workUnit}</Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Atualizado em: {formatDate(employee.updatedAt)}
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
