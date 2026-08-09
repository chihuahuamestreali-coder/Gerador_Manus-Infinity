/**
 * Manus Injection Helper - Sistema híbrido de injeção automática
 * 
 * Como funciona:
 * 1. O ManusManager abre uma nova aba do Manus e armazena o script no sessionStorage
 * 2. Este arquivo é carregado como um script inline na aba do Manus
 * 3. Detecta que está no Manus e cria um botão "COLAR DEVICE AQUI"
 * 4. Ao clicar no botão, executa o script de injeção armazenado
 */

export interface InjectionPayload {
  deviceProfile: any;
  personalData: any;
  userAgent: any;
  antiFraudMode: boolean;
}

/**
 * Detecta se está na aba do Manus
 */
export function detectManusPage(): boolean {
  try {
    const hostname = window.location.hostname;
    return hostname.includes('manus.im') || hostname.includes('manus.com');
  } catch (e) {
    return false;
  }
}

/**
 * Cria o script de injeção que será executado na aba do Manus
 * Este script injeta dados do dispositivo no localStorage/sessionStorage do Manus
 */
export function createInjectionScript(payload: InjectionPayload): string {
  const payloadJson = JSON.stringify(payload).replace(/"/g, '\\"');
  
  return `
    (function() {
      try {
        const payload = JSON.parse("${payloadJson}");
        
        // Injeta dados do dispositivo
        window.__DEVICE_PROFILE__ = payload.deviceProfile;
        window.__PERSONAL_DATA__ = payload.personalData;
        window.__USER_AGENT__ = payload.userAgent;
        window.__ANTI_FRAUD_MODE__ = payload.antiFraudMode;
        
        // Injeta no localStorage
        localStorage.setItem('_device_profile', JSON.stringify(payload.deviceProfile));
        localStorage.setItem('_personal_data', JSON.stringify(payload.personalData));
        localStorage.setItem('_user_agent', JSON.stringify(payload.userAgent));
        localStorage.setItem('_anti_fraud_mode', payload.antiFraudMode);
        
        // Injeta no sessionStorage
        sessionStorage.setItem('device_profile', JSON.stringify(payload.deviceProfile));
        sessionStorage.setItem('personal_data', JSON.stringify(payload.personalData));
        sessionStorage.setItem('user_agent', JSON.stringify(payload.userAgent));
        
        // Modifica User-Agent
        try {
          Object.defineProperty(navigator, 'userAgent', {
            get: function() { return payload.userAgent.userAgent; },
            configurable: true
          });
        } catch(e) {}
        
        // Dispara evento customizado
        window.dispatchEvent(new CustomEvent('deviceInjected', { detail: payload }));
        
        console.log('✓ Device injetado com sucesso!');
        
        // Mostra confirmação visual
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;padding:15px 20px;background:linear-gradient(135deg,#00d9ff,#0099cc);color:#000;border-radius:8px;font-weight:bold;font-family:monospace;font-size:14px;box-shadow:0 0 20px rgba(0,217,255,0.5);animation:fadeIn 0.3s ease';
        toast.textContent = '✓ Device injetado com sucesso!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
        
      } catch(error) {
        console.error('Erro ao injetar device:', error);
        alert('✗ Erro ao injetar device: ' + error.message);
      }
    })();
  `;
}

/**
 * Script que deve ser injetado na aba do Manus para criar o botão de injeção
 * Este é o script que será executado via eval na aba do Manus
 */
export function getManusTabDetectorScript(): string {
  return `
    (function() {
      // Verifica se já existe o botão
      if (document.getElementById('manus-device-injector-btn')) return;
      
      // Verifica se tem script armazenado
      const script = sessionStorage.getItem('manus_injection_script');
      if (!script) return;
      
      // Cria o botão flutuante
      const button = document.createElement('button');
      button.id = 'manus-device-injector-btn';
      button.textContent = '✓ COLAR DEVICE AQUI';
      button.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;padding:14px 24px;background:linear-gradient(135deg,#00d9ff 0%,#0099cc 100%);color:#000;border:2px solid #00d9ff;border-radius:10px;font-weight:bold;font-size:14px;cursor:pointer;box-shadow:0 0 30px rgba(0,217,255,0.6);font-family:monospace;transition:all 0.3s ease;animation:fadeIn 0.5s ease,pulse 2s ease-in-out infinite;';
      
      // Efeito hover
      button.onmouseover = function() {
        this.style.boxShadow = '0 0 40px rgba(0,217,255,0.9)';
        this.style.transform = 'scale(1.05)';
      };
      button.onmouseout = function() {
        this.style.boxShadow = '0 0 30px rgba(0,217,255,0.6)';
        this.style.transform = 'scale(1)';
      };
      
      // Clique = injeta
      button.onclick = function() {
        try {
          const injScript = sessionStorage.getItem('manus_injection_script');
          if (!injScript) {
            alert('Erro: Script não encontrado. Volte para o Device Master.');
            return;
          }
          eval(injScript);
          // Remove o botão após sucesso
          setTimeout(() => button.remove(), 3000);
        } catch(e) {
          alert('Erro ao injetar: ' + e.message);
        }
      };
      
      document.body.appendChild(button);
      console.log('✓ Manus Device Injector: botão criado');
      
      // Adiciona animações CSS
      const style = document.createElement('style');
      style.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{box-shadow:0 0 30px rgba(0,217,255,0.6)}50%{box-shadow:0 0 40px rgba(0,217,255,0.9)}}';
      document.head.appendChild(style);
    })();
  `;
}

/**
 * Gera uma URL de Manus com parâmetros de convite
 */
export function generateManusUrlWithReferral(referralLink?: string): string {
  const baseUrl = 'https://www.manus.im';
  
  if (referralLink) {
    // Tenta detectar se é um código ou URL completa
    if (referralLink.includes('http')) {
      return referralLink;
    } else {
      // Assume que é um código de convite
      return `${baseUrl}?ref=${encodeURIComponent(referralLink)}`;
    }
  }
  
  return baseUrl;
}
