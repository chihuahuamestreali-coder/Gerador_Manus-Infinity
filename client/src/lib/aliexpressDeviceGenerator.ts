import { UniversalDeviceProfile, generateUniversalDevice } from './universalDeviceGenerator';

export type AliExpressDeviceProfile = UniversalDeviceProfile;

export function generateAliExpressDeviceProfile(): AliExpressDeviceProfile {
  return generateUniversalDevice('aliexpress');
}

export function generateBookmarklet(profile: AliExpressDeviceProfile): string {
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
        localStorage.setItem('device_profile', JSON.stringify(profile));
        localStorage.setItem('_device_fingerprint', profile.fingerprint);
        localStorage.setItem('_device_model', profile.model);
        
        try {
          Object.defineProperty(navigator, 'userAgent', {
            get: function() { return "${profile.userAgent}"; },
            configurable: true
          });
        } catch(e) {}

        console.log('%c✓ AliExpress Device Injetado com Sucesso!', 'color: #ff4444; font-weight: bold; font-size: 16px;');
      } catch(err) {
        console.error('Erro na injeção:', err);
      }
    })();
  `;

  return `javascript:${code.replace(/\s+/g, ' ').trim()}`;
}

export function generateAliExpressBookmarklet(profile: AliExpressDeviceProfile): string {
  return generateBookmarklet(profile);
}
