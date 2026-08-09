/**
 * Account History Manager - Rastreia contas bem-sucedidas e configurações que funcionam
 */

export interface AccountRecord {
  id: string;
  email: string;
  createdAt: Date;
  status: 'pending' | 'created' | 'verified' | 'fraud_detected' | 'success';
  referralLink?: string;
  deviceFingerprint: string;
  userAgent: string;
  personalData: {
    name: string;
    phone: string;
    birthDate: string;
    city: string;
    state: string;
  };
  behaviorConfig: {
    minDelay: number;
    maxDelay: number;
    typingSpeed: number;
  };
  notes?: string;
  successRate?: number;
}

export interface SuccessfulConfiguration {
  id: string;
  description: string;
  deviceFingerprint: string;
  userAgent: string;
  behaviorConfig: {
    minDelay: number;
    maxDelay: number;
    typingSpeed: number;
  };
  successCount: number;
  failureCount: number;
  successRate: number;
  lastUsed: Date;
}

const STORAGE_KEY = 'manus_account_history';
const CONFIG_KEY = 'manus_successful_configs';

/**
 * Salva histórico de conta no localStorage
 */
export function saveAccountRecord(record: AccountRecord): void {
  try {
    const history = getAccountHistory();
    history.push({
      ...record,
      createdAt: new Date(record.createdAt),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Erro ao salvar histórico de conta:', error);
  }
}

/**
 * Recupera histórico de contas
 */
export function getAccountHistory(): AccountRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const history = JSON.parse(data);
    return history.map((record: any) => ({
      ...record,
      createdAt: new Date(record.createdAt),
    }));
  } catch (error) {
    console.error('Erro ao recuperar histórico:', error);
    return [];
  }
}

/**
 * Atualiza status de uma conta
 */
export function updateAccountStatus(
  accountId: string,
  status: AccountRecord['status'],
  notes?: string
): void {
  try {
    const history = getAccountHistory();
    const account = history.find(a => a.id === accountId);
    
    if (account) {
      account.status = status;
      if (notes) account.notes = notes;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
  }
}

/**
 * Calcula taxa de sucesso geral
 */
export function calculateOverallSuccessRate(): number {
  const history = getAccountHistory();
  if (history.length === 0) return 0;
  
  const successful = history.filter(a => a.status === 'success').length;
  return (successful / history.length) * 100;
}

/**
 * Calcula taxa de sucesso por configuração
 */
export function calculateConfigSuccessRate(fingerprint: string): number {
  const history = getAccountHistory();
  const configAccounts = history.filter(a => a.deviceFingerprint === fingerprint);
  
  if (configAccounts.length === 0) return 0;
  
  const successful = configAccounts.filter(a => a.status === 'success').length;
  return (successful / configAccounts.length) * 100;
}

/**
 * Salva configuração bem-sucedida
 */
export function saveSuccessfulConfiguration(config: SuccessfulConfiguration): void {
  try {
    const configs = getSuccessfulConfigurations();
    const existing = configs.find(c => c.id === config.id);
    
    if (existing) {
      existing.successCount += config.successCount;
      existing.failureCount += config.failureCount;
      existing.successRate = (existing.successCount / (existing.successCount + existing.failureCount)) * 100;
      existing.lastUsed = new Date();
    } else {
      configs.push(config);
    }
    
    localStorage.setItem(CONFIG_KEY, JSON.stringify(configs));
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
  }
}

/**
 * Recupera configurações bem-sucedidas
 */
export function getSuccessfulConfigurations(): SuccessfulConfiguration[] {
  try {
    const data = localStorage.getItem(CONFIG_KEY);
    if (!data) return [];
    
    const configs = JSON.parse(data);
    return configs.map((config: any) => ({
      ...config,
      lastUsed: new Date(config.lastUsed),
    }));
  } catch (error) {
    console.error('Erro ao recuperar configurações:', error);
    return [];
  }
}

/**
 * Retorna a configuração com maior taxa de sucesso
 */
export function getBestConfiguration(): SuccessfulConfiguration | null {
  const configs = getSuccessfulConfigurations();
  if (configs.length === 0) return null;
  
  return configs.reduce((best, current) =>
    current.successRate > best.successRate ? current : best
  );
}

/**
 * Retorna configurações ordenadas por taxa de sucesso
 */
export function getConfigurationsBySuccessRate(): SuccessfulConfiguration[] {
  const configs = getSuccessfulConfigurations();
  return configs.sort((a, b) => b.successRate - a.successRate);
}

/**
 * Gera relatório de desempenho
 */
export interface PerformanceReport {
  totalAccounts: number;
  successfulAccounts: number;
  failedAccounts: number;
  pendingAccounts: number;
  fraudDetected: number;
  overallSuccessRate: number;
  bestConfiguration: SuccessfulConfiguration | null;
  recentAccounts: AccountRecord[];
  topConfigurations: SuccessfulConfiguration[];
}

export function generatePerformanceReport(): PerformanceReport {
  const history = getAccountHistory();
  const configs = getSuccessfulConfigurations();
  
  const totalAccounts = history.length;
  const successfulAccounts = history.filter(a => a.status === 'success').length;
  const failedAccounts = history.filter(a => a.status === 'fraud_detected').length;
  const pendingAccounts = history.filter(a => a.status === 'pending').length;
  const fraudDetected = history.filter(a => a.status === 'fraud_detected').length;
  
  return {
    totalAccounts,
    successfulAccounts,
    failedAccounts,
    pendingAccounts,
    fraudDetected,
    overallSuccessRate: totalAccounts > 0 ? (successfulAccounts / totalAccounts) * 100 : 0,
    bestConfiguration: getBestConfiguration(),
    recentAccounts: history.slice(-5).reverse(),
    topConfigurations: getConfigurationsBySuccessRate().slice(0, 3),
  };
}

/**
 * Limpa histórico antigo (mais de 30 dias)
 */
export function cleanOldHistory(): void {
  try {
    const history = getAccountHistory();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const filtered = history.filter(a => new Date(a.createdAt) > thirtyDaysAgo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
  }
}

/**
 * Exporta histórico como JSON
 */
export function exportHistoryAsJSON(): string {
  const history = getAccountHistory();
  return JSON.stringify(history, null, 2);
}

/**
 * Importa histórico de JSON
 */
export function importHistoryFromJSON(jsonData: string): boolean {
  try {
    const history = JSON.parse(jsonData);
    if (!Array.isArray(history)) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Erro ao importar histórico:', error);
    return false;
  }
}
