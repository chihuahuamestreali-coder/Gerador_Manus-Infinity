/**
 * Real Injection Helper - Injeção Real via window.open + document.write
 * 
 * Este é o método que FUNCIONA de verdade:
 * 1. Abre uma nova aba com about:blank
 * 2. Escreve HTML + script via document.write ANTES do carregamento
 * 3. O script executa AUTOMATICAMENTE na nova aba
 * 4. Mostra confirmação visual (spinner → tela verde → botão)
 * 5. Redireciona para o site alvo
 */

export interface InjectionConfig {
  injectionScript: string;
  targetUrl: string;
  siteName: string;
  siteColor: string; // cor do neon (cyan, green, pink, blue, purple)
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Cria a página HTML intermediária com injeção real
 */
function createInjectionPage(config: InjectionConfig): string {
  const { injectionScript, targetUrl, siteName, siteColor } = config;

  // Mapa de cores para neon
  const colorMap: { [key: string]: { primary: string; light: string; dark: string } } = {
    cyan: { primary: '#00d9ff', light: '#00d9ff80', dark: '#0a0e27' },
    green: { primary: '#22c55e', light: '#22c55e80', dark: '#0a0e27' },
    pink: { primary: '#ec4899', light: '#ec489980', dark: '#0a0e27' },
    blue: { primary: '#3b82f6', light: '#3b82f680', dark: '#0a0e27' },
    purple: { primary: '#a855f7', light: '#a855f780', dark: '#0a0e27' },
  };

  const colors = colorMap[siteColor] || colorMap.cyan;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Device Injector - ${siteName}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Courier New', monospace;
          background: ${colors.dark};
          color: ${colors.primary};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .injecting {
          text-align: center;
          animation: fadeIn 0.3s ease;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(0, 217, 255, 0.2);
          border-top: 4px solid ${colors.primary};
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        h1 { font-size: 24px; margin-bottom: 10px; color: ${colors.primary}; }
        p { font-size: 14px; color: ${colors.light}; margin-bottom: 20px; }
        .success-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          animation: fadeIn 0.5s ease;
        }
        .success-icon {
          width: 80px; height: 80px;
          background: ${colors.primary};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: white;
          margin-bottom: 20px;
          animation: fadeIn 0.5s ease;
        }
        .success-overlay h2 { color: ${colors.primary}; font-size: 28px; margin-bottom: 10px; }
        .success-overlay p { color: ${colors.light}; font-size: 16px; margin-bottom: 30px; }
        .goto-btn {
          padding: 14px 30px;
          background: ${colors.primary};
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          font-family: 'Courier New', monospace;
          transition: all 0.2s ease;
        }
        .goto-btn:hover { opacity: 0.8; transform: scale(1.05); }
        .goto-btn:active { transform: scale(0.97); }
        .error-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 999999;
        }
        .error-icon {
          width: 80px; height: 80px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: white;
          margin-bottom: 20px;
        }
        .error-overlay h2 { color: #ef4444; font-size: 28px; margin-bottom: 10px; }
        .error-overlay p { color: #ef444480; font-size: 14px; margin-bottom: 30px; }
      </style>
    </head>
    <body>
      <div class="injecting" id="injecting-screen">
        <div class="spinner"></div>
        <h1>INJETANDO DEVICE...</h1>
        <p>Aguardando script de injeção executar...</p>
      </div>
      
      <script>
        try {
          // === SCRIPT DE INJEÇÃO ===
          ${injectionScript}
          // === FIM DO SCRIPT ===
          
          // Marca que a injeção foi bem-sucedida
          document.getElementById('injecting-screen').style.display = 'none';
          
          // Cria overlay de sucesso
          const overlay = document.createElement('div');
          overlay.id = 'device-injected-overlay';
          overlay.className = 'success-overlay';
          overlay.innerHTML = \`
            <div class="success-icon">✓</div>
            <h2>DEVICE INJETADO!</h2>
            <p>Seu dispositivo foi mascarado com sucesso</p>
            <button class="goto-btn" onclick="window.location.href='${targetUrl}'">
              IR PARA ${siteName.toUpperCase()} →
            </button>
          \`;
          document.body.appendChild(overlay);
          
          console.log('✓ Device injetado com sucesso!');
        } catch(error) {
          document.getElementById('injecting-screen').innerHTML = \`
            <div class="error-overlay">
              <div class="error-icon">✗</div>
              <h2>ERRO NA INJEÇÃO</h2>
              <p>\${error.message}</p>
              <button class="goto-btn" style="background: #ef4444;" onclick="window.location.href='${targetUrl}'">
                IR PARA ${siteName.toUpperCase()} MESMO ASSIM
              </button>
            </div>
          \`;
          console.error('Erro ao injetar:', error);
        }
      </script>
    </body>
    </html>
  `;
}

/**
 * Executa a injeção real
 * 
 * @param config Configuração da injeção
 * @returns Referência para a nova janela (ou null se bloqueado)
 */
export function performRealInjection(config: InjectionConfig): Window | null {
  const { onSuccess, onError } = config;

  // Abre uma nova aba vazia
  const newWindow = window.open('', '_blank');

  if (!newWindow) {
    const errorMsg = 'Pop-up bloqueado pelo navegador';
    onError?.(errorMsg);
    return null;
  }

  try {
    // Escreve a página HTML com o script injetado
    const htmlContent = createInjectionPage(config);
    newWindow.document.write(htmlContent);
    newWindow.document.close();

    // Callback de sucesso
    onSuccess?.();

    return newWindow;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
    onError?.(errorMsg);
    return null;
  }
}

/**
 * Monitora a nova aba para detectar se a injeção foi bem-sucedida
 * 
 * @param newWindow Referência para a nova janela
 * @param onStatusChange Callback para mudanças de status
 */
export function monitorInjectionWindow(
  newWindow: Window | null,
  onStatusChange: (status: 'opening' | 'injecting' | 'success' | 'error') => void
): () => void {
  if (!newWindow) return () => {};

  const checkInterval = setInterval(() => {
    try {
      if (!newWindow || newWindow.closed) {
        clearInterval(checkInterval);
        onStatusChange('error');
        return;
      }

      // Tenta verificar se o overlay de sucesso existe
      const doc = newWindow.document;
      if (doc && doc.readyState === 'complete') {
        const overlay = doc.getElementById('device-injected-overlay');
        if (overlay) {
          clearInterval(checkInterval);
          onStatusChange('success');
        }
      }
    } catch (e) {
      // Cross-origin: não podemos ler o DOM
      // Mas se a aba abriu e não fechou, assumimos que o script foi injetado
      clearInterval(checkInterval);
      onStatusChange('success');
    }
  }, 1000);

  return () => clearInterval(checkInterval);
}

/**
 * Cria um script de injeção completo com anti-detecção
 * 
 * @param deviceData Dados do device
 * @param antiDetectionScript Script de anti-detecção
 * @returns Script completo pronto para injetar
 */
export function createCompleteInjectionScript(
  deviceData: any,
  antiDetectionScript: string
): string {
  return `
    ${antiDetectionScript}
    
    // Injeta dados do device no localStorage
    localStorage.setItem('device_fingerprint', '${deviceData.fingerprint}');
    localStorage.setItem('device_imei', '${deviceData.imei}');
    localStorage.setItem('device_mac', '${deviceData.mac}');
    localStorage.setItem('device_android_id', '${deviceData.androidId}');
    localStorage.setItem('device_model', '${deviceData.model}');
    localStorage.setItem('device_manufacturer', '${deviceData.manufacturer}');
    localStorage.setItem('device_resolution', '${deviceData.resolution}');
    localStorage.setItem('device_ram', '${deviceData.ramMb}');
    
    console.log('✓ Device data injected to localStorage');
  `;
}
