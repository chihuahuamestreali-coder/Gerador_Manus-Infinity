/**
 * Personal Data Generator - Gera dados pessoais realistas e completos para evitar detecção de fraude
 * Inclui: nome, email, endereço, telefone, data de nascimento, senha, CPF, dados de checkout
 */

export interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PersonalData {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  password: string;
  address: Address;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  timezone: string;
  language: string;
  locale: string;
}

// Nomes brasileiros comuns
const FIRST_NAMES = [
  'João', 'Maria', 'José', 'Ana', 'Carlos', 'Pedro', 'Francisco', 'Marcos',
  'Paulo', 'Lucas', 'Felipe', 'Rafael', 'Bruno', 'Diego', 'André', 'Thiago',
  'Gustavo', 'Ricardo', 'Roberto', 'Sergio', 'Fabio', 'Julio', 'Eduardo',
  'Patricia', 'Fernanda', 'Juliana', 'Camila', 'Beatriz', 'Mariana', 'Gabriela',
  'Alessandra', 'Cristina', 'Daniela', 'Vanessa', 'Priscila', 'Leticia'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Rodrigues',
  'Martins', 'Alves', 'Gomes', 'Ribeiro', 'Pereira', 'Carvalho', 'Rocha',
  'Dias', 'Barbosa', 'Monteiro', 'Neves', 'Cavalcanti', 'Teixeira', 'Mendes',
  'Lopes', 'Machado', 'Vieira', 'Tavares', 'Pinto', 'Moura', 'Fonseca'
];

// Domínios de email populares
const EMAIL_DOMAINS = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'uol.com.br',
  'terra.com.br', 'bol.com.br', 'ig.com.br', 'live.com', 'mail.com'
];

// Estados brasileiros com cidades e timezones
const BRAZILIAN_STATES = [
  { state: 'SP', city: 'São Paulo', timezone: 'America/Sao_Paulo' },
  { state: 'RJ', city: 'Rio de Janeiro', timezone: 'America/Sao_Paulo' },
  { state: 'MG', city: 'Belo Horizonte', timezone: 'America/Sao_Paulo' },
  { state: 'BA', city: 'Salvador', timezone: 'America/Bahia' },
  { state: 'RS', city: 'Porto Alegre', timezone: 'America/Sao_Paulo' },
  { state: 'PR', city: 'Curitiba', timezone: 'America/Sao_Paulo' },
  { state: 'PE', city: 'Recife', timezone: 'America/Recife' },
  { state: 'CE', city: 'Fortaleza', timezone: 'America/Fortaleza' },
  { state: 'PA', city: 'Belém', timezone: 'America/Belem' },
  { state: 'GO', city: 'Goiânia', timezone: 'America/Sao_Paulo' },
  { state: 'SC', city: 'Florianópolis', timezone: 'America/Sao_Paulo' },
  { state: 'DF', city: 'Brasília', timezone: 'America/Sao_Paulo' },
];

// Nomes de ruas comuns
const STREET_TYPES = [
  'Rua', 'Avenida', 'Travessa', 'Alameda', 'Praça', 'Largo', 'Estrada', 'Rodovia'
];

const STREET_NAMES = [
  'Principal', 'Central', 'das Flores', 'do Comércio', 'Industrial',
  'Paulista', 'Brasil', 'América', 'Europa', 'das Nações', 'da Paz',
  'da Liberdade', 'da República', 'da Independência', 'da Constituição'
];

const NEIGHBORHOODS = [
  'Centro', 'Vila Nova', 'Jardim', 'Vila Mariana', 'Pinheiros', 'Vila Madalena',
  'Consolação', 'Bela Vista', 'Liberdade', 'Tatuapé', 'Mooca', 'Brás',
  'Penha', 'Itaquera', 'Guaianazes', 'Sapopemba', 'Parque da Esperança'
];

/**
 * Gera um nome completo realista
 */
export function generateName(): { firstName: string; lastName: string; fullName: string } {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`
  };
}

/**
 * Gera um email realista baseado no nome
 */
export function generateEmail(firstName: string, lastName: string): string {
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${Math.floor(Math.random() * 9999)}`,
    `${lastName.toLowerCase()}${Math.floor(Math.random() * 9999)}`,
  ];
  
  const format = formats[Math.floor(Math.random() * formats.length)];
  const domain = EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];
  
  return `${format}@${domain}`;
}

/**
 * Gera um telefone brasileiro realista
 */
