/**
 * Cookie and User-Agent Manager - Gerencia cookies e User-Agents para evitar detecção
 * 
 * CORREÇÃO v2.1: Todos os Object.defineProperty agora usam try/catch individual
 * e configuram writable: true, configurable: true para evitar erros em propriedades
 * não-configuráveis (webdriver, headless, plugins, mimeTypes, etc.)
 */

export interface UserAgentProfile {
  userAgent: string;
  platform: string;
  browserVersion: string;
  osVersion: string;
  device: string;
}

// User-Agents realistas de diferentes dispositivos e navegadores
const USER_AGENT_PROFILES: UserAgentProfile[] = [
  // Chrome - Android
  {
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    platform: 'Android',
    browserVersion: '120.0.0.0',
    osVersion: '13',
    device: 'Samsung Galaxy S21'
  },
  {
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    platform: 'Android',
    browserVersion: '120.0.0.0',
    osVersion: '14',
    device: 'Google Pixel 8'
  },
  {
    userAgent: 'Mozilla/5.0 (Linux; Android 12; M2101K6G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
    platform: 'Android',
    browserVersion: '119.0.0.0',
    osVersion: '12',
    device: 'Xiaomi Mi 11'
  },
  {
    userAgent: 'Mozilla/5.0 (Linux; Android 13; RMX2185) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    platform: 'Android',
    browserVersion: '120.0.0.0',
    osVersion: '13',
    device: 'Realme 7'
  },
  // Firefox - Android
  {
    userAgent: 'Mozilla/5.0 (Android; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0',
    platform: 'Android',
    browserVersion: '121.0',
    osVersion: '13',
    device: 'Generic Android'
  },
  // Safari - iOS
  {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    platform: 'iOS',
    browserVersion: '17.2',
    osVersion: '17.2',
    device: 'iPhone 15 Pro'
  },
  {
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    platform: 'iOS',
    browserVersion: '17.2',
    osVersion: '17.2',
    device: 'iPad Pro'
  },
  // Chrome - Windows
  {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    platform: 'Windows',
    browserVersion: '120.0.0.0',
    osVersion: '10.0',
    device: 'Desktop'
  },
  // Firefox - Windows
  {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    platform: 'Windows',
    browserVersion: '121.0',
    osVersion: '10.0',
    device: 'Desktop'
  },
  // Chrome - macOS
  {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    platform: 'macOS',
    browserVersion: '120.0.0.0',
    osVersion: '10.15.7',
    device: 'MacBook'
  },
];

/**
 * Gera um User-Agent aleatório realista
 */
export function generateRandomUserAgent(): UserAgentProfile {
  return USER_AGENT_PROFILES[Math.floor(Math.random() * USER_AGENT_PROFILES.length)];
}

/**
 * Gera múltiplos User-Agents diferentes
 */
export function generateDiverseUserAgents(count: number): UserAgentProfile[] {
  const agents: UserAgentProfile[] = [];
  const used = new Set<number>();
  
  while (agents.length < count && agents.length < USER_AGENT_PROFILES.length) {
    const index = Math.floor(Math.random() * USER_AGENT_PROFILES.length);
    if (!used.has(index)) {
      agents.push(USER_AGENT_PROFILES[index]);
      used.add(index);
    }
  }
  
  return agents;
}

/**
 * Cria um script para limpar cookies
 */
export function generateCookieClearScript(): string {
  return `
    (async function() {
      try {
        // Limpa todos os cookies
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      } catch(e) {}
      
      try { localStorage.clear(); } catch(e) {}
      try { sessionStorage.clear(); } catch(e) {}
      
      try {
        if (window.indexedDB && typeof indexedDB.databases === 'function') {
          const dbs = await indexedDB.databases();
          dbs.forEach(function(db) {
            indexedDB.deleteDatabase(db.name);
          });
        }
      } catch(e) {}
      
      console.log('Cookies and storage cleared');
    })();
  `;
}

/**
 * Cria um script para injetar cookies falsos realistas
 */
