/**
 * Facebook Email Manager - Gerenciador de Emails para Facebook
 * Suporta: Gmail, Outlook, Hotmail, Yahoo
 */

export interface FacebookEmailProvider {
  id: string;
  name: string;
  domains: string[];
  baseUrl: string;
  color: string;
}

// Provedores de Email para Facebook
export const FACEBOOK_EMAIL_PROVIDERS: FacebookEmailProvider[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    domains: ['gmail.com', 'googlemail.com'],
    baseUrl: 'https://accounts.google.com/signup',
    color: 'from-red-500 to-red-700',
  },
  {
    id: 'outlook',
    name: 'Outlook',
    domains: ['outlook.com', 'outlook.pt', 'outlook.fr', 'outlook.it', 'outlook.es'],
    baseUrl: 'https://signup.live.com/signup.aspx',
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: 'hotmail',
    name: 'Hotmail',
    domains: ['hotmail.com'],
    baseUrl: 'https://signup.live.com/signup.aspx',
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'yahoo',
    name: 'Yahoo',
    domains: ['yahoo.com', 'yahoo.pt', 'yahoo.fr', 'yahoo.it', 'yahoo.es'],
    baseUrl: 'https://login.yahoo.com/account/create',
    color: 'from-purple-600 to-purple-800',
  },
];

export interface FacebookEmailAccount {
  id: string;
  email: string;
  provider: string;
  domain: string;
  createdAt: Date;
  password?: string;
  notes?: string;
}

// Nomes brasileiros comuns (masculino e feminino)
const BRAZILIAN_FIRST_NAMES = [
  'João', 'Maria', 'José', 'Ana', 'Carlos', 'Francisca', 'Paulo', 'Antônia',
  'Pedro', 'Mariana', 'Lucas', 'Juliana', 'Marcos', 'Fernanda', 'Felipe',
  'Camila', 'Rafael', 'Beatriz', 'Bruno', 'Isabella', 'Diego', 'Gabriela',
  'Fernando', 'Amanda', 'Gustavo', 'Leticia', 'André', 'Larissa', 'Thiago',
  'Vanessa', 'Ricardo', 'Natalia', 'Rodrigo', 'Bruna', 'Matheus', 'Carolina',
  'Fabio', 'Aline', 'Sergio', 'Debora', 'Julio', 'Simone', 'Cesar', 'Elaine',
  'Claudio', 'Viviane', 'Marcelo', 'Roberta', 'Leandro', 'Cristina', 'Renato',
  'Priscila', 'Gilberto', 'Adriana', 'Mauricio', 'Silvia', 'Flavio', 'Rosana',
];

// Sobrenomes brasileiros comuns
const BRAZILIAN_LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Rodrigues',
  'Martins', 'Alves', 'Gomes', 'Pereira', 'Carvalho', 'Ribeiro', 'Teixeira',
  'Rocha', 'Barbosa', 'Dias', 'Monteiro', 'Cardoso', 'Mendes', 'Tavares',
  'Neves', 'Machado', 'Pinto', 'Mota', 'Brito', 'Correia', 'Campos',
  'Lopes', 'Moura', 'Vieira', 'Freitas', 'Cavalcanti', 'Medeiros', 'Leite',
  'Borges', 'Menezes', 'Guedes', 'Fonseca', 'Nogueira', 'Ramos', 'Batista',
  'Lourenço', 'Marques', 'Cabral', 'Rezende', 'Siqueira', 'Vasconcelos',
  'Figueiredo', 'Brás', 'Duarte', 'Galvão', 'Humberto', 'Ivo', 'Jansen',
];

/**
 * Remove acentos de uma string
 */
function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Gera um email com nome brasileiro realista (nome.sobrenome)
 */
export function generateRandomFacebookEmail(): string {
  const firstName = BRAZILIAN_FIRST_NAMES[Math.floor(Math.random() * BRAZILIAN_FIRST_NAMES.length)];
  const lastName = BRAZILIAN_LAST_NAMES[Math.floor(Math.random() * BRAZILIAN_LAST_NAMES.length)];
  
  const cleanFirstName = removeAccents(firstName).toLowerCase();
  const cleanLastName = removeAccents(lastName).toLowerCase();
  
  return `${cleanFirstName}.${cleanLastName}`;
}

/**
 * Gera um email com data de nascimento/aniversário (DDMMYYYY)
 */
export function generateFacebookEmailWithBirthday(): string {
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const year = String(Math.floor(Math.random() * (2005 - 1960 + 1)) + 1960);
  
  return `${day}${month}${year}`;
}

/**
 * Gera um email com nome + data de nascimento
 */
export function generateFacebookEmailWithNameAndBirthday(): string {
  const firstName = BRAZILIAN_FIRST_NAMES[Math.floor(Math.random() * BRAZILIAN_FIRST_NAMES.length)];
  const cleanFirstName = removeAccents(firstName).toLowerCase();
  const birthday = generateFacebookEmailWithBirthday();
  
  return `${cleanFirstName}${birthday}`;
}

/**
 * Gera URL de signup baseado no provedor
 */
export function generateFacebookSignupUrl(provider: FacebookEmailProvider): string {
  return provider.baseUrl;
}
