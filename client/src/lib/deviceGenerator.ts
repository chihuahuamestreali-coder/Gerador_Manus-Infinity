/**
 * Device Generator - Gera fingerprints e identidades de dispositivos únicos
 * Design: Cyberpunk Industrial
 */

export interface DeviceProfile {
  id: string;
  createdAt: Date;
  deviceName: string;
  model: string;
  manufacturer: string;
  resolution: string;
  userAgent: string;
  macAddress: string;
  imei: string;
  androidId: string;
  cpuCores: number;
  ramMb: number;
  screenDensity: string;
  buildVersion: string;
  securityPatch: string;
  fingerprint: string;
  accounts: AccountRecord[];
}

export interface AccountRecord {
  id: string;
  email: string;
  createdAt: Date;
  status: 'pending' | 'created' | 'verified';
  notes?: string;
}

// Dados reais de dispositivos Android populares
const REAL_DEVICES = [
  { model: 'SM-G991B', manufacturer: 'Samsung', name: 'Galaxy S21' },
  { model: 'SM-A515F', manufacturer: 'Samsung', name: 'Galaxy A51' },
  { model: 'SM-A125F', manufacturer: 'Samsung', name: 'Galaxy A12' },
  { model: 'M2101K6G', manufacturer: 'Xiaomi', name: 'Mi 11' },
  { model: 'M2006C3LG', manufacturer: 'Xiaomi', name: 'Mi 10' },
  { model: 'M2007J1SC', manufacturer: 'Xiaomi', name: 'Mi 10T' },
  { model: 'RMX2185', manufacturer: 'Realme', name: 'Realme 7' },
  { model: 'RMX2040', manufacturer: 'Realme', name: 'Realme 6' },
  { model: 'ONEPLUS A6013', manufacturer: 'OnePlus', name: 'OnePlus 6T' },
  { model: 'ONEPLUS A6003', manufacturer: 'OnePlus', name: 'OnePlus 6' },
  { model: 'LYA-L29', manufacturer: 'Huawei', name: 'P30 Pro' },
  { model: 'ELE-L29', manufacturer: 'Huawei', name: 'P40 Pro' },
  { model: 'M1903F10G', manufacturer: 'Xiaomi', name: 'Mi 9T' },
  { model: 'PAFM00', manufacturer: 'OPPO', name: 'Find X2 Pro' },
  { model: 'CPH2005', manufacturer: 'OPPO', name: 'Reno 4' },
];

const ANDROID_VERSIONS = [
  { version: '11', sdk: 30, buildId: 'RP1A.200720.011' },
  { version: '12', sdk: 31, buildId: 'SP1A.210812.016' },
  { version: '13', sdk: 33, buildId: 'TP1A.220624.014' },
  { version: '14', sdk: 34, buildId: 'UP1A.231005.007' },
];

const SCREEN_RESOLUTIONS = [
  { width: 1080, height: 2340, density: '420dpi' },
  { width: 1080, height: 2400, density: '420dpi' },
  { width: 1440, height: 3120, density: '560dpi' },
  { width: 720, height: 1520, density: '270dpi' },
  { width: 1080, height: 2160, density: '401dpi' },
  { width: 1440, height: 2960, density: '560dpi' },
  { width: 1080, height: 2280, density: '420dpi' },
  { width: 720, height: 1440, density: '270dpi' },
];

const CPU_MODELS = [
  'Snapdragon 888',
  'Snapdragon 870',
  'Snapdragon 865',
  'Snapdragon 855',
  'Exynos 2100',
  'Exynos 1080',
  'MediaTek Dimensity 1200',
  'MediaTek Dimensity 1000+',
  'Kirin 9000',
  'Kirin 9000E',
];

const RAM_OPTIONS = [3, 4, 6, 8, 12, 16];

/**
 * Gera um endereço MAC fictício único
 */
function generateMacAddress(): string {
  const chars = '0123456789ABCDEF';
  let mac = '';
  for (let i = 0; i < 6; i++) {
    mac += chars.charAt(Math.floor(Math.random() * 16));
    mac += chars.charAt(Math.floor(Math.random() * 16));
    if (i < 5) mac += ':';
  }
  return mac;
}

/**
 * Gera um IMEI fictício válido (formato básico)
 */
function generateIMEI(): string {
  let imei = '';
  for (let i = 0; i < 15; i++) {
    imei += Math.floor(Math.random() * 10);
  }
  return imei;
}

/**
 * Gera um Android ID fictício
 */
function generateAndroidId(): string {
  const chars = '0123456789abcdef';
  let id = '';
  for (let i = 0; i < 16; i++) {
    id += chars.charAt(Math.floor(Math.random() * 16));
  }
  return id;
}

/**
 * Gera um User-Agent realista para Android
 */
function generateUserAgent(device: typeof REAL_DEVICES[0], android: typeof ANDROID_VERSIONS[0]): string {
  const webkitVersion = `537.${Math.floor(Math.random() * 36) + 1}`;
  const chromeVersion = `${100 + Math.floor(Math.random() * 20)}.0.${Math.floor(Math.random() * 5000)}.${Math.floor(Math.random() * 100)}`;
  
  return `Mozilla/5.0 (Linux; Android ${android.version}; ${device.model}) AppleWebKit/${webkitVersion} (KHTML, like Gecko) Chrome/${chromeVersion} Mobile Safari/${webkitVersion}`;
}

/**
 * Gera um fingerprint único baseado em múltiplos fatores
 */
