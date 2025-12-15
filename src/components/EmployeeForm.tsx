import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, MapPin, Wallet, Heart, Droplets, Baby, Users, CheckCircle2, AlertCircle, Building2, Globe } from "lucide-react";
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

const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[.\-]/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return false;
  }
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    return false;
  }
  return true;
};

const baseEmployeeSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().min(14, "CPF inválido").max(14, "CPF inválido")
    .refine(validateCPF, "CPF inválido")
    .refine(async (cpf) => {
      if (cpf.length !== 14) return true;
      try {
        const response = await fetch(`http://localhost:3001/api/employees/check-cpf/${cpf}`);
        const data = await response.json();
        return !data.exists;
      } catch (error) {
        console.error("Erro ao verificar CPF:", error);
        return false;
      }
    }, { message: "CPF já cadastrado." }),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  nationality: z.string().min(1, "Nacionalidade é obrigatória"),
  birthPlace: z.string().optional(),
  birthPlaceState: z.string().optional(),
  foreignCountry: z.string().optional(),
  foreignCity: z.string().optional(),
  foreignState: z.string().optional(),
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

const refinedEmployeeSchema = baseEmployeeSchema.superRefine((data, ctx) => {
  if (data.nationality === 'Brasileira') {
    if (!data.birthPlace || data.birthPlace.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['birthPlace'], message: 'Naturalidade é obrigatória' });
    }
    if (!data.birthPlaceState || data.birthPlaceState.length < 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['birthPlaceState'], message: 'UF da naturalidade é obrigatória' });
    }
  } else if (data.nationality === 'Estrangeira') {
    if (!data.foreignCountry || data.foreignCountry.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['foreignCountry'], message: 'País de nascimento é obrigatório' });
    }
    if (!data.foreignCity || data.foreignCity.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['foreignCity'], message: 'Cidade de nascimento é obrigatória' });
    }
    if (!data.foreignState || data.foreignState.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['foreignState'], message: 'Estado/Província é obrigatório' });
    }
  }
});

type EmployeeFormData = z.infer<typeof refinedEmployeeSchema>;

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Não sei informar"];
const maritalStatuses = [
  { value: "single", label: "Solteiro(a)" },
  { value: "married", label: "Casado(a)" },
  { value: "divorced", label: "Divorciado(a)" },
  { value: "widowed", label: "Viúvo(a)" },
  { value: "stable_union", label: "União Estável" },
];
const nationalities = [{ value: "Brasileira", label: "Brasileira" }, { value: "Estrangeira", label: "Estrangeira" }];
const pixTypes = [{ value: "cpf", label: "CPF" }, { value: "phone", label: "Telefone" }, { value: "email", label: "E-mail" }];
const relations = ["Cônjuge", "Pai", "Mãe", "Filho(a)", "Irmão(ã)", "Outro"];
const brazilianStates = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const workUnits = ["DaVinci Hotel", "Eros Motel", "Aphrodite Park Motel", "Chateau Motel", "LPM Imóveis"];