export function generatePhone(): string {
  const areaCode = String(Math.floor(Math.random() * 90) + 11).padStart(2, '0');
  const firstPart = String(Math.floor(Math.random() * 90000) + 10000);
  const secondPart = String(Math.floor(Math.random() * 9000) + 1000);
  
  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

/**
 * Gera uma data de nascimento realista (18-65 anos)
 */
export function generateBirthDate(): string {
  const today = new Date();
  const minAge = 18;
  const maxAge = 65;
  
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  const birthYear = today.getFullYear() - age;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  
  return `${day}/${month}/${birthYear}`;
}

/**
 * Gera um CEP brasileiro realista
 */
export function generateZipCode(): string {
  const part1 = String(Math.floor(Math.random() * 90000) + 10000);
  const part2 = String(Math.floor(Math.random() * 900) + 100);
  
  return `${part1}-${part2}`;
}

/**
 * Gera um CPF válido com dígitos verificadores corretos
 */
export function generateValidCPF(): string {
  // Gera 9 dígitos aleatórios
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  
  // Calcula primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let firstVerifier = 11 - (sum % 11);
  firstVerifier = firstVerifier >= 10 ? 0 : firstVerifier;
  
  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (11 - i);
  }
  sum += firstVerifier * 2;
  let secondVerifier = 11 - (sum % 11);
  secondVerifier = secondVerifier >= 10 ? 0 : secondVerifier;
  
  // Formata CPF
  const cpf = [
    ...digits,
    firstVerifier,
    secondVerifier
  ].join('');
  
  return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`;
}

/**
 * Gera uma senha forte com maiúsculas, minúsculas, números e símbolos
 */
export function generateStrongPassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  // Garante pelo menos um de cada tipo
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Completa até 16 caracteres
  for (let i = password.length; i < 16; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Embaralha
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Gera um endereço completo e estruturado
 */
export function generateAddress(): Address {
  const street = STREET_TYPES[Math.floor(Math.random() * STREET_TYPES.length)];
  const streetName = STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];
  const number = String(Math.floor(Math.random() * 9999) + 1);
  const neighborhood = NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)];
  
  // Complemento opcional (apto, sala, etc)
  const complements = ['', '', '', `Apto ${Math.floor(Math.random() * 999) + 1}`, `Sala ${Math.floor(Math.random() * 99) + 1}`, `Bloco ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`];
  const complement = complements[Math.floor(Math.random() * complements.length)];
  
  return {
    street: `${street} ${streetName}`,
    number,
    complement,
    neighborhood,
    city: '',  // Será preenchido pela função que chama
    state: '',  // Será preenchido pela função que chama
    zipCode: generateZipCode(),
    country: 'Brasil'
  };
}

/**
 * Gera dados pessoais completos e realistas
 */
export function generatePersonalData(): PersonalData {
  const { firstName, lastName, fullName } = generateName();
  const stateData = BRAZILIAN_STATES[Math.floor(Math.random() * BRAZILIAN_STATES.length)];
  const address = generateAddress();
  
  // Preenche endereço com dados de estado
  address.city = stateData.city;
  address.state = stateData.state;
  
  return {
    firstName,
    lastName,
    fullName,
    email: generateEmail(firstName, lastName),
    phone: generatePhone(),
    birthDate: generateBirthDate(),
    cpf: generateValidCPF(),
    password: generateStrongPassword(),
    address,
    city: stateData.city,
    state: stateData.state,
    zipCode: address.zipCode,
    country: 'Brasil',
    timezone: stateData.timezone,
    language: 'pt-BR',
    locale: 'pt_BR',
  };
}

/**
 * Gera dados pessoais com localização específica
 */
export function generatePersonalDataForLocation(timezone?: string): PersonalData {
  const data = generatePersonalData();
  
  if (timezone) {
    data.timezone = timezone;
  }
  
  return data;
}

/**
 * Formata dados pessoais para exibição
 */
export function formatPersonalDataForDisplay(data: PersonalData): string {
  return `
Nome: ${data.fullName}
Email: ${data.email}
Telefone: ${data.phone}
Data de Nascimento: ${data.birthDate}
CPF: ${data.cpf}
Senha: ${data.password}

Endereço:
${data.address.street}, ${data.address.number}
${data.address.complement ? data.address.complement + ' - ' : ''}${data.address.neighborhood}
${data.address.zipCode} - ${data.address.city}, ${data.address.state}
${data.address.country}
  `.trim();
}