export function generateFakeCookieScript(): string {
  const timestamp = Date.now();
  const sessionId = Math.random().toString(36).substring(2, 15);
  const userId = Math.floor(Math.random() * 1000000000);
  
  return `
    (function() {
      try {
        const cookies = {
          '_ga': 'GA1.2.${userId}.${timestamp}',
          '_gid': 'GA1.2.${Math.floor(Math.random() * 1000000000)}.${timestamp}',
          '_gat': '1',
          'sessionid': '${sessionId}',
          'userid': '${userId}',
          'timestamp': '${timestamp}',
        };
        
        Object.entries(cookies).forEach(([key, value]) => {
          try { document.cookie = key + '=' + value + '; path=/; max-age=' + (365 * 24 * 60 * 60); } catch(e) {}
        });
        
        try { localStorage.setItem('_ga_session', '${sessionId}'); } catch(e) {}
        try { localStorage.setItem('_user_id', '${userId}'); } catch(e) {}
        try { localStorage.setItem('_session_start', '${timestamp}'); } catch(e) {}
      } catch(e) {}
      
      console.log('Fake cookies injected');
    })();
  `;
}

/**
 * Cria um script para simular histórico de navegação
 */
export function generateBrowsingHistoryScript(): string {
  return `
    (function() {
      try {
        const fakePages = [
          'https://www.google.com',
          'https://www.youtube.com',
          'https://www.facebook.com',
          'https://www.instagram.com',
          'https://www.twitter.com',
        ];
        
        try { sessionStorage.setItem('browsing_history', JSON.stringify(fakePages)); } catch(e) {}
        try { sessionStorage.setItem('referrer', fakePages[Math.floor(Math.random() * fakePages.length)]); } catch(e) {}
      } catch(e) {}
      
      console.log('Browsing history simulated');
    })();
  `;
}

/**
 * Cria um script para simular plugins do navegador
 */
export function generatePluginsScript(): string {
  return `
    (function() {
      try {
        const fakePlugins = [
          { name: 'Chrome PDF Plugin', description: 'Portable Document Format' },
          { name: 'Chrome PDF Viewer', description: 'Portable Document Format' },
          { name: 'Native Client Executable', description: 'Native Client Executable' },
          { name: 'Shockwave Flash', description: 'Shockwave Flash 32.0 r0' },
        ];
        
        try { sessionStorage.setItem('plugins', JSON.stringify(fakePlugins)); } catch(e) {}
      } catch(e) {}
      
      console.log('Plugins simulated');
    })();
  `;
}

/**
 * Cria um script para override de Canvas fingerprint
 */
export function generateCanvasOverrideScript(): string {
  return `
    (function() {
      try {
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(type) {
          if (type === 'image/png' || type === 'image/jpeg') {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return canvas.toDataURL(type);
          }
          return originalToDataURL.call(this, type);
        };
      } catch(e) {}
      console.log('Canvas fingerprint override active');
    })();
  `;
}

/**
 * Cria um script para override de WebGL fingerprint
 */
export function generateWebGLOverrideScript(): string {
  return `
    (function() {
      try {
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
          if (parameter === 37445) return 'Intel Inc.';
          if (parameter === 37446) return 'Intel Iris OpenGL Engine';
          return getParameter.call(this, parameter);
        };
      } catch(e) {}
      console.log('WebGL fingerprint override active');
    })();
  `;
}

/**
 * Cria um script para override de Audio context
 */
export function generateAudioContextOverrideScript(): string {
  return `
    (function() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
          AudioContext.prototype.createAnalyser = function() {
            const analyser = originalCreateAnalyser.call(this);
            const originalGetByteFrequencyData = analyser.getByteFrequencyData;
            analyser.getByteFrequencyData = function(array) {
              originalGetByteFrequencyData.call(this, array);
              for (let i = 0; i < array.length; i++) {
                array[i] = Math.floor(Math.random() * 256);
              }
            };
            return analyser;
          };
        }
      } catch(e) {}
      console.log('Audio context override active');
    })();
  `;
}

/**
 * Cria um script para timezone spoofing
 */
export function generateTimezoneOverrideScript(): string {
  return `
    (function() {
      try {
        const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
        Intl.DateTimeFormat.prototype.resolvedOptions = function() {
          const options = originalResolvedOptions.call(this);
          options.timeZone = 'America/Sao_Paulo';
          return options;
        };
      } catch(e) {}
      console.log('Timezone override active');
    })();
  `;
}

