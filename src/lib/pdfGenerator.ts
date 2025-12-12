import { Employee } from "@/types/employee";

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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
};

export function generateEmployeePDF(employee: Employee) {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ficha do Funcionário - ${employee.fullName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; }
    .header h1 { color: #4f46e5; font-size: 24px; margin-bottom: 5px; }
    .header p { color: #666; font-size: 14px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 16px; color: #4f46e5; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .field { margin-bottom: 8px; }
    .field-label { font-size: 11px; color: #666; text-transform: uppercase; }
    .field-value { font-size: 14px; font-weight: 500; }
    .highlight { background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; }
    .highlight-value { font-size: 20px; font-weight: bold; color: #4f46e5; }
    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${employee.fullName}</h1>
    <p>Ficha Cadastral - Atualizado em ${formatDate(employee.updatedAt)}</p>
  </div>

  <div class="section">
    <div class="section-title">Dados Pessoais</div>
    <div class="grid">
      <div class="field">
        <div class="field-label">Data de Nascimento</div>
        <div class="field-value">${formatDate(employee.birthDate)}</div>
      </div>
      <div class="field">
        <div class="field-label">Nacionalidade</div>
        <div class="field-value">${employee.nationality}</div>
      </div>
      <div class="field">
        <div class="field-label">Naturalidade</div>
        <div class="field-value">${employee.birthPlace} - ${employee.birthPlaceState}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Endereço</div>
    <div class="field">
      <div class="field-label">Logradouro</div>
      <div class="field-value">${employee.street}</div>
    </div>
    <div class="grid">
      <div class="field">
        <div class="field-label">Bairro</div>
        <div class="field-value">${employee.neighborhood}</div>
      </div>
      <div class="field">
        <div class="field-label">CEP</div>
        <div class="field-value">${employee.zipCode}</div>
      </div>
      <div class="field">
        <div class="field-label">Cidade/UF</div>
        <div class="field-value">${employee.city}/${employee.state}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Dados de Pagamento</div>
    <div class="grid">
      <div class="field">
        <div class="field-label">Banco</div>
        <div class="field-value">${employee.bank}</div>
      </div>
      <div class="field">
        <div class="field-label">Tipo PIX</div>
        <div class="field-value">${pixTypeLabels[employee.pixType] || employee.pixType}</div>
      </div>
      <div class="field">
        <div class="field-label">Chave PIX</div>
        <div class="field-value">${employee.pixKey}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Contato de Emergência</div>
    <div class="grid">
      <div class="field">
        <div class="field-label">Nome</div>
        <div class="field-value">${employee.emergencyName}</div>
      </div>
      <div class="field">
        <div class="field-label">Telefone</div>
        <div class="field-value">${employee.emergencyPhone}</div>
      </div>
      <div class="field">
        <div class="field-label">Relação</div>
        <div class="field-value">${relationLabels[employee.emergencyRelation] || employee.emergencyRelation}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Saúde e Família</div>
    <div class="grid">
      <div class="field">
        <div class="field-label">Tipo Sanguíneo</div>
        <div class="field-value">${employee.bloodType === "unknown" ? "Não informado" : employee.bloodType}</div>
      </div>
      <div class="field">
        <div class="field-label">Estado Civil</div>
        <div class="field-value">${maritalStatusLabels[employee.maritalStatus]}</div>
      </div>
      <div class="field">
        <div class="field-label">Filhos</div>
        <div class="field-value">${employee.hasChildren ? `Sim (${employee.numberOfChildren})` : "Não"}</div>
      </div>
    </div>
  </div>

  <div class="highlight">
    <div class="field-label">Unidade de Trabalho</div>
    <div class="highlight-value">${employee.workUnit}</div>
  </div>

  <div class="footer">
    Documento gerado automaticamente pelo Sistema de Gestão de Funcionários
  </div>
</body>
</html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
}

export function generateAllEmployeesPDF(employees: Employee[]) {
  const rows = employees.map(emp => `
    <tr>
      <td>${emp.fullName}</td>
      <td>${emp.workUnit}</td>
      <td>${emp.city}/${emp.state}</td>
      <td>${emp.bloodType === "unknown" ? "N/I" : emp.bloodType}</td>
      <td>${maritalStatusLabels[emp.maritalStatus]}</td>
      <td>${emp.hasChildren ? emp.numberOfChildren : "-"}</td>
    </tr>
  `).join("");

  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Relatório de Funcionários</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #4f46e5; font-size: 22px; margin-bottom: 5px; }
    .header p { color: #666; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #4f46e5; color: white; padding: 10px 8px; text-align: left; }
    td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) { background: #f9fafb; }
    .summary { margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px; }
    .summary h3 { margin-bottom: 10px; color: #4f46e5; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
    .summary-item { text-align: center; }
    .summary-value { font-size: 24px; font-weight: bold; color: #4f46e5; }
    .summary-label { font-size: 12px; color: #666; }
    .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Relatório Geral de Funcionários</h1>
    <p>Gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Unidade</th>
        <th>Cidade/UF</th>
        <th>Tipo Sang.</th>
        <th>Estado Civil</th>
        <th>Filhos</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="summary">
    <h3>Resumo</h3>
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-value">${employees.length}</div>
        <div class="summary-label">Total de Funcionários</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${[...new Set(employees.map(e => e.workUnit))].length}</div>
        <div class="summary-label">Unidades</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${employees.filter(e => e.hasChildren).length}</div>
        <div class="summary-label">Com Filhos</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${employees.reduce((acc, e) => acc + (e.numberOfChildren || 0), 0)}</div>
        <div class="summary-label">Total de Filhos</div>
      </div>
    </div>
  </div>

  <div class="footer">
    Documento gerado automaticamente pelo Sistema de Gestão de Funcionários
  </div>
</body>
</html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
}