function generateFingerprint(profile: Partial<DeviceProfile>): string {
  const components = [
    profile.model,
    profile.macAddress,
    profile.imei,
    profile.androidId,
    profile.resolution,
    profile.cpuCores,
    profile.ramMb,
  ].join('|');
  
  // Simula um hash SHA-256 (simplificado)
  let hash = 0;
  for (let i = 0; i < components.length; i++) {
    const char = components.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Gera um perfil de dispositivo completo e único
 */
export function generateDeviceProfile(): DeviceProfile {
  const device = REAL_DEVICES[Math.floor(Math.random() * REAL_DEVICES.length)];
  const android = ANDROID_VERSIONS[Math.floor(Math.random() * ANDROID_VERSIONS.length)];
  const resolution = SCREEN_RESOLUTIONS[Math.floor(Math.random() * SCREEN_RESOLUTIONS.length)];
  const cpuCores = Math.floor(Math.random() * 4) + 4; // 4-8 cores
  const ramMb = RAM_OPTIONS[Math.floor(Math.random() * RAM_OPTIONS.length)];
  
  const macAddress = generateMacAddress();
  const imei = generateIMEI();
  const androidId = generateAndroidId();
  const userAgent = generateUserAgent(device, android);
  
  const profile: DeviceProfile = {
    id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    deviceName: `${device.name} #${Math.floor(Math.random() * 9999)}`,
    model: device.model,
    manufacturer: device.manufacturer,
    resolution: `${resolution.width}x${resolution.height}`,
    userAgent,
    macAddress,
    imei,
    androidId,
    cpuCores,
    ramMb,
    screenDensity: resolution.density,
    buildVersion: `${android.version} (SDK ${android.sdk})`,
    securityPatch: `${new Date().getFullYear()}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
    fingerprint: '', // Será preenchido abaixo
    accounts: [],
  };
  
  profile.fingerprint = generateFingerprint(profile);
  
  return profile;
}

/**
 * Cria um bookmarklet para injetar dados no AliExpress
 */
export function generateBookmarklet(profile: DeviceProfile): string {
  const profileJson = JSON.stringify({
    macAddress: profile.macAddress,
    imei: profile.imei,
    androidId: profile.androidId,
    model: profile.model,
    manufacturer: profile.manufacturer,
    resolution: profile.resolution,
    fingerprint: profile.fingerprint,
    userAgent: profile.userAgent,
  }).replace(/"/g, '\\"');

  const code = `
    (function() {
      try {
        const profile = JSON.parse("${profileJson}");
        
        // Detecta se está no AliExpress
        const isAliExpress = window.location.hostname.includes('aliexpress');
        
        // Injeta dados no localStorage
        localStorage.setItem('device_profile', JSON.stringify(profile));
        localStorage.setItem('_device_fingerprint', profile.fingerprint);
        localStorage.setItem('_device_model', profile.model);
        localStorage.setItem('_device_mac', profile.macAddress);
        localStorage.setItem('_device_imei', profile.imei);
        
        // Injeta no sessionStorage
        sessionStorage.setItem('device_fingerprint', profile.fingerprint);
        sessionStorage.setItem('device_profile', JSON.stringify(profile));
        
        // Modifica o User-Agent
        try {
          Object.defineProperty(navigator, 'userAgent', {
            get: function() { return "${profile.userAgent}"; },
            configurable: true
          });
        } catch(e) {}
        
        // Injeta dados de resolução
        try {
          Object.defineProperty(window, 'devicePixelRatio', {
            get: function() { return 2.0; },
            configurable: true
          });
        } catch(e) {}
        
        // Injeta dados de tela
        try {
          const [width, height] = "${profile.resolution}".split('x').map(Number);
          Object.defineProperty(screen, 'width', {
            get: function() { return width; },
            configurable: true
          });
          Object.defineProperty(screen, 'height', {
            get: function() { return height; },
            configurable: true
          });
        } catch(e) {}
        
        console.log('%c✓ Device Profile Injetado com Sucesso', 'color: #00D9FF; font-weight: bold; font-size: 14px;');
        console.log('%cMAC: ${profile.macAddress}', 'color: #39FF14; font-family: monospace;');
        console.log('%cIMEI: ${profile.imei}', 'color: #39FF14; font-family: monospace;');
        console.log('%cFingerprint: ${profile.fingerprint}', 'color: #39FF14; font-family: monospace;');
        console.log('%cResolução: ${profile.resolution}', 'color: #39FF14; font-family: monospace;');
        console.log('%cUser-Agent: ${profile.userAgent}', 'color: #39FF14; font-family: monospace;');
        
        if (isAliExpress) {
          alert('✓ Device Profile Injetado!\\n\\nSeu dispositivo foi mascarado com sucesso.\\nAgora crie sua conta normalmente.');
        } else {
          alert('⚠️ Aviso: Você não está no AliExpress!\\n\\nOs dados foram injetados, mas você deveria estar em:\\nhttps://www.aliexpress.com');
        }
      } catch(err) {
        console.error('Erro ao injetar profile:', err);
        alert('❌ Erro ao injetar o profile. Verifique o console (F12)');
      }
    })();
  `;

  // Comprime o código
  return `javascript:${code.replace(/\s+/g, ' ').trim()}`;
}

/**
 * Adiciona uma conta ao perfil do dispositivo
 */
export function addAccountToProfile(profile: DeviceProfile, email: string, notes?: string): AccountRecord {
  const account: AccountRecord = {
    id: `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    createdAt: new Date(),
    status: 'pending',
    notes,
  };
  
  profile.accounts.push(account);
  return account;
}

/**
 * Exporta perfil como JSON para backup
 */
export function exportProfileAsJson(profile: DeviceProfile): string {
  return JSON.stringify(profile, null, 2);
}

/**
 * Importa perfil de JSON
 */
export function importProfileFromJson(json: string): DeviceProfile {
  const data = JSON.parse(json);
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    accounts: data.accounts.map((acc: any) => ({
      ...acc,
      createdAt: new Date(acc.createdAt),
    })),
  };
}