/**
 * Cria um script para screen resolution spoofing
 * CORREÇÃO: Usa try/catch individual e configurable: true
 */
export function generateScreenOverrideScript(): string {
  return `
    (function() {
      try {
        const fakeWidth = 1920;
        const fakeHeight = 1080;
        
        try {
          Object.defineProperty(window.screen, 'width', { 
            get: function() { return fakeWidth; }, 
            configurable: true 
          });
        } catch(e) {}
        
        try {
          Object.defineProperty(window.screen, 'height', { 
            get: function() { return fakeHeight; }, 
            configurable: true 
          });
        } catch(e) {}
        
        try {
          Object.defineProperty(window.screen, 'availWidth', { 
            get: function() { return fakeWidth; }, 
            configurable: true 
          });
        } catch(e) {}
        
        try {
          Object.defineProperty(window.screen, 'availHeight', { 
            get: function() { return fakeHeight - 40; }, 
            configurable: true 
          });
        } catch(e) {}
        
        try {
          Object.defineProperty(window, 'innerWidth', { 
            get: function() { return fakeWidth; }, 
            configurable: true 
          });
        } catch(e) {}
        
        try {
          Object.defineProperty(window, 'innerHeight', { 
            get: function() { return fakeHeight; }, 
            configurable: true 
          });
        } catch(e) {}
      } catch(e) {}
      
      console.log('Screen resolution override active');
    })();
  `;
}

/**
 * Cria um script para fonts detection override
 * CORREÇÃO: Usa try/catch individual e configurable: true
 */
export function generateFontsOverrideScript(): string {
  return `
    (function() {
      try {
        try {
          Object.defineProperty(navigator, 'plugins', { 
            get: function() { return []; }, 
            configurable: true 
          });
        } catch(e) {
          // Fallback: sobrescrever o getter existente
          try {
            const desc = Object.getOwnPropertyDescriptor(navigator, 'plugins');
            if (desc && !desc.configurable) {
              // Não podemos redefinir, mas podemos tentar interceptar
              console.log('navigator.plugins is non-configurable, skipping override');
            }
          } catch(e2) {}
        }
        
        try {
          Object.defineProperty(navigator, 'mimeTypes', { 
            get: function() { return []; }, 
            configurable: true 
          });
        } catch(e) {
          try {
            const desc = Object.getOwnPropertyDescriptor(navigator, 'mimeTypes');
            if (desc && !desc.configurable) {
              console.log('navigator.mimeTypes is non-configurable, skipping override');
            }
          } catch(e2) {}
        }
      } catch(e) {}
      
      console.log('Fonts detection override active');
    })();
  `;
}

/**
 * Cria um script para battery API override
 */
export function generateBatteryOverrideScript(): string {
  return `
    (function() {
      try {
        if (navigator.getBattery) {
          const originalGetBattery = navigator.getBattery;
          navigator.getBattery = function() {
            return originalGetBattery.call(this).then(function(battery) {
              try { battery.level = 0.85; } catch(e) {}
              try { battery.charging = true; } catch(e) {}
              try { battery.chargingTime = 1800; } catch(e) {}
              try { battery.dischargingTime = Infinity; } catch(e) {}
              return battery;
            });
          };
        }
      } catch(e) {}
      console.log('Battery API override active');
    })();
  `;
}

/**
 * Cria um script para geolocation spoofing
 */
export function generateGeolocationOverrideScript(): string {
  return `
    (function() {
      try {
        const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
        navigator.geolocation.getCurrentPosition = function(success, error, options) {
          const fakePosition = {
            coords: {
              latitude: -23.5505,
              longitude: -46.6333,
              accuracy: 10,
              altitude: 0,
              altitudeAccuracy: 0,
              heading: 0,
              speed: 0
            },
            timestamp: Date.now()
          };
          success(fakePosition);
        };
      } catch(e) {}
      console.log('Geolocation override active');
    })();
  `;
}

/**
 * Cria um script completo para anti-detecção
 * 
 * CORREÇÃO v2.1: TODOS os Object.defineProperty agora estão dentro de try/catch individual
 * e usam configurable: true para evitar erros em propriedades não-configuráveis.
 * Isso garante que o script NUNCA falhe por causa de uma única propriedade.
 */
