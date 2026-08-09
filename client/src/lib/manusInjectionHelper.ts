/**
 * Manus Injection Helper - Sistema avançado de injeção e rastreamento de convites
 * Garante captura de bônus, spoofing de referrer e persistência de referral tokens.
 */

export interface InjectionPayload {
  deviceProfile: any;
  personalData: any;
  userAgent: any;
  antiFraudMode: boolean;
  referralLink?: string;
}

export function detectManusPage(): boolean {
  try {
    const hostname = window.location.hostname;
    return hostname.includes('manus.im') || hostname.includes('manus.com');
  } catch (e) {
    return false;
  }
}

export function createInjectionScript(payload: InjectionPayload): string {
  const payloadJson = JSON.stringify(payload).replace(/"/g, '\\"');
  
  return `
    (function() {
      try {
        const payload = JSON.parse("${payloadJson}");
        
        // 1. Injeta dados do dispositivo e persona
        window.__DEVICE_PROFILE__ = payload.deviceProfile;
        window.__PERSONAL_DATA__ = payload.personalData;
        window.__USER_AGENT__ = payload.userAgent;
        window.__ANTI_FRAUD_MODE__ = payload.antiFraudMode;
        
        // 2. Extrai e injeta parâmetros de referral / convite para garantir bônus
        const refInput = payload.referralLink || '';
        let refCode = '';
        if (refInput) {
          try {
            if (refInput.includes('http')) {
              const urlObj = new URL(refInput);
              refCode = urlObj.searchParams.get('ref') || urlObj.searchParams.get('invite') || urlObj.searchParams.get('code') || '';
              // Se tiver parâmetros de conversa/chat, preserva
              localStorage.setItem('_manus_chat_ref_url', refInput);
            } else {
              refCode = refInput;
            }
          } catch(e) {
            refCode = refInput;
          }
        }

        if (refCode) {
          localStorage.setItem('_manus_invite_code', refCode);
          localStorage.setItem('manus_ref', refCode);
          sessionStorage.setItem('invite_code', refCode);
          document.cookie = "manus_ref=" + refCode + "; path=/; domain=.manus.im; secure; samesite=lax";
          document.cookie = "invite_token=" + refCode + "; path=/; domain=.manus.im; secure; samesite=lax";
        }

        // 3. Injeta no localStorage e sessionStorage
        localStorage.setItem('_device_profile', JSON.stringify(payload.deviceProfile));
        localStorage.setItem('_personal_data', JSON.stringify(payload.personalData));
        localStorage.setItem('_user_agent', JSON.stringify(payload.userAgent));
        localStorage.setItem('_anti_fraud_mode', payload.antiFraudMode);
        
        sessionStorage.setItem('device_profile', JSON.stringify(payload.deviceProfile));
        sessionStorage.setItem('personal_data', JSON.stringify(payload.personalData));
        sessionStorage.setItem('user_agent', JSON.stringify(payload.userAgent));
        
        // 4. Modifica User-Agent e propriedades anti-detecção
        try {
          Object.defineProperty(navigator, 'userAgent', {
            get: function() { return payload.userAgent.userAgent; },
            configurable: true
          });
          Object.defineProperty(navigator, 'webdriver', {
            get: function() { return false; },
            configurable: true
          });
        } catch(e) {}

        // 5. Spoofing de Referrer se houver link de convite
        if (payload.referralLink && payload.referralLink.includes('http')) {
          try {
            Object.defineProperty(document, 'referrer', {
              get: function() { return payload.referralLink; },
              configurable: true
            });
          } catch(e) {}
        }
        
        window.dispatchEvent(new CustomEvent('deviceInjected', { detail: payload }));
        console.log('✓ Manus Device & Referral Injetados com Sucesso! Ref:', refCode);
        
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;padding:15px 25px;background:linear-gradient(135deg,#00d9ff,#22c55e);color:#050508;border-radius:10px;font-weight:bold;font-family:monospace;font-size:14px;box-shadow:0 0 30px rgba(0,217,255,0.8);animation:fadeIn 0.3s ease';
        toast.textContent = '✓ Device & Bônus de Convite Injetados!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
        
      } catch(error) {
        console.error('Erro ao injetar device:', error);
      }
    })();
  `;
}

export function generateManusUrlWithReferral(referralLink?: string): string {
  const baseUrl = 'https://www.manus.im';
  
  if (!referralLink) return baseUrl;
  
  if (referralLink.includes('http')) {
    return referralLink;
  } else {
    return `${baseUrl}?ref=${encodeURIComponent(referralLink)}`;
  }
}
