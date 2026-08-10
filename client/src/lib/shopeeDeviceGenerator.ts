/**
 * Shopee Device Generator — Gerador específico para o ecossistema Shopee
 * A Shopee (Sea Group) utiliza:
 *  - Shopee Anti-Cheating System (SACS) com device ID persistente
 *  - Detecção de múltiplas contas no mesmo device fingerprint
 *  - Análise de SPSID/cnx token para sessão mobile
 *  - Verificação de phone/email no cadastro com anti-fraude de rede
 *  - Detecção de emulador/WebView em tráfego mobile
 * Este gerador cria perfis técnicos consistentes para fins de
 * estudo/teste de segurança e privacidade digital.
 */

export interface ShopeeDeviceProfile {
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
  spsid: string;
  shopeeDeviceId: string;
  appVersion: string;
  cookies: Record<string, string>;
}

const DEVICES = [
  { model: 'SM-A035M', manufacturer: 'Samsung', name: 'Galaxy A03' },
  { model: '2210132G', manufacturer: 'Xiaomi', name: 'Redmi 12' },
  { model: 'SM-M127F', manufacturer: 'Samsung', name: 'Galaxy M12' },
  { model: 'TECNO KI5', manufacturer: 'Tecno', name: 'Tecno Spark Go' },
];

export function generateShopeeDeviceProfile(): ShopeeDeviceProfile {
  const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
  const androidVer = Math.random() > 0.5 ? '12' : '13';
  const ua = `Mozilla/5.0 (Linux; Android ${androidVer}; ${device.model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36`;
  const appVersion = '3.4' + Math.floor(Math.random() * 9) + '.' + Math.floor(Math.random() * 20);

  return {
    id: `spdev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date(),
    deviceName: `${device.name} #${Math.floor(Math.random() * 9999)}`,
    model: device.model,
    manufacturer: device.manufacturer,
    resolution: '1080x2400',
    userAgent: ua,
    macAddress: 'EE:FF:AA:' + Math.floor(Math.random() * 89 + 10) + ':' + Math.floor(Math.random() * 89 + 10) + ':' + Math.floor(Math.random() * 89 + 10),
    imei: '86' + Math.floor(Math.random() * 100000000000000).toString().padStart(13, '0'),
    androidId: Math.random().toString(16).substring(2, 18),
    sessionId: Math.random().toString(36).substring(2, 15),
    fingerprint: 'fp_' + Math.random().toString(36).substring(2, 15),
    spsid: 'SPS-' + Math.random().toString(36).substring(2, 20).toUpperCase(),
    shopeeDeviceId: 'DEV-' + Math.floor(Math.random() * 1e12).toString(16).toUpperCase(),
    appVersion,
    cookies: {
      deviceId: 'did_' + Math.random().toString(36).substring(2, 10),
      sessionToken: 'tok_' + Math.random().toString(36).substring(2, 15),
      SPSID: 'SPS-' + Math.random().toString(36).substring(2, 20).toUpperCase(),
    },
  };
}

export function generateShopeeBookmarklet(profile: ShopeeDeviceProfile): string {
  const profileJson = JSON.stringify({
    macAddress: profile.macAddress,
    imei: profile.imei,
    androidId: profile.androidId,
    model: profile.model,
    manufacturer: profile.manufacturer,
    resolution: profile.resolution,
    fingerprint: profile.fingerprint,
    userAgent: profile.userAgent,
    spsid: profile.spsid,
    shopeeDeviceId: profile.shopeeDeviceId,
    appVersion: profile.appVersion,
  }).replace(/"/g, '\\"');

  const code = `
    (function() {
      try {
        const profile = JSON.parse("${profileJson}");
        localStorage.setItem('shopee_device_profile', JSON.stringify(profile));
        localStorage.setItem('_device_fingerprint', profile.fingerprint);
        localStorage.setItem('_device_model', profile.model);
        localStorage.setItem('_sp_device_id', profile.shopeeDeviceId);
        localStorage.setItem('_sp_spsid', profile.spsid);
        console.log('%c✓ Shopee Device Injetado com Sucesso!', 'color: #ee4d2d; font-weight: bold; font-size: 16px;');
      } catch(err) {
        console.error('Erro na injeção:', err);
      }
    })();
  `;

  return `javascript:${code.replace(/\s+/g, ' ').trim()}`;
}
