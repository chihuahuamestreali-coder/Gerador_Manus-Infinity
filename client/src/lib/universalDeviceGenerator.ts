/**
 * Universal Device Generator - Gera perfis e scripts de injeção infalíveis
 * Inspirado no padrão Claude/Manus/TikTok
 */

export interface UniversalDeviceProfile {
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
  sessionId: string;
  fingerprint: string;
  cookies: Record<string, string>;
}

const DEVICES = [
  { model: 'SM-G991B', manufacturer: 'Samsung', name: 'Galaxy S21' },
  { model: 'SM-A515F', manufacturer: 'Samsung', name: 'Galaxy A51' },
  { model: 'M2101K6G', manufacturer: 'Xiaomi', name: 'Mi 11' },
  { model: 'RMX2185', manufacturer: 'Realme', name: 'Realme 7' },
];

export function generateUniversalDevice(platform: string): UniversalDeviceProfile {
  const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
  const androidVer = '13';
  const ua = `Mozilla/5.0 (Linux; Android ${androidVer}; ${device.model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36`;
  
  return {
    id: `dev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date(),
    deviceName: `${device.name} #${Math.floor(Math.random() * 9999)}`,
    model: device.model,
    manufacturer: device.manufacturer,
    resolution: '1080x2400',
    userAgent: ua,
    macAddress: 'AA:BB:CC:' + Math.floor(Math.random()*89+10) + ':' + Math.floor(Math.random()*89+10) + ':' + Math.floor(Math.random()*89+10),
    imei: '86' + Math.floor(Math.random() * 100000000000000).toString().padStart(13, '0'),
    androidId: Math.random().toString(16).substring(2, 18),
    sessionId: Math.random().toString(36).substring(2, 15),
    fingerprint: 'fp_' + Math.random().toString(36).substring(2, 15),
    cookies: {
      deviceId: 'did_' + Math.random().toString(36).substring(2, 10),
      sessionToken: 'tok_' + Math.random().toString(36).substring(2, 15),
    }
  };
}

export function generateDirectInjectionScript(profile: UniversalDeviceProfile, targetUrl: string, platformName: string, color: string): string {
  return `
    (function() {
      try {
        window.${platformName}Device = ${JSON.stringify(profile)};
        localStorage.setItem('${platformName}DeviceProfile', JSON.stringify(window.${platformName}Device));
        sessionStorage.setItem('${platformName}Session', '${profile.sessionId}');
        
        // Mock Navigator & Screen
        try {
          Object.defineProperty(navigator, 'userAgent', { get: function() { return "${profile.userAgent}"; }, configurable: true });
          Object.defineProperty(navigator, 'hardwareConcurrency', { get: function() { return 8; }, configurable: true });
          Object.defineProperty(navigator, 'deviceMemory', { get: function() { return 8; }, configurable: true });
        } catch(e) {}

        // Mock Cookies
        Object.entries(${JSON.stringify(profile.cookies)}).forEach(([key, value]) => {
          document.cookie = key + '=' + value + '; path=/; domain=.' + window.location.hostname.split('.').slice(-2).join('.');
        });

        console.log('%c✓ ${platformName} Device Injetado com Sucesso!', 'color: ${color}; font-weight: bold; font-size: 16px;');
        
        document.body.innerHTML = \`
          <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a0e27; font-family: monospace; color: ${color}; font-size: 24px; text-align: center; padding: 20px;">
            <div>
              <div style="font-size: 64px; margin-bottom: 20px;">✓</div>
              <div style="font-weight: bold; margin-bottom: 10px;">DEVICE ${platformName.toUpperCase()} INJETADO!</div>
              <div style="font-size: 14px; opacity: 0.8; margin-bottom: 20px;">Redirecionando para ${targetUrl}...</div>
            </div>
          </div>
        \`;

        setTimeout(() => {
          window.location.href = '${targetUrl}';
        }, 1500);
      } catch(err) {
        console.error('Erro na injeção:', err);
        document.body.innerHTML = '<div style="color: red; padding: 40px; font-family: monospace;">Erro ao injetar device: ' + err.message + '</div>';
      }
    })();
  `;
}
