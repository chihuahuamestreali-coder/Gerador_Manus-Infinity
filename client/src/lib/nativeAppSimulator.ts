/**
 * Native App Simulator — Simulação de App Nativo (versão parametrizada)
 * Injeta scripts que simulam as propriedades internas que apps móveis
 * (Instagram, AliExpress, Facebook, TikTok) procuram no WebView/embedded browser,
 * enganando a detecção "navegador vs app nativo".
 *
 * Recebe userAgent e deviceId reais do perfil gerado, garantindo consistência
 * entre o device fake e o WebView simulado.
 *
 * Ativar a checkbox do módulo inclui este script no fluxo de injeção.
 */

export interface AppSimulationOptions {
  platform: 'instagram' | 'aliexpress' | 'tiktok' | 'facebook' | 'temu' | 'universal';
  locale?: string;
  appVersion?: string;
}

/**
 * Gera o script de simulação de app nativo conforme a plataforma.
 * Recebe userAgent e deviceId reais do perfil gerado.
 */
export function generateNativeAppSimulationForProfile(
  options: {
    platform: AppSimulationOptions['platform'];
    userAgent: string;
    imei: string;
    locale?: string;
  }
): string {
  const locale = (options.locale || 'pt_BR').replace('-', '_');
  const data = {
    appVersionIG: '320.0.0.32.109',
    appVersionAE: '10.45.1',
    appVersionFB: '543.0.0.67.95',
    appVersionTT: '36.2.4'
  };

  switch (options.platform) {
    case 'instagram':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.InstagramWebView = { isPresent: true, version: '${data.appVersionIG}', locale: '${locale}', deviceId: '${options.imei}' };
            window.isFacebookAuthWebView = true;
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = { postMessage: function(){}, injectJSON: function(){}, canGoBack: true, canGoForward: false };
            }
            window.__APP_ENV__ = 'native';
            window.__NATIVE_SHELL__ = true;
            window.CatalystApp = { isIGApp: true, appVersion: '${data.appVersionIG}' };
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} Instagram ${data.appVersionIG} Android (33/13; 480dpi; 1080x2270; Samsung; SM-G991B; o1s; exynos2100; ${locale}; 564618679)"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c📱 Simulação de App Nativo Instagram ATIVA', 'color: #e1306c; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'aliexpress':
      return `
        (function() {
          try {
            window.__app_env__ = 'native';
            window.isAliExpressApp = true;
            window.AliApp = { version: '${data.appVersionAE}', platform: 'Android', osVersion: '13', deviceId: '${options.imei}', utdid: '${options.imei}', locale: '${locale}' };
            if (!window.Android) {
              window.Android = { openURL: function(){}, share: function(){}, getDeviceInfo: function(){ return JSON.stringify({deviceId: '${options.imei}', appVersion: '${data.appVersionAE}'}); } };
            }
            window.WindVane = window.WindVane || { call: function(api, params, success, fail){ if (success) success({}); }, isAvailable: true };
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} AliApp/Android/${data.appVersionAE} Channel/${locale} WindVane/3.1.0"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c🛒 Simulação de App Nativo AliExpress ATIVA (preços de app habilitados)', 'color: #ff4747; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'facebook':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.isFacebookAuthWebView = true;
            window.FacebookBridge = { present: true, version: '${data.appVersionFB}', locale: '${locale}' };
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = { postMessage: function(){} };
            }
            window.__APP_ENV__ = 'native';
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} [FBAN/FB4A;FBAV/${data.appVersionFB};FBBV/1004704985;FBDM/{density=3.0,width=1080,height=2270};FBLC/${locale};FBMF/Samsung;FBBD/Samsung;FBPN/com.facebook.katana;FBDV/SM-G991B;FBSV/13;FBOP/1;FBCA/arm64-v8a:]"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c📘 Simulação de App Nativo Facebook ATIVA', 'color: #1877f2; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'tiktok':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.TikTokApp = { isPresent: true, version: '${data.appVersionTT}', locale: '${locale}', deviceId: '${options.imei}' };
            window.__APP_ENV__ = 'native';
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = { postMessage: function(){} };
            }
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} TikTok ${data.appVersionTT} Android (13/SM-G991B; ${locale})"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c🎵 Simulação de App Nativo TikTok ATIVA', 'color: #25f4ee; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'temu':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.isTemuApp = true;
            window.TemuBridge = { isPresent: true, version: '3.45.0', locale: '${locale}', deviceId: '${options.imei}', appType: 'shopping_app' };
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = { postMessage: function(){}, injectJSON: function(){}, canGoBack: true, canGoForward: false };
            }
            window.__APP_ENV__ = 'native';
            window.__NATIVE_SHELL__ = true;
            window.__TEMU_DEEP_LINK__ = true;
            window.__NEW_USER_COUPON_ACTIVE__ = true;
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} TemuApp/3.45.0 Android/13 (SM-G991B; ${locale}; app_store)"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c🛍️ Simulação de App Nativo TEMU ATIVA (Bypass de Preços & Cupons de Novo Usuário)', 'color: #ff6600; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    default:
      return '';
  }
}

/**
 * Alias mantido para compatibilidade com código existente.
 */
export function generateNativeAppSimulation(
  options: AppSimulationOptions
): string {
  return generateNativeAppSimulationForProfile({
    platform: options.platform,
    userAgent: '',
    imei: '',
    locale: options.locale,
  });
}
