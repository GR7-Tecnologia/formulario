import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, MapPin, Wallet, Heart, Droplets, Baby, Users, CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  return numbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const employeeSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().min(14, "CPF inválido").max(14, "CPF inválido"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  nationality: z.string().min(2, "Nacionalidade é obrigatória"),
  birthPlace: z.string().min(2, "Naturalidade é obrigatória"),
  birthPlaceState: z.string().min(1, "UF da naturalidade é obrigatória"),
  street: z.string().min(3, "Rua é obrigatória"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  zipCode: z.string().min(8, "CEP inválido"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  bank: z.string().min(2, "Banco é obrigatório"),
  pixKey: z.string().min(1, "Chave PIX é obrigatória"),
  pixType: z.string().min(1, "Tipo de chave PIX é obrigatório"),
  emergencyContactName: z.string().min(3, "Nome do contato de emergência é obrigatório"),
  emergencyContactPhone: z.string().min(10, "Telefone de emergência inválido"),
  emergencyContactRelation: z.string().min(1, "Parentesco é obrigatório"),
  bloodType: z.string().min(1, "Tipo sanguíneo é obrigatório"),
  maritalStatus: z.string().min(1, "Estado civil é obrigatório"),
  hasChildren: z.string().min(1, "Informe se possui filhos"),
  numberOfChildren: z.string().optional(),
  workUnit: z.string().min(1, "Unidade de trabalho é obrigatória"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Não sei informar"];

const maritalStatuses = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
  { value: "divorciado", label: "Divorciado(a)" },
  { value: "viuvo", label: "Viúvo(a)" },
  { value: "uniao_estavel", label: "União Estável" },
];

const pixTypes = [
  { value: "cpf", label: "CPF" },
  { value: "telefone", label: "Telefone" },
  { value: "email", label: "E-mail" },
  { value: "aleatoria", label: "Chave Aleatória" },
];

const relations = [
  "Cônjuge",
  "Pai",
  "Mãe",
  "Filho(a)",
  "Irmão(ã)",
  "Outro",
];

const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const workUnits = [
  "DaVinci Hotel",
  "Eros Motel",
  "Aphrodite Park Motel",
  "Chateau Motel",
  "LPM Imóveis",
];

export function EmployeeForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasChildren, setHasChildren] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const watchHasChildren = watch("hasChildren");

  const onSubmit = async (data: EmployeeFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Employee data:", data);
    setIsSubmitted(true);
    
    toast({
      title: "Dados atualizados!",
      description: `Os dados de ${data.fullName} foram salvos com sucesso.`,
    });

    setTimeout(() => {
      setIsSubmitted(false);
      reset();
      setHasChildren("");
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-success animate-check-bounce" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Dados Atualizados!</h2>
        <p className="text-muted-foreground text-center">
          As informações foram salvas com sucesso.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      {/* Personal Data Section */}
      <section className="form-section animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h2 className="form-section-title">
          <User className="w-5 h-5 text-primary" />
          Dados Pessoais
        </h2>
        
        <div className="space-y-4">
          <div className="input-group">
            <Label htmlFor="fullName">Nome Completo *</Label>
            <Input
              id="fullName"
              placeholder="Digite seu nome completo"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              maxLength={14}
              {...register("cpf")}
              onChange={(e) => {
                const formatted = formatCPF(e.target.value);
                setValue("cpf", formatted);
              }}
            />
            {errors.cpf && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.cpf.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <Label htmlFor="birthDate">Data de Nascimento *</Label>
            <Input
              id="birthDate"
              type="date"
              {...register("birthDate")}
            />
            {errors.birthDate && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.birthDate.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <Label htmlFor="nationality">Nacionalidade *</Label>
            <Input
              id="nationality"
              placeholder="Ex: Brasileira"
              {...register("nationality")}
            />
            {errors.nationality && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.nationality.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="input-group col-span-2">
              <Label htmlFor="birthPlace">Naturalidade *</Label>
              <Input
                id="birthPlace"
                placeholder="Cidade de nascimento"
                {...register("birthPlace")}
              />
              {errors.birthPlace && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.birthPlace.message}
                </p>
              )}
            </div>

            <div className="input-group">
              <Label htmlFor="birthPlaceState">UF *</Label>
              <Select onValueChange={(value) => setValue("birthPlaceState", value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.birthPlaceState && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.birthPlaceState.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Address Section */}
      <section className="form-section animate-fade-in" style={{ animationDelay: "0.12s" }}>
        <h2 className="form-section-title">
          <MapPin className="w-5 h-5 text-primary" />
          Endereço
        </h2>
        
        <div className="space-y-4">
          <div className="input-group">
            <Label htmlFor="street">Rua / Logradouro *</Label>
            <Input
              id="street"
              placeholder="Rua, número, complemento"
              {...register("street")}
            />
            {errors.street && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.street.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <Label htmlFor="neighborhood">Bairro *</Label>
            <Input
              id="neighborhood"
              placeholder="Bairro"
              {...register("neighborhood")}
            />
            {errors.neighborhood && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.neighborhood.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="input-group">
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                placeholder="00000-000"
                {...register("zipCode")}
              />
              {errors.zipCode && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.zipCode.message}
                </p>
              )}
            </div>

            <div className="input-group col-span-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                placeholder="Cidade"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          <div className="input-group">
            <Label htmlFor="state">Estado *</Label>
            <Select onValueChange={(value) => setValue("state", value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {brazilianStates.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.state.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* PIX Section */}
      <section className="form-section animate-fade-in" style={{ animationDelay: "0.15s" }}>
        <h2 className="form-section-title">
          <Wallet className="w-5 h-5 text-primary" />
          Dados para Pagamento (PIX)
        </h2>
        
        <div className="space-y-4">
          <div className="input-group">
            <Label htmlFor="bank">Banco *</Label>
            <Input
              id="bank"
              placeholder="Ex: Nubank, Itaú, Bradesco..."
              {...register("bank")}
            />
            {errors.bank && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.bank.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <Label htmlFor="pixType">Tipo de Chave PIX *</Label>
            <Select onValueChange={(value) => setValue("pixType", value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {pixTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pixType && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.pixType.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <Label htmlFor="pixKey">Chave PIX *</Label>
            <Input
              id="pixKey"
              placeholder="Digite sua chave PIX"
              {...register("pixKey")}
            />
            {errors.pixKey && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.pixKey.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="form-section animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <h2 className="form-section-title">
          <Phone className="w-5 h-5 text-primary" />
          Contato de Emergência
        </h2>
        
        <div className="space-y-4">
          <div className="input-group">
            <Label htmlFor="emergencyContactName">Nome do Contato *</Label>
            <Input
              id="emergencyContactName"
              placeholder="Nome completo"
              {...register("emergencyContactName")}
            />
            {errors.emergencyContactName && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.emergencyContactName.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <Label htmlFor="emergencyContactPhone">Telefone *</Label>
            <Input
              id="emergencyContactPhone"
              type="tel"
              placeholder="(00) 00000-0000"
              {...register("emergencyContactPhone")}
            />
            {errors.emergencyContactPhone && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.emergencyContactPhone.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <Label htmlFor="emergencyContactRelation">Parentesco *</Label>
            <Select onValueChange={(value) => setValue("emergencyContactRelation", value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecione o parentesco" />
              </SelectTrigger>
              <SelectContent>
                {relations.map((relation) => (
                  <SelectItem key={relation} value={relation}>
                    {relation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.emergencyContactRelation && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.emergencyContactRelation.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Health Section */}
      <section className="form-section animate-fade-in" style={{ animationDelay: "0.25s" }}>
        <h2 className="form-section-title">
          <Droplets className="w-5 h-5 text-primary" />
          Informações de Saúde
        </h2>
        
        <div className="space-y-4">
          <div className="input-group">
            <Label>Tipo Sanguíneo *</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {bloodTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center justify-center h-12 rounded-lg border-2 border-input bg-card cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-center px-2"
                >
                  <input
                    type="radio"
                    value={type}
                    className="sr-only"
                    {...register("bloodType")}
                  />
                  <span className="font-medium text-foreground text-sm">{type}</span>
                </label>
              ))}
            </div>
            {errors.bloodType && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.bloodType.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Family Section */}
      <section className="form-section animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="form-section-title">
          <Heart className="w-5 h-5 text-primary" />
          Informações Familiares
        </h2>
        
        <div className="space-y-4">
          <div className="input-group">
            <Label>Estado Civil *</Label>
            <Select onValueChange={(value) => setValue("maritalStatus", value)}>
              <SelectTrigger className="h-12">
                <Users className="w-5 h-5 text-muted-foreground mr-2" />
                <SelectValue placeholder="Selecione o estado civil" />
              </SelectTrigger>
              <SelectContent>
                {maritalStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.maritalStatus && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.maritalStatus.message}
              </p>
            )}
          </div>

          <div className="input-group">
            <Label>Possui filhos? *</Label>
            <RadioGroup
              className="flex gap-4 mt-2"
              onValueChange={(value) => {
                setValue("hasChildren", value);
                setHasChildren(value);
                if (value === "nao") {
                  setValue("numberOfChildren", "0");
                }
              }}
            >
              <label className="flex items-center gap-3 flex-1 h-12 px-4 rounded-lg border-2 border-input bg-card cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="sim" id="children-yes" />
                <span className="font-medium">Sim</span>
              </label>
              <label className="flex items-center gap-3 flex-1 h-12 px-4 rounded-lg border-2 border-input bg-card cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="nao" id="children-no" />
                <span className="font-medium">Não</span>
              </label>
            </RadioGroup>
            {errors.hasChildren && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.hasChildren.message}
              </p>
            )}
          </div>

          {(hasChildren === "sim" || watchHasChildren === "sim") && (
            <div className="input-group animate-fade-in">
              <Label htmlFor="numberOfChildren">Quantos filhos? *</Label>
              <div className="relative">
                <Baby className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="numberOfChildren"
                  type="number"
                  min="1"
                  placeholder="Número de filhos"
                  className="pl-10"
                  {...register("numberOfChildren")}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Work Unit Section */}
      <section className="form-section animate-fade-in" style={{ animationDelay: "0.35s" }}>
        <h2 className="form-section-title">
          <Building2 className="w-5 h-5 text-primary" />
          Unidade de Trabalho
        </h2>
        
        <div className="space-y-4">
          <div className="input-group">
            <Label>Em qual unidade você trabalha? *</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {workUnits.map((unit) => (
                <label
                  key={unit}
                  className="flex items-center gap-3 h-12 px-4 rounded-lg border-2 border-input bg-card cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <input
                    type="radio"
                    value={unit}
                    className="sr-only"
                    {...register("workUnit")}
                  />
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">{unit}</span>
                </label>
              ))}
            </div>
            {errors.workUnit && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.workUnit.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Submit Button - Fixed at bottom on mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border md:relative md:p-0 md:bg-transparent md:border-0 md:backdrop-blur-none">
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="animate-pulse-soft">Salvando...</span>
          ) : (
            "Salvar Informações"
          )}
        </Button>
      </div>
    </form>
  );
}