export function EmployeeForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
    trigger
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(refinedEmployeeSchema),
    mode: 'onBlur',
    defaultValues: {
      nationality: 'Brasileira',
    },
  });

  const watchNationality = watch("nationality");
  const watchHasChildren = watch("hasChildren");

  useEffect(() => {
    if (watchNationality === 'Brasileira') {
      setValue('foreignCountry', '');
      setValue('foreignCity', '');
      setValue('foreignState', '');
      clearErrors(['foreignCountry', 'foreignCity', 'foreignState']);
    } else if (watchNationality === 'Estrangeira') {
      setValue('birthPlace', '');
      setValue('birthPlaceState', '');
      clearErrors(['birthPlace', 'birthPlaceState']);
    }
  }, [watchNationality, setValue, clearErrors]);

  const onSubmit = async (data: EmployeeFormData) => {
    const employeeData = {
      fullName: data.fullName,
      cpf: data.cpf.replace(/[.\-]/g, ''),
      birthDate: data.birthDate,
      nationality: data.nationality,
      street: data.street,
      neighborhood: data.neighborhood,
      zipCode: data.zipCode,
      city: data.city,
      state: data.state,
      bank: data.bank,
      pixKey: data.pixKey,
      pixType: data.pixType,
      emergencyName: data.emergencyContactName,
      emergencyPhone: data.emergencyContactPhone,
      emergencyRelation: data.emergencyContactRelation,
      bloodType: data.bloodType,
      maritalStatus: data.maritalStatus,
      hasChildren: data.hasChildren === "sim",
      workUnit: data.workUnit,
      birthPlace: data.nationality === 'Brasileira' ? data.birthPlace : null,
      birthPlaceState: data.nationality === 'Brasileira' ? data.birthPlaceState : null,
      foreignCountry: data.nationality === 'Estrangeira' ? data.foreignCountry : null,
      foreignCity: data.nationality === 'Estrangeira' ? data.foreignCity : null,
      foreignState: data.nationality === 'Estrangeira' ? data.foreignState : null,
    };

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error?.code === 'ER_DUP_ENTRY') {
          throw new Error("CPF já cadastrado.");
        }
        const errorMessage = result.error?.sqlMessage || result.message || 'Ocorreu um erro no servidor.';
        throw new Error(errorMessage);
      }

      setIsSubmitted(true);
      toast({ title: "Dados atualizados!", description: `Os dados de ${data.fullName} foram salvos com sucesso.` });

      setTimeout(() => {
        setIsSubmitted(false);
        reset();
        setValue('nationality', 'Brasileira');
      }, 3000);

    } catch (error: any) {
      console.error("API Error Details:", error);
      toast({ title: "Erro ao salvar!", description: error.message, variant: "destructive" });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-success animate-check-bounce" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Dados Atualizados!</h2>
        <p className="text-muted-foreground text-center">As informações foram salvas com sucesso.</p>
      </div>
    );
  }

  const pError = (msg: string | undefined) => msg && (
    <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-4 h-4" />{msg}</p>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <section className="form-section animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h2 className="form-section-title"><User className="w-5 h-5 text-primary" />Dados Pessoais</h2>
        <div className="space-y-4">
          <div className="input-group"><Label htmlFor="fullName">Nome Completo *</Label><Input id="fullName" placeholder="Digite seu nome completo" {...register("fullName")} />{pError(errors.fullName?.message)}</div>
          <div className="input-group"><Label htmlFor="cpf">CPF *</Label><Input id="cpf" placeholder="000.000.000-00" {...register("cpf")} onBlur={() => trigger("cpf")} onChange={(e) => setValue("cpf", formatCPF(e.target.value))} maxLength={14} />{pError(errors.cpf?.message)}</div>
          <div className="input-group"><Label htmlFor="birthDate">Data de Nascimento *</Label><Input id="birthDate" type="date" {...register("birthDate")} />{pError(errors.birthDate?.message)}</div>
          <div className="input-group"><Label htmlFor="nationality">Nacionalidade *</Label><Select onValueChange={(value) => setValue("nationality", value)} value={watchNationality}><SelectTrigger className="h-12"><SelectValue /></SelectTrigger><SelectContent>{nationalities.map((nat) => <SelectItem key={nat.value} value={nat.value}>{nat.label}</SelectItem>)}</SelectContent></Select>{pError(errors.nationality?.message)}</div>
          {watchNationality === 'Brasileira' && (
            <div className="grid grid-cols-3 gap-3 animate-fade-in">
              <div className="input-group col-span-2"><Label htmlFor="birthPlace">Naturalidade (Cidade) *</Label><Input id="birthPlace" placeholder="Cidade de nascimento" {...register("birthPlace")} />{pError(errors.birthPlace?.message)}</div>
              <div className="input-group"><Label htmlFor="birthPlaceState">UF *</Label><Select onValueChange={(value) => setValue("birthPlaceState", value)}><SelectTrigger className="h-12"><SelectValue placeholder="UF" /></SelectTrigger><SelectContent>{brazilianStates.map((uf) => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}</SelectContent></Select>{pError(errors.birthPlaceState?.message)}</div>
            </div>
          )}
          {watchNationality === 'Estrangeira' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-md font-medium text-foreground flex items-center gap-2 pt-2"><Globe className="w-5 h-5 text-muted-foreground"/> Local de Nascimento no Exterior</h3>
              <div className="input-group"><Label htmlFor="foreignCountry">País de Nascimento *</Label><Input id="foreignCountry" placeholder="País" {...register("foreignCountry")} />{pError(errors.foreignCountry?.message)}</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="input-group"><Label htmlFor="foreignCity">Cidade *</Label><Input id="foreignCity" placeholder="Cidade" {...register("foreignCity")} />{pError(errors.foreignCity?.message)}</div>
                <div className="input-group"><Label htmlFor="foreignState">Estado / Província *</Label><Input id="foreignState" placeholder="Estado / Província" {...register("foreignState")} />{pError(errors.foreignState?.message)}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="form-section animate-fade-in" style={{ animationDelay: "0.12s" }}>
        <h2 className="form-section-title"><MapPin className="w-5 h-5 text-primary" />Endereço</h2>
        <div className="space-y-4">
          <div className="input-group"><Label htmlFor="street">Rua / Logradouro *</Label><Input id="street" placeholder="Rua, número, complemento" {...register("street")} />{pError(errors.street?.message)}</div>
          <div className="input-group"><Label htmlFor="neighborhood">Bairro *</Label><Input id="neighborhood" placeholder="Bairro" {...register("neighborhood")} />{pError(errors.neighborhood?.message)}</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="input-group"><Label htmlFor="zipCode">CEP *</Label><Input id="zipCode" placeholder="00000-000" {...register("zipCode")} />{pError(errors.zipCode?.message)}</div>
            <div className="input-group col-span-2"><Label htmlFor="city">Cidade *</Label><Input id="city" placeholder="Cidade" {...register("city")} />{pError(errors.city?.message)}</div>
          </div>
          <div className="input-group"><Label htmlFor="state">Estado *</Label><Select onValueChange={(value) => setValue("state", value)}><SelectTrigger className="h-12"><SelectValue placeholder="Selecione o estado" /></SelectTrigger><SelectContent>{brazilianStates.map((uf) => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}</SelectContent></Select>{pError(errors.state?.message)}</div>
        </div>
      </section>

      <section className="form-section animate-fade-in" style={{ animationDelay: "0.15s" }}>
        <h2 className="form-section-title"><Wallet className="w-5 h-5 text-primary" />Dados para Pagamento (PIX)</h2>
        <div className="space-y-4">
          <div className="input-group"><Label htmlFor="bank">Banco *</Label><Input id="bank" placeholder="Ex: Nubank, Itaú, Bradesco..." {...register("bank")} />{pError(errors.bank?.message)}</div>
          <div className="input-group"><Label htmlFor="pixType">Tipo de Chave PIX *</Label><Select onValueChange={(value) => setValue("pixType", value)}><SelectTrigger className="h-12"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger><SelectContent>{pixTypes.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}</SelectContent></Select>{pError(errors.pixType?.message)}</div>
          <div className="input-group"><Label htmlFor="pixKey">Chave PIX *</Label><Input id="pixKey" placeholder="Digite sua chave PIX" {...register("pixKey")} />{pError(errors.pixKey?.message)}</div>
        </div>
      </section>

      <section className="form-section animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <h2 className="form-section-title"><Phone className="w-5 h-5 text-primary" />Contato de Emergência</h2>
        <div className="space-y-4">
          <div className="input-group"><Label htmlFor="emergencyContactName">Nome do Contato *</Label><Input id="emergencyContactName" placeholder="Nome completo" {...register("emergencyContactName")} />{pError(errors.emergencyContactName?.message)}</div>
          <div className="input-group"><Label htmlFor="emergencyContactPhone">Telefone *</Label><Input id="emergencyContactPhone" type="tel" placeholder="(00) 00000-0000" {...register("emergencyContactPhone")} />{pError(errors.emergencyContactPhone?.message)}</div>
          <div className="input-group"><Label htmlFor="emergencyContactRelation">Parentesco *</Label><Select onValueChange={(value) => setValue("emergencyContactRelation", value)}><SelectTrigger className="h-12"><SelectValue placeholder="Selecione o parentesco" /></SelectTrigger><SelectContent>{relations.map((relation) => <SelectItem key={relation} value={relation}>{relation}</SelectItem>)}</SelectContent></Select>{pError(errors.emergencyContactRelation?.message)}</div>
        </div>
      </section>

      <section className="form-section animate-fade-in" style={{ animationDelay: "0.25s" }}>
        <h2 className="form-section-title"><Droplets className="w-5 h-5 text-primary" />Informações de Saúde</h2>
        <div className="space-y-4">
          <div className="input-group"><Label>Tipo Sanguíneo *</Label><div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">{bloodTypes.map((type) => <label key={type} className="flex items-center justify-center h-12 rounded-lg border-2 border-input bg-card cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-center px-2"><input type="radio" value={type} className="sr-only" {...register("bloodType")} /><span className="font-medium text-foreground text-sm">{type}</span></label>)}</div>{pError(errors.bloodType?.message)}</div>
        </div>
      </section>

      <section className="form-section animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="form-section-title"><Heart className="w-5 h-5 text-primary" />Informações Familiares</h2>
        <div className="space-y-4">
          <div className="input-group"><Label>Estado Civil *</Label><Select onValueChange={(value) => setValue("maritalStatus", value)}><SelectTrigger className="h-12"><Users className="w-5 h-5 text-muted-foreground mr-2" /><SelectValue placeholder="Selecione o estado civil" /></SelectTrigger><SelectContent>{maritalStatuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}</SelectContent></Select>{pError(errors.maritalStatus?.message)}</div>
          <div className="input-group"><Label>Possui filhos? *</Label><RadioGroup className="flex gap-4 mt-2" onValueChange={(value) => setValue("hasChildren", value)}>{pError(errors.hasChildren?.message)}<label className="flex items-center gap-3 flex-1 h-12 px-4 rounded-lg border-2 border-input bg-card cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"><RadioGroupItem value="sim" id="children-yes" /><span className="font-medium">Sim</span></label><label className="flex items-center gap-3 flex-1 h-12 px-4 rounded-lg border-2 border-input bg-card cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"><RadioGroupItem value="nao" id="children-no" /><span className="font-medium">Não</span></label></RadioGroup></div>
          {watchHasChildren === "sim" && (<div className="input-group animate-fade-in"><Label htmlFor="numberOfChildren">Quantos filhos? *</Label><div className="relative"><Baby className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input id="numberOfChildren" type="number" min="1" placeholder="Número de filhos" className="pl-10" {...register("numberOfChildren")} /></div></div>)}
        </div>
      </section>

      <section className="form-section animate-fade-in" style={{ animationDelay: "0.35s" }}>
        <h2 className="form-section-title"><Building2 className="w-5 h-5 text-primary" />Unidade de Trabalho</h2>
        <div className="space-y-4">
          <div className="input-group"><Label>Em qual unidade você trabalha? *</Label><div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">{workUnits.map((unit) => <label key={unit} className="flex items-center gap-3 h-12 px-4 rounded-lg border-2 border-input bg-card cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"><input type="radio" value={unit} className="sr-only" {...register("workUnit")} /><Building2 className="w-5 h-5 text-muted-foreground" /><span className="font-medium text-foreground">{unit}</span></label>)}</div>{pError(errors.workUnit?.message)}</div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border md:relative md:p-0 md:bg-transparent md:border-0 md:backdrop-blur-none">
        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? <span className="animate-pulse-soft">Salvando...</span> : "Salvar Informações"}</Button>
      </div>
    </form>
  );
}
