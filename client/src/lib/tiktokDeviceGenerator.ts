/**
 * TikTok Device Generator - Gerador de dispositivos para TikTok
 * 
 * CORREÇÃO v2.1: generateTikTokAppBehaviorScript agora usa try/catch
 * para o webdriver override, evitando o erro "Cannot redefine property: webdriver"
 */

export interface TikTokDeviceProfile {
  id: string;
  deviceName: string;
  model: string;
  manufacturer: string;
  imei: string;
  androidId: string;
  mac: string;
  fingerprint: string;
  userAgent: string;
  resolution: string;
  ramMb: number;
  cpuCores: number;
  osVersion: string;
  osName: string;
  accounts: any[];
  createdAt: Date;
}

const TIKTOK_DEVICES: TikTokDeviceProfile[] = [];

/**
 * Gera um IMEI aleatório válido
 */
function generateIMEI(): string {
  const prefix = [86, 35, 44, 52, 98, 60];
  const p = prefix[Math.floor(Math.random() * prefix.length)];
  let imei = p.toString();
  while (imei.length < 14) {
    imei += Math.floor(Math.random() * 10);
  }
  // Calcula Luhn
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let d = parseInt(imei[i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  imei += ((10 - (sum % 10)) % 10).toString();
  return imei;
}

/**
 * Gera MAC Address aleatório
 */
function generateMAC(): string {
  const hex = '0123456789ABCDEF';
  let mac = '';
  for (let i = 0; i < 6; i++) {
    if (i > 0) mac += ':';
    mac += hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
  }
  return mac;
}

/**
 * Gera Android ID aleatório
 */
function generateAndroidId(): string {
  const hex = '0123456789abcdef';
  let id = '';
  for (let i = 0; i < 16; i++) {
    id += hex[Math.floor(Math.random() * 16)];
  }
  return id;
}

/**
 * Gera fingerprint aleatório
 */
function generateFingerprint(): string {
  const hex = '0123456789abcdef';
  let fp = '';
  for (let i = 0; i < 32; i++) {
    fp += hex[Math.floor(Math.random() * 16)];
  }
  return fp;
}

const ANDROID_MODELS: { model: string; manufacturer: string; name: string; os: string; res: string; ram: number; cores: number }[] = [
  { model: 'SM-G991B', manufacturer: 'Samsung', name: 'Galaxy S21', os: '13', res: '1080x2400', ram: 8192, cores: 8 },
  { model: 'SM-A536B', manufacturer: 'Samsung', name: 'Galaxy A53', os: '13', res: '1080x2400', ram: 6144, cores: 8 },
  { model: 'Pixel 8', manufacturer: 'Google', name: 'Pixel 8', os: '14', res: '1080x2400', ram: 8192, cores: 9 },
  { model: 'Pixel 7', manufacturer: 'Google', name: 'Pixel 7', os: '13', res: '1080x2400', ram: 8192, cores: 9 },
  { model: 'M2101K6G', manufacturer: 'Xiaomi', name: 'Mi 11', os: '12', res: '1440x3200', ram: 8192, cores: 8 },
  { model: 'RMX2185', manufacturer: 'Realme', name: 'Realme 7', os: '13', res: '1080x2400', ram: 6144, cores: 8 },
  { model: 'V2130', manufacturer: 'Vivo', name: 'V21', os: '12', res: '1080x2376', ram: 8192, cores: 8 },
  { model: 'CPH2373', manufacturer: 'OnePlus', name: 'OnePlus 9R', os: '13', res: '1080x2400', ram: 8192, cores: 8 },
  { model: 'M2004J19C', manufacturer: 'Xiaomi', name: 'Redmi Note 9', os: '11', res: '1080x2340', ram: 4096, cores: 8 },
  { model: 'IN2023', manufacturer: 'OnePlus', name: 'OnePlus 8', os: '12', res: '1440x3168', ram: 8192, cores: 8 },
];

const IOS_MODELS: { model: string; manufacturer: string; name: string; os: string; res: string; ram: number; cores: number }[] = [
  { model: 'iPhone15,3', manufacturer: 'Apple', name: 'iPhone 14 Pro Max', os: '17.2', res: '1290x2796', ram: 6144, cores: 6 },
  { model: 'iPhone14,5', manufacturer: 'Apple', name: 'iPhone 13', os: '17.2', res: '1170x2532', ram: 4096, cores: 6 },
  { model: 'iPhone14,7', manufacturer: 'Apple', name: 'iPhone 14', os: '17.2', res: '1179x2556', ram: 6144, cores: 6 },
];

/**
 * Gera um perfil de dispositivo TikTok
 */
export function generateTikTokDeviceProfile(): TikTokDeviceProfile {
  const isIOS = Math.random() < 0.3;
  const pool = isIOS ? IOS_MODELS : ANDROID_MODELS;
  const device = pool[Math.floor(Math.random() * pool.length)];
  
  const userAgent = isIOS
    ? `Mozilla/5.0 (iPhone; CPU iPhone OS ${device.os.replace('.', '_')} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${device.os} Mobile/15E148 Safari/604.1`
    : `Mozilla/5.0 (Linux; Android ${device.os}; ${device.model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36`;
  
  const profile: TikTokDeviceProfile = {
    id: 'tiktok_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    deviceName: `${device.name} #${Math.floor(Math.random() * 9999)}`,
    model: device.model,
    manufacturer: device.manufacturer,
    imei: isIOS ? '' : generateIMEI(),
    androidId: isIOS ? '' : generateAndroidId(),
    mac: generateMAC(),
    fingerprint: generateFingerprint(),
    userAgent,
    resolution: device.res,
    ramMb: device.ram,
    cpuCores: device.cores,
    osVersion: device.os,
    osName: isIOS ? 'iOS' : 'Android',
    accounts: [],
    createdAt: new Date(),
  };
  
  TIKTOK_DEVICES.push(profile);
  return profile;
}

/**
 * Gera URL de signup do TikTok
 */
export function generateTikTokSignupUrl(referralCode?: string): string {
  let url = 'https://www.tiktok.com/signup';
  if (referralCode) {
    url += `?invite_code=${encodeURIComponent(referralCode)}`;
  }
  return url;
}

/**
 * Gera bookmarklet para TikTok
 */
export function generateTikTokBookmarklet(profile: TikTokDeviceProfile): string {
  return `javascript:(function(){
    try {
      // Injeta dados do device no localStorage
      const deviceData = ${JSON.stringify(profile)};
      try { localStorage.setItem('tiktok_device_profile', JSON.stringify(deviceData)); } catch(e) {}
      
      // Injeta IMEI
      if (deviceData.imei) {
        try { localStorage.setItem('tiktok_imei', deviceData.imei); } catch(e) {}
      }
      
      // Injeta MAC
      try { localStorage.setItem('tiktok_mac', deviceData.mac); } catch(e) {}
      
      // Injeta Android ID
      if (deviceData.androidId) {
        try { localStorage.setItem('tiktok_android_id', deviceData.androidId); } catch(e) {}
      }
      
      // Injeta fingerprint
      try { localStorage.setItem('tiktok_fingerprint', deviceData.fingerprint); } catch(e) {}
      
      // Injeta model e manufacturer
      try { localStorage.setItem('tiktok_model', deviceData.model); } catch(e) {}
      try { localStorage.setItem('tiktok_manufacturer', deviceData.manufacturer); } catch(e) {}
      
      // Injeta resolution
      try { localStorage.setItem('tiktok_resolution', deviceData.resolution); } catch(e) {}
      
      // Injeta RAM
      try { localStorage.setItem('tiktok_ram', deviceData.ramMb.toString()); } catch(e) {}
      
      // Injeta OS
      try { localStorage.setItem('tiktok_os_version', deviceData.osVersion); } catch(e) {}
      try { localStorage.setItem('tiktok_os_name', deviceData.osName); } catch(e) {}
      
      // Injeta User-Agent
      try { localStorage.setItem('tiktok_user_agent', deviceData.userAgent); } catch(e) {}
      
      console.log('✓ TikTok device data injected');
    } catch(e) {
      console.error('Erro ao injetar device TikTok:', e);
    }
  })()`;
}

/**
 * Cria um script para simular comportamento de app TikTok
 * CORREÇÃO v2.1: webdriver override agora com try/catch para evitar erro fatal
 */
export function generateTikTokAppBehaviorScript(): string {
  return `
    (function() {
      try {
        // Simula comportamento de app TikTok
        const tiktokBehavior = {
          appVersion: '38.0.0',
          buildNumber: Math.floor(Math.random() * 1000000),
          osVersion: '13',
          platform: 'Android',
        };
        
        // Injeta dados de comportamento
        try { sessionStorage.setItem('tiktok_app_behavior', JSON.stringify(tiktokBehavior)); } catch(e) {}
        
        // Desativa detecção de webdriver (com try/catch para evitar erro fatal)
        try {
          Object.defineProperty(navigator, 'webdriver', {
            get: function() { return false; },
            configurable: true
          });
        } catch(e) {
          // Fallback: tenta via prototype
          try {
            const proto = Object.getPrototypeOf(navigator);
            if (proto) {
              Object.defineProperty(proto, 'webdriver', {
                get: function() { return false; },
                configurable: true
              });
            }
          } catch(e2) {
            console.log('TikTok: Cannot override webdriver, skipping');
          }
        }
        
        // Simula plugins
        const fakePlugins = [
          { name: 'Chrome PDF Plugin', description: 'Portable Document Format' },
          { name: 'Shockwave Flash', description: 'Shockwave Flash 32.0' },
        ];
        try { sessionStorage.setItem('plugins', JSON.stringify(fakePlugins)); } catch(e) {}
        
        console.log('TikTok app behavior simulated');
      } catch(e) {
        console.log('TikTok app behavior error:', e.message);
      }
    })();
  `;
}
