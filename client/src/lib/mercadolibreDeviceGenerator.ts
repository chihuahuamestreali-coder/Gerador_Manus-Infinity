/**
 * Mercado Livre Device Generator — Gerador específico para o ecossistema Mercado Livre
 * O Mercado Livre utiliza:
 *  - Device fingerprinting via MercadoLibre Device API (ml-device)
 *  - Análise de sessão e cookies de rastreamento (ML tracking ID)
 *  - Detecção de WebView vs navegador móvel
 *  - Anti-bot próprio (ML BotGuard) com análise comportamental
 * Este gerador cria perfis técnicos consistentes (device id, device info, session)
 * para fins de estudo/teste de segurança e privacidade digital.
 */

export interface MercadoLibreDeviceProfile {
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
  mlDeviceId: string;
  mlDeviceInfo: string;
  mlTrackingId: string;
  cookies: Record<string, string>;
}

const DEVICES = [
  { model: 'SM-A125F', manufacturer: 'Samsung', name: 'Galaxy A12' },
  { model: 'M2003J15SC', manufacturer: 'Xiaomi', name: 'Redmi 9' },
  { model: 'SM-G960F', manufacturer: 'Samsung', name: 'Galaxy S9' },
  { model: 'STK-LX1', manufacturer: 'Huawei', name: 'P Smart 2019' },
];

export function generateMercadoLibreDeviceProfile(): MercadoLibreDeviceProfile {
  const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
  const androidVer = Math.random() > 0.5 ? '12' : '13';
  const ua = `Mozilla/5.0 (Linux; Android ${androidVer}; ${device.model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36`;

  return {
    id: `mldev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date(),
    deviceName: `${device.name} #${Math.floor(Math.random() * 9999)}`,
    model: device.model,
    manufacturer: device.manufacturer,
    resolution: '1080x2400',
    userAgent: ua,
    macAddress: 'BB:CC:DD:' + Math.floor(Math.random() * 89 + 10) + ':' + Math.floor(Math.random() * 89 + 10) + ':' + Math.floor(Math.random() * 89 + 10),
    imei: '86' + Math.floor(Math.random() * 100000000000000).toString().padStart(13, '0'),
    androidId: Math.random().toString(16).substring(2, 18),
    sessionId: Math.random().toString(36).substring(2, 15),
    fingerprint: 'fp_' + Math.random().toString(36).substring(2, 15),
    mlDeviceId: 'ML-' + Math.random().toString(36).substring(2, 14).toUpperCase(),
    mlDeviceInfo: btoa(JSON.stringify({ model: device.model, os: 'Android', osVersion: androidVer, app: 'web' })),
    mlTrackingId: 'TRK-' + Math.floor(Math.random() * 1e12).toString(16).toUpperCase(),
    cookies: {
      deviceId: 'did_' + Math.random().toString(36).substring(2, 10),
      sessionToken: 'tok_' + Math.random().toString(36).substring(2, 15),
      ml_tracking: 'TRK-' + Math.floor(Math.random() * 1e12).toString(16).toUpperCase(),
    },
  };
}

export function generateMercadoLibreBookmarklet(profile: MercadoLibreDeviceProfile): string {
  const profileJson = JSON.stringify({
    macAddress: profile.macAddress,
    imei: profile.imei,
    androidId: profile.androidId,
    model: profile.model,
    manufacturer: profile.manufacturer,
    resolution: profile.resolution,
    fingerprint: profile.fingerprint,
    userAgent: profile.userAgent,
    mlDeviceId: profile.mlDeviceId,
    mlDeviceInfo: profile.mlDeviceInfo,
    mlTrackingId: profile.mlTrackingId,
  }).replace(/"/g, '\\"');

  const code = `
    (function() {
      try {
        const profile = JSON.parse("${profileJson}");
        localStorage.setItem('ml_device_profile', JSON.stringify(profile));
        localStorage.setItem('_device_fingerprint', profile.fingerprint);
        localStorage.setItem('_device_model', profile.model);
        localStorage.setItem('_ml_device_id', profile.mlDeviceId);
        localStorage.setItem('_ml_tracking_id', profile.mlTrackingId);
        console.log('%c✓ Mercado Livre Device Injetado com Sucesso!', 'color: #ffe600; font-weight: bold; font-size: 16px;');
      } catch(err) {
        console.error('Erro na injeção:', err);
      }
    })();
  `;

  return `javascript:${code.replace(/\s+/g, ' ').trim()}`;
}