export function generateCompleteAntiDetectionScript(userAgent: UserAgentProfile): string {
  return `
    (function() {
      // === 1. Define User-Agent (com try/catch) ===
      try {
        Object.defineProperty(navigator, 'userAgent', {
          get: function() { return '${userAgent.userAgent}'; },
          configurable: true
        });
      } catch(e) {
        // Se userAgent é non-configurable, tenta via prototype override
        try {
          Object.defineProperty(Object.getPrototypeOf(navigator), 'userAgent', {
            get: function() { return '${userAgent.userAgent}'; },
            configurable: true
          });
        } catch(e2) {
          console.log('Cannot override userAgent:', e2.message);
        }
      }
      
      // === 2. Define Platform (com try/catch) ===
      try {
        Object.defineProperty(navigator, 'platform', {
          get: function() { return '${userAgent.platform}'; },
          configurable: true
        });
      } catch(e) {
        console.log('Cannot override platform:', e.message);
      }
      
      // === 3. Limpa cookies antigos ===
      ${generateCookieClearScript()}
      
      // === 4. Injeta cookies realistas ===
      ${generateFakeCookieScript()}
      
      // === 5. Simula histórico ===
      ${generateBrowsingHistoryScript()}
      
      // === 6. Simula plugins ===
      ${generatePluginsScript()}
      
      // === 7. Canvas fingerprint override ===
      ${generateCanvasOverrideScript()}
      
      // === 8. WebGL fingerprint override ===
      ${generateWebGLOverrideScript()}
      
      // === 9. Audio context override ===
      ${generateAudioContextOverrideScript()}
      
      // === 10. Timezone override ===
      ${generateTimezoneOverrideScript()}
      
      // === 11. Screen resolution override ===
      ${generateScreenOverrideScript()}
      
      // === 12. Fonts detection override ===
      ${generateFontsOverrideScript()}
      
      // === 13. Battery API override ===
      ${generateBatteryOverrideScript()}
      
      // === 14. Geolocation override ===
      ${generateGeolocationOverrideScript()}
      
      // === 15. Desativa detecção de webdriver (com try/catch robusto) ===
      try {
        Object.defineProperty(navigator, 'webdriver', {
          get: function() { return false; },
          configurable: true,
          enumerable: true
        });
      } catch(e) {
        // Fallback: tenta via defineProperty no prototype
        try {
          const proto = Object.getPrototypeOf(navigator);
          if (proto) {
            Object.defineProperty(proto, 'webdriver', {
              get: function() { return false; },
              configurable: true,
              enumerable: true
            });
          }
        } catch(e2) {
          console.log('Cannot override webdriver:', e2.message);
        }
      }
      
      // === 16. Desativa detecção de headless (com try/catch robusto) ===
      try {
        Object.defineProperty(navigator, 'headless', {
          get: function() { return false; },
          configurable: true,
          enumerable: true
        });
      } catch(e) {
        // headless geralmente não existe, se falhar não é problema
        try {
          const proto = Object.getPrototypeOf(navigator);
          if (proto) {
            Object.defineProperty(proto, 'headless', {
              get: function() { return false; },
              configurable: true,
              enumerable: true
            });
          }
        } catch(e2) {
          console.log('Cannot override headless:', e2.message);
        }
      }
      
      console.log('✓ Complete anti-detection measures activated');
    })();
  `;
}

/**
 * Gera informações de rotação de User-Agent
 */
export interface UserAgentRotationInfo {
  current: UserAgentProfile;
  next: UserAgentProfile;
  rotationInterval: number;
  lastRotation: number;
}

export function generateUserAgentRotationInfo(): UserAgentRotationInfo {
  const profiles = USER_AGENT_PROFILES;
  const current = profiles[Math.floor(Math.random() * profiles.length)];
  const next = profiles[Math.floor(Math.random() * profiles.length)];
  
  return {
    current,
    next,
    rotationInterval: 300000, // 5 minutos
    lastRotation: Date.now(),
  };
}

/**
 * Gera informações de rotação de User-Agent
 */
export function getRotationInfo(current: UserAgentProfile): UserAgentRotationInfo {
  return {
    current,
    next: generateRandomUserAgent(),
    rotationInterval: 300000, // 5 minutos
    lastRotation: Date.now(),
  };
}
