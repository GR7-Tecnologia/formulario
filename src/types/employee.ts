export interface Employee {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  nationality: string;

  // For Brazilians
  birthPlace?: string;
  birthPlaceState?: string;

  // For Foreigners
  foreignCountry?: string;
  foreignState?: string;
  foreignCity?: string;

  street: string;
  neighborhood: string;
  zipCode: string;
  city: string;
  state: string;

  pixKey: string;
  pixType: string;
  bank: string;

  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;

  bloodType: string;
  maritalStatus: string;

  hasChildren: boolean;
  childrenCount?: number; // Updated from numberOfChildren

  workUnit: string;
  updatedAt: string;
}

export const mockEmployees: Employee[] = [
  {
    id: "1",
    fullName: "Maria Silva Santos",
    cpf: "123.456.789-00",
    birthDate: "1990-05-15",
    nationality: "Brasileira",
    birthPlace: "São Paulo",
    birthPlaceState: "SP",
    street: "Rua das Flores, 123",
    neighborhood: "Centro",
    zipCode: "01234-567",
    city: "São Paulo",
    state: "SP",
    pixKey: "maria@email.com",
    pixType: "email",
    bank: "Nubank",
    emergencyName: "João Silva",
    emergencyPhone: "(11) 99999-1111",
    emergencyRelation: "spouse",
    bloodType: "O+",
    maritalStatus: "married",
    hasChildren: true,
    childrenCount: 2,
    workUnit: "DaVinci Hotel",
    updatedAt: "2024-12-10"
  },
  {
    id: "2",
    fullName: "Carlos Eduardo Oliveira",
    cpf: "234.567.890-11",
    birthDate: "1985-08-22",
    nationality: "Brasileira",
    birthPlace: "Rio de Janeiro",
    birthPlaceState: "RJ",
    street: "Av. Brasil, 456",
    neighborhood: "Copacabana",
    zipCode: "22041-080",
    city: "Rio de Janeiro",
    state: "RJ",
    pixKey: "123.456.789-00",
    pixType: "cpf",
    bank: "Banco do Brasil",
    emergencyName: "Ana Oliveira",
    emergencyPhone: "(21) 98888-2222",
    emergencyRelation: "mother",
    bloodType: "A+",
    maritalStatus: "single",
    hasChildren: false,
    workUnit: "Eros Motel",
    updatedAt: "2024-12-09"
  },
  {
    id: "3",
    fullName: "Fernanda Costa Lima",
    cpf: "345.678.901-22",
    birthDate: "1992-03-10",
    nationality: "Brasileira",
    birthPlace: "Belo Horizonte",
    birthPlaceState: "MG",
    street: "Rua Minas Gerais, 789",
    neighborhood: "Savassi",
    zipCode: "30130-150",
    city: "Belo Horizonte",
    state: "MG",
    pixKey: "(31) 97777-3333",
    pixType: "phone",
    bank: "Itaú",
    emergencyName: "Roberto Lima",
    emergencyPhone: "(31) 96666-4444",
    emergencyRelation: "father",
    bloodType: "B-",
    maritalStatus: "divorced",
    hasChildren: true,
    childrenCount: 1,
    workUnit: "Aphrodite Park Motel",
    updatedAt: "2024-12-08"
  },
  {
    id: "4",
    fullName: "Ricardo Almeida Souza",
    cpf: "456.789.012-33",
    birthDate: "1988-11-30",
    nationality: "Brasileira",
    birthPlace: "Curitiba",
    birthPlaceState: "PR",
    street: "Rua XV de Novembro, 321",
    neighborhood: "Centro",
    zipCode: "80020-310",
    city: "Curitiba",
    state: "PR",
    pixKey: "ricardo.souza@pix.com",
    pixType: "email",
    bank: "Bradesco",
    emergencyName: "Mariana Souza",
    emergencyPhone: "(41) 95555-5555",
    emergencyRelation: "spouse",
    bloodType: "AB+",
    maritalStatus: "married",
    hasChildren: true,
    childrenCount: 3,
    workUnit: "Chateau Motel",
    updatedAt: "2024-12-07"
  },
  {
    id: "5",
    fullName: "Juliana Pereira Nunes",
    cpf: "567.890.123-44",
    birthDate: "1995-07-18",
    nationality: "Brasileira",
    birthPlace: "Porto Alegre",
    birthPlaceState: "RS",
    street: "Av. Ipiranga, 654",
    neighborhood: "Bom Fim",
    zipCode: "90160-093",
    city: "Porto Alegre",
    state: "RS",
    pixKey: "12345678901234567890123456789012",
    pixType: "random",
    bank: "Santander",
    emergencyName: "Paula Nunes",
    emergencyPhone: "(51) 94444-6666",
    emergencyRelation: "sibling",
    bloodType: "unknown",
    maritalStatus: "single",
    hasChildren: false,
    workUnit: "LPM Imóveis",
    updatedAt: "2024-12-06"
  },
  {
    id: "6",
    fullName: "André Rodrigues Martins",
    cpf: "678.901.234-55",
    birthDate: "1983-01-25",
    nationality: "Brasileira",
    birthPlace: "Salvador",
    birthPlaceState: "BA",
    street: "Rua da Bahia, 987",
    neighborhood: "Pelourinho",
    zipCode: "40026-280",
    city: "Salvador",
    state: "BA",
    pixKey: "andre.martins@email.com",
    pixType: "email",
    bank: "Caixa Econômica",
    emergencyName: "Lucia Martins",
    emergencyPhone: "(71) 93333-7777",
    emergencyRelation: "mother",
    bloodType: "O-",
    maritalStatus: "widowed",
    hasChildren: true,
    childrenCount: 1,
    workUnit: "DaVinci Hotel",
    updatedAt: "2024-12-05"
  }
];
