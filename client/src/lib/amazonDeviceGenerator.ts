/**
 * Amazon Device Generator — Gerador específico para o ecossistema Amazon
 * A Amazon utiliza uma das defesas mais agressivas do mercado:
 *  - Amazon Fraud Detector (machine learning de risco)
 *  - Detecção de browser automation (botmon, device fingerprint via uids do site)
 *  - Análise de geolocalização de IP vs timezone vs locale
 *  - Verificação de identidade por SMS/email no cadastro (2FA)
 *  - Cookie e device token persistente (ubid-main, at-main)
 * Este gerador cria perfis técnicos consistentes para fins de
 * estudo/teste de segurança e privacidade digital.
 */

export interface AmazonDeviceProfile {
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
  ubidToken: string;
  amazonDeviceToken: string;
  locale: string;
  timezone: string;
  cookies: Record<string, string>;
}

const DEVICES = [
  { model: 'SM-A336B', manufacturer: 'Samsung', name: 'Galaxy A33' },
  { model: 'RMX3630', manufacturer: 'Realme', name: 'Realme 9' },
  { model: 'M2102J20SG', manufacturer: 'Xiaomi', name: 'Redmi Note 10' },
  { model: 'SM-J600G', manufacturer: 'Samsung', name: 'Galaxy J6' },
];

export function generateAmazonDeviceProfile(): AmazonDeviceProfile {
  const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
  const androidVer = Math.random() > 0.5 ? '12' : '13';
  const ua = `Mozilla/5.0 (Linux; Android ${androidVer}; ${device.model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36`;

  return {
    id: `amzdev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date(),
    deviceName: `${device.name} #${Math.floor(Math.random() * 9999)}`,
    model: device.model,
    manufacturer: device.manufacturer,
    resolution: '1080x2400',
    userAgent: ua,
    macAddress: 'DD:EE:FF:' + Math.floor(Math.random() * 89 + 10) + ':' + Math.floor(Math.random() * 89 + 10) + ':' + Math.floor(Math.random() * 89 + 10),
    imei: '86' + Math.floor(Math.random() * 100000000000000).toString().padStart(13, '0'),
    androidId: Math.random().toString(16).substring(2, 18),
    sessionId: Math.random().toString(36).substring(2, 15),
    fingerprint: 'fp_' + Math.random().toString(36).substring(2, 15),
    ubidToken: '257-' + Math.floor(Math.random() * 1e14).toString(),
    amazonDeviceToken: 'at|' + Math.random().toString(36).substring(2, 30),
    locale: 'pt_BR',
    timezone: 'America/Sao_Paulo',
    cookies: {
      deviceId: 'did_' + Math.random().toString(36).substring(2, 10),
      sessionToken: 'tok_' + Math.random().toString(36).substring(2, 15),
      ubid_main: '257-' + Math.floor(Math.random() * 1e14).toString(),
      'session-id': Math.random().toString(36).substring(2, 24),
    },
  };
}

export function generateAmazonBookmarklet(profile: AmazonDeviceProfile): string {
  const profileJson = JSON.stringify({
    macAddress: profile.macAddress,
    imei: profile.imei,
    androidId: profile.androidId,
    model: profile.model,
    manufacturer: profile.manufacturer,
    resolution: profile.resolution,
    fingerprint: profile.fingerprint,
    userAgent: profile.userAgent,
    ubidToken: profile.ubidToken,
    amazonDeviceToken: profile.amazonDeviceToken,
    locale: profile.locale,
    timezone: profile.timezone,
  }).replace(/"/g, '\\"');

  const code = `
    (function() {
      try {
        const profile = JSON.parse("${profileJson}");
        localStorage.setItem('amazon_device_profile', JSON.stringify(profile));
        localStorage.setItem('_device_fingerprint', profile.fingerprint);
        localStorage.setItem('_device_model', profile.model);
        localStorage.setItem('_amazon_ubid', profile.ubidToken);
        localStorage.setItem('_amazon_device_token', profile.amazonDeviceToken);
        console.log('%c✓ Amazon Device Injetado com Sucesso!', 'color: #ff9900; font-weight: bold; font-size: 16px;');
      } catch(err) {
        console.error('Erro na injeção:', err);
      }
    })();
  `;

  return `javascript:${code.replace(/\s+/g, ' ').trim()}`;
}
