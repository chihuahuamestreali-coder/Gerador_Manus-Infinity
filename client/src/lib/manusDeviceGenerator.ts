/**
 * Manus Device Generator - Gera fingerprints e identidades de dispositivos únicos para Manus
 * Design: Cyberpunk Industrial
 */

import { DeviceProfile, generateDeviceProfile } from './deviceGenerator';

/**
 * Gera um perfil de dispositivo para Manus
 * Reutiliza a lógica do gerador padrão
 */
export function generateManusDeviceProfile(): DeviceProfile {
  return generateDeviceProfile();
}

/**
 * Cria um URL para abrir a página de criação do Manus com link de convite
 */
export function generateManusSignupUrl(referralLink?: string): string {
  if (!referralLink) {
    return 'https://manus.im/signup';
  }
  
  // Se for uma URL completa de conversa ou convite, usa diretamente
  if (referralLink.includes('http://') || referralLink.includes('https://')) {
    return referralLink;
  }
  
  // Se for apenas o código de convite (ex: abc123xyz), monta a URL oficial
  return `https://manus.im/signup?ref=${encodeURIComponent(referralLink)}`;
}

/**
 * Cria um bookmarklet para injetar dados no Manus
 */
export function generateManusBookmarklet(profile: DeviceProfile): string {
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
        
        // Detecta se está no Manus
        const isManus = window.location.hostname.includes('manus');
        
        // Injeta dados no localStorage e flags de bônus / convite
        localStorage.setItem('device_profile', JSON.stringify(profile));
        localStorage.setItem('_device_fingerprint', profile.fingerprint);
        localStorage.setItem('_device_model', profile.model);
        localStorage.setItem('_device_mac', profile.macAddress);
        localStorage.setItem('_device_imei', profile.imei);
        localStorage.setItem('_manus_bonus_active', 'true');
        localStorage.setItem('_manus_referral_bypass', 'unlimited_tier');
        
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
          Object.defineProperty(window, 'innerWidth', {
            get: function() { return width; },
            configurable: true
          });
          Object.defineProperty(window, 'innerHeight', {
            get: function() { return height; },
            configurable: true
          });
        } catch(e) {}
        
        alert('Device injetado com sucesso no Manus!');
      } catch(error) {
        alert('Erro ao injetar device: ' + error.message);
      }
    })();
  `;

  return `javascript:${code}`;
}
